import { NextRequest, NextResponse } from 'next/server';
import { databases, PAYMENTS_COLLECTION_ID, USERS_COLLECTION_ID, DATABASE_ID } from '@/lib/appwrite';

export async function GET(request: NextRequest) {
  try {
    // Get all payments
    const paymentsResponse = await databases.listDocuments(
      DATABASE_ID,
      PAYMENTS_COLLECTION_ID,
      [],
      100
    );

    // Get user details for each payment
    const paymentsWithUsers = await Promise.all(
      paymentsResponse.documents.map(async (payment) => {
        try {
          const userResponse = await databases.getDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            payment.userId
          );
          
          return {
            ...payment,
            user: {
              fullName: userResponse.fullName,
              email: userResponse.email,
              phone: userResponse.phone,
            }
          };
        } catch (error) {
          // If user not found, return payment without user details
          return {
            ...payment,
            user: {
              fullName: 'Unknown User',
              email: 'No email',
              phone: 'No phone',
            }
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      payments: paymentsWithUsers
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
} 