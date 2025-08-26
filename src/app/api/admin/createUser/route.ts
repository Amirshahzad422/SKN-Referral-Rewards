import { NextRequest, NextResponse } from 'next/server';
import { databases, account, DATABASE_ID, USERS_COLLECTION_ID, TREE_NODES_COLLECTION_ID, USER_STATS_COLLECTION_ID } from '@/lib/appwrite';

export async function POST(request: NextRequest) {
  try {
    const {
      username,
      email,
      phone,
      fullName,
      password,
      adminUserId
    } = await request.json();

    // Validate required fields
    if (!username || !email || !phone || !fullName || !password || !adminUserId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }

    // Check if this is the first user (root)
    const existingUsers = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [],
      1
    );

    if (existingUsers.documents.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Root user already exists. Only one root user allowed.'
      }, 400);
    }

    // Create Appwrite auth account
    const authUser = await account.create(
      'unique()',
      email,
      phone,
      password,
      fullName
    );

    // Create user profile
    const userDoc = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      'unique()',
      {
        authId: authUser.$id,
        username: username.toLowerCase(),
        email,
        phone,
        fullName,
        sponsorId: null,
        underUserId: null, // Root user has no parent
        leg: null, // Root user has no leg
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: null,
        profileImage: null
      }
    );

    // Create root tree node
    const treeNode = await databases.createDocument(
      DATABASE_ID,
      TREE_NODES_COLLECTION_ID,
      'unique()',
      {
        userId: userDoc.$id,
        parentUserId: null, // Root has no parent
        leg: null, // Root has no leg
        ancestors: [], // Root has no ancestors
        depth: 0, // Root is at depth 0
        leftChildId: null,
        rightChildId: null,
        createdAt: new Date().toISOString()
      }
    );

    // Create initial user stats
    await databases.createDocument(
      DATABASE_ID,
      USER_STATS_COLLECTION_ID,
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

    return NextResponse.json({
      success: true,
      userId: userDoc.$id,
      message: 'Root user created successfully'
    });

  } catch (error) {
    console.error('Error creating root user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create root user' },
      { status: 500 }
    );
  }
} 