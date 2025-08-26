const { Client, Databases, Account } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const account = new Account(client);

    // Parse request body
    const {
      pinCode,
      username,
      email,
      phone,
      fullName,
      underUserId,
      leg,
      sponsorId,
      password,
      idempotencyKey
    } = JSON.parse(req.body);

    // Validate required fields
    if (!pinCode || !username || !email || !phone || !fullName || !underUserId || !leg || !password) {
      return res.json({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }

    // Check idempotency
    try {
      const existingEvent = await databases.getDocument(
        process.env.DATABASE_ID,
        process.env.EVENTS_COLLECTION_ID,
        idempotencyKey
      );
      return res.json({
        success: false,
        error: 'Duplicate request'
      }, 409);
    } catch (e) {
      // Event doesn't exist, continue
    }

    // Validate PIN
    const pinQuery = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.PINS_COLLECTION_ID,
      [
        `code=${pinCode}`,
        'status=unused'
      ]
    );

    if (pinQuery.documents.length === 0) {
      return res.json({
        success: false,
        error: 'Invalid or used PIN code'
      }, 400);
    }

    const pin = pinQuery.documents[0];

    // Check if PIN is expired
    if (pin.expiresAt && new Date(pin.expiresAt) < new Date()) {
      return res.json({
        success: false,
        error: 'PIN code has expired'
      }, 400);
    }

    // Validate placement
    const parentQuery = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.TREE_NODES_COLLECTION_ID,
      [`userId=${underUserId}`]
    );

    if (parentQuery.documents.length === 0) {
      return res.json({
        success: false,
        error: 'Invalid parent user'
      }, 400);
    }

    const parentNode = parentQuery.documents[0];

    // Check if leg is available
    if (leg === 'left' && parentNode.leftChildId) {
      return res.json({
        success: false,
        error: 'Left leg is already occupied'
      }, 400);
    }

    if (leg === 'right' && parentNode.rightChildId) {
      return res.json({
        success: false,
        error: 'Right leg is already occupied'
      }, 400);
    }

    // Create user account
    let authUser;
    try {
      authUser = await account.create(
        'unique()',
        email,
        phone,
        password,
        fullName
      );
    } catch (e) {
      return res.json({
        success: false,
        error: 'Failed to create user account: ' + e.message
      }, 400);
    }

    // Create user profile
    const userDoc = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.USERS_COLLECTION_ID,
      'unique()',
      {
        authId: authUser.$id,
        username: username.toLowerCase(),
        email,
        phone,
        fullName,
        sponsorId: sponsorId || null,
        underUserId,
        leg,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
        profileImage: null
      }
    );

    // Create tree node
    const ancestors = [...parentNode.ancestors, underUserId];
    const depth = parentNode.depth + 1;

    const treeNode = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.TREE_NODES_COLLECTION_ID,
      'unique()',
      {
        userId: userDoc.$id,
        parentUserId: underUserId,
        leg,
        ancestors,
        depth,
        leftChildId: null,
        rightChildId: null,
        createdAt: new Date().toISOString()
      }
    );

    // Update parent node
    const updateData = {};
    if (leg === 'left') {
      updateData.leftChildId = userDoc.$id;
    } else {
      updateData.rightChildId = userDoc.$id;
    }

    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.TREE_NODES_COLLECTION_ID,
      parentNode.$id,
      updateData
    );

    // Mark PIN as used
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.PINS_COLLECTION_ID,
      pin.$id,
      {
        status: 'used',
        usedByUserId: userDoc.$id,
        usedAt: new Date().toISOString()
      }
    );

    // Create initial user stats
    await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.USER_STATS_COLLECTION_ID,
      'unique()',
      {
        userId: userDoc.$id,
        leftCount: 0,
        rightCount: 0,
        totalCount: 0,
        directCount: 0,
        currentRank: '0 Star',
        highestRank: '0 Star',
        totalEarnings: 0,
        lastUpdated: new Date().toISOString()
      }
    );

    // Propagate counts to ancestors
    for (const ancestorId of ancestors) {
      const ancestorStats = await databases.listDocuments(
        process.env.DATABASE_ID,
        process.env.USER_STATS_COLLECTION_ID,
        [`userId=${ancestorId}`]
      );

      if (ancestorStats.documents.length > 0) {
        const stats = ancestorStats.documents[0];
        const updateData = {};

        // Find the leg path to this ancestor
        const ancestorNode = await databases.listDocuments(
          process.env.DATABASE_ID,
          process.env.TREE_NODES_COLLECTION_ID,
          [`userId=${ancestorId}`]
        );

        if (ancestorNode.documents.length > 0) {
          const node = ancestorNode.documents[0];
          const childIndex = node.ancestors.indexOf(underUserId);
          
          if (childIndex !== -1) {
            // This ancestor is in the path, update the appropriate leg
            const childNode = await databases.listDocuments(
              process.env.DATABASE_ID,
              process.env.TREE_NODES_COLLECTION_ID,
              [`userId=${underUserId}`]
            );

            if (childNode.documents.length > 0) {
              const childLeg = childNode.documents[0].leg;
              if (childLeg === 'left') {
                updateData.leftCount = stats.leftCount + 1;
              } else {
                updateData.rightCount = stats.rightCount + 1;
              }
              updateData.totalCount = updateData.leftCount + updateData.rightCount;
              updateData.lastUpdated = new Date().toISOString();

              await databases.updateDocument(
                process.env.DATABASE_ID,
                process.env.USER_STATS_COLLECTION_ID,
                stats.$id,
                updateData
              );
            }
          }
        }
      }
    }

    // Check for reward unlocks
    await checkAndAwardRewards(databases, userDoc.$id);

    // Record event
    await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID,
      idempotencyKey,
      {
        type: 'account_created',
        refId: userDoc.$id,
        payload: JSON.stringify({
          username,
          email,
          underUserId,
          leg
        }),
        idempotencyKey,
        userId: userDoc.$id,
        createdAt: new Date().toISOString()
      }
    );

    return res.json({
      success: true,
      userId: userDoc.$id,
      message: 'Account created successfully'
    });

  } catch (err) {
    error('Function error: ' + err.message);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
};

async function checkAndAwardRewards(databases, userId) {
  try {
    // Get user stats
    const statsQuery = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.USER_STATS_COLLECTION_ID,
      [`userId=${userId}`]
    );

    if (statsQuery.documents.length === 0) return;

    const stats = statsQuery.documents[0];
    const totalCount = stats.totalCount;

    // Get reward tiers
    const tiersQuery = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.REWARD_TIERS_COLLECTION_ID,
      ['isActive=true'],
      100
    );

    for (const tier of tiersQuery.documents) {
      if (totalCount >= tier.threshold) {
        // Check if reward already awarded
        const existingReward = await databases.listDocuments(
          process.env.DATABASE_ID,
          process.env.USER_REWARDS_COLLECTION_ID,
          [
            `userId=${userId}`,
            `tierOrder=${tier.order}`
          ]
        );

        if (existingReward.documents.length === 0) {
          // Award reward
          const rewardId = 'unique()';
          await databases.createDocument(
            process.env.DATABASE_ID,
            process.env.USER_REWARDS_COLLECTION_ID,
            rewardId,
            {
              userId,
              tierOrder: tier.order,
              rank: tier.rank,
              bonusRs: tier.bonusRs,
              status: 'pending',
              awardedAt: new Date().toISOString(),
              paidAt: null,
              eventId: `reward_${userId}_${tier.order}_${Date.now()}`,
              notes: null
            }
          );

          // Update user rank
          await databases.updateDocument(
            process.env.DATABASE_ID,
            process.env.USER_STATS_COLLECTION_ID,
            stats.$id,
            {
              currentRank: tier.rank,
              highestRank: tier.rank,
              lastUpdated: new Date().toISOString()
            }
          );
        }
      }
    }
  } catch (err) {
    console.error('Error checking rewards:', err);
  }
} 