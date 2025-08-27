import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID } from 'node-appwrite';
import bcrypt from 'bcryptjs';
import { createAuthToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const {
      pinToken,
      username,
      email,
      phone,
      accountNumber,
      paymentMethod,
      accountTitle,
      underUserId,
      leg,
      password
    } = await request.json();

    // Validation
    const errors: Record<string, string> = {};
    
    if (!pinToken?.trim()) errors.pinToken = 'Pin/Token is required';
    if (!username?.trim()) errors.username = 'Username is required';
    if (!email?.trim()) errors.email = 'Email is required';
    if (!phone?.trim()) errors.phone = 'Phone is required';
    if (!accountNumber?.trim()) errors.accountNumber = 'Account Number is required';
    if (!paymentMethod?.trim()) errors.paymentMethod = 'Payment Method is required';
    if (!accountTitle?.trim()) errors.accountTitle = 'Account Title is required';
    if (!underUserId?.trim()) errors.underUserId = 'Under User ID is required';
    if (!leg?.trim()) errors.leg = 'Leg selection is required';
    if (!password?.trim()) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ 
        success: false, 
        errors 
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(password)) {
      errors.password = 'Password must contain at least one number';
    }

    if (errors.password) {
      return NextResponse.json({ 
        success: false, 
        errors 
      }, { status: 400 });
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
      .setProject(process.env.APPWRITE_PROJECT_ID as string)
      .setKey(process.env.APPWRITE_API_KEY as string);

    const databases = new Databases(client);

    // 1. Validate pin/token exists and is unused
    try {
      const pinQuery = await databases.listDocuments(
        process.env.DATABASE_ID as string,
        process.env.PINS_COLLECTION_ID as string,
        [/* Add query for pin validation */]
      );
      
      // TODO: Add pin validation logic
      // Check if pin exists and is not used
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid pin/token' 
      }, { status: 400 });
    }

    // 2. Check if parent user exists and has available slot
    let parentUser;
    try {
      const parentQuery = await databases.listDocuments(
        process.env.DATABASE_ID as string,
        process.env.USERS_COLLECTION_ID as string,
        [/* Add query to find parent user */]
      );
      
      if (parentQuery.total === 0) {
        return NextResponse.json({ 
          success: false, 
          error: 'Parent user not found' 
        }, { status: 400 });
      }
      
      parentUser = parentQuery.documents[0];
      
      // Check if the selected leg is available
      if (leg === 'left' && parentUser.leftCount >= 1) {
        return NextResponse.json({ 
          success: false, 
          error: 'Left position is already occupied' 
        }, { status: 400 });
      }
      
      if (leg === 'right' && parentUser.rightCount >= 1) {
        return NextResponse.json({ 
          success: false, 
          error: 'Right position is already occupied' 
        }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Error validating parent user' 
      }, { status: 500 });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user
    const newUser = {
      username,
      email,
      phone,
      password: hashedPassword,
      underUserId,
      leg,
      status: 'paymentpending',
      leftCount: 0,
      rightCount: 0,
      childStatus: 'bothAvailable',
      stars: 0,
      profileImage: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let createdUser;
    try {
      createdUser = await databases.createDocument(
        process.env.DATABASE_ID as string,
        process.env.USERS_COLLECTION_ID as string,
        ID.unique(),
        newUser
      );
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create account' 
      }, { status: 500 });
    }

    // 5. Update parent's counts
    try {
      const updateData: any = {};
      if (leg === 'left') {
        updateData.leftCount = parentUser.leftCount + 1;
      } else {
        updateData.rightCount = parentUser.rightCount + 1;
      }
      
      // Update childStatus based on new counts
      const newLeftCount = leg === 'left' ? updateData.leftCount : parentUser.leftCount;
      const newRightCount = leg === 'right' ? updateData.rightCount : parentUser.rightCount;
      
      if (newLeftCount >= 1 && newRightCount >= 1) {
        updateData.childStatus = 'noneAvailable';
      } else if (newLeftCount >= 1) {
        updateData.childStatus = 'rightAvailable';
      } else if (newRightCount >= 1) {
        updateData.childStatus = 'leftAvailable';
      } else {
        updateData.childStatus = 'bothAvailable';
      }
      
      updateData.updatedAt = new Date().toISOString();
      
      await databases.updateDocument(
        process.env.DATABASE_ID as string,
        process.env.USERS_COLLECTION_ID as string,
        parentUser.$id,
        updateData
      );
    } catch (error) {
      console.error('Error updating parent:', error);
      // Continue anyway, this is not critical
    }

    // 6. Update all ancestors' counts (recursive function needed)
    // TODO: Implement recursive ancestor update
    // This should increment leftCount or rightCount for all users in the path from new user to admin

    // 7. Mark pin as used
    // TODO: Update pin status to used

    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully',
      userId: createdUser.$id
    });

  } catch (error) {
    console.error('Account creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 