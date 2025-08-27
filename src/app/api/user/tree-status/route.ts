import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('skn_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = verifyAuthToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
      .setProject(process.env.APPWRITE_PROJECT_ID as string)
      .setKey(process.env.APPWRITE_API_KEY as string);

    const databases = new Databases(client);

    // Get current user's tree status
    const userQuery = await databases.listDocuments(
      process.env.DATABASE_ID as string,
      process.env.USERS_COLLECTION_ID as string,
      [Query.equal('$id', user.uid), Query.limit(1)]
    );

    if (userQuery.total === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const userData = userQuery.documents[0];
    
    return NextResponse.json({
      success: true,
      data: {
        leftCount: userData.leftCount || 0,
        rightCount: userData.rightCount || 0,
        childStatus: userData.childStatus || 'bothAvailable',
        status: userData.status || 'paymentpending',
        canAddLeft: (userData.leftCount || 0) === 0,
        canAddRight: (userData.rightCount || 0) === 0,
        canAddAny: (userData.leftCount || 0) === 0 || (userData.rightCount || 0) === 0
      }
    });

  } catch (error) {
    console.error('Tree status error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 