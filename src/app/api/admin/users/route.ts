import { NextRequest, NextResponse } from 'next/server';
import { databases, USERS_COLLECTION_ID, DATABASE_ID } from '@/lib/appwrite';

export async function GET(request: NextRequest) {
  try {
    // Get all users
    const usersResponse = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [],
      100
    );

    return NextResponse.json({
      success: true,
      users: usersResponse.documents
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 