const { Client, Databases, Teams } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const teams = new Teams(client);

    // Parse request body
    const {
      paymentId,
      action,
      notes,
      adminUserId,
      idempotencyKey
    } = JSON.parse(req.body);

    // Validate required fields
    if (!paymentId || !action || !adminUserId || !idempotencyKey) {
      return res.json({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return res.json({
        success: false,
        error: 'Invalid action. Must be "approve" or "reject"'
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

    // Verify admin permissions
    try {
      const adminMemberships = await teams.listMemberships(process.env.ADMIN_TEAM_ID || 'admins');
      const isAdmin = adminMemberships.memberships.some(member => member.userId === adminUserId);
      
      if (!isAdmin) {
        return res.json({
          success: false,
          error: 'Admin access required'
        }, 403);
      }
    } catch (e) {
      return res.json({
        success: false,
        error: 'Failed to verify admin permissions'
      }, 403);
    }

    // Get payment document
    let payment;
    try {
      payment = await databases.getDocument(
        process.env.DATABASE_ID,
        process.env.PAYMENTS_COLLECTION_ID,
        paymentId
      );
    } catch (e) {
      return res.json({
        success: false,
        error: 'Payment not found'
      }, 404);
    }

    // Check if payment is already processed
    if (payment.status !== 'submitted') {
      return res.json({
        success: false,
        error: 'Payment already processed'
      }, 400);
    }

    // Update payment status
    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedBy: adminUserId,
      reviewedAt: new Date().toISOString(),
      notes: notes || null
    };

    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.PAYMENTS_COLLECTION_ID,
      paymentId,
      updateData
    );

    let generatedPins = [];

    // If approved, generate PIN codes
    if (action === 'approve') {
      const pinCount = Math.ceil(payment.amount / 1000); // 1 PIN per 1000 Rs
      generatedPins = await generatePins(databases, pinCount, 'paid', payment.userId);
    }

    // Record event
    await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.EVENTS_COLLECTION_ID,
      idempotencyKey,
      {
        type: 'payment_reviewed',
        refId: paymentId,
        payload: JSON.stringify({
          action,
          adminUserId,
          amount: payment.amount,
          generatedPins: generatedPins.length
        }),
        idempotencyKey,
        userId: payment.userId,
        createdAt: new Date().toISOString()
      }
    );

    return res.json({
      success: true,
      message: `Payment ${action}d successfully`,
      generatedPins: action === 'approve' ? generatedPins : [],
      paymentStatus: updateData.status
    });

  } catch (err) {
    error('Function error: ' + err.message);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
};

async function generatePins(databases, count, type, createdBy) {
  const pins = [];
  
  for (let i = 0; i < count; i++) {
    const pinCode = generatePinCode();
    
    try {
      const pin = await databases.createDocument(
        process.env.DATABASE_ID,
        process.env.PINS_COLLECTION_ID,
        'unique()',
        {
          code: pinCode,
          status: 'unused',
          type,
          createdBy,
          usedByUserId: null,
          usedAt: null,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          createdAt: new Date().toISOString()
        }
      );
      
      pins.push({
        id: pin.$id,
        code: pinCode,
        type,
        expiresAt: pin.expiresAt
      });
    } catch (e) {
      // If PIN already exists, try again
      i--;
      continue;
    }
  }
  
  return pins;
}

function generatePinCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 