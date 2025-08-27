import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Client, Databases, Query, Account, Users } from 'node-appwrite';
import { createAuthToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
      .setProject(process.env.APPWRITE_PROJECT_ID as string)
      .setKey(process.env.APPWRITE_API_KEY as string);

    const databases = new Databases(client);

    // 1) Try Appwrite Auth first (what you added manually)
    try {
      const account = new Account(client);
      const users = new Users(client);
      await account.createEmailPasswordSession(email, password);
      const authUser = await account.get();

      console.log('Login Debug:', { userId: authUser.$id, adminId: process.env.ADMIN_ID });

      // Get additional user info
      let userInfo: any = { uid: authUser.$id, email: authUser.email };
      try {
        const full = await users.get(authUser.$id);
        userInfo = { 
          uid: authUser.$id, 
          email: authUser.email,
          username: (full as any).username,
          createdAt: authUser.$createdAt
        };
        console.log('User info from Auth:', userInfo);
      } catch (error) {
        console.log('Error getting user details:', error);
      }

      const token = createAuthToken(userInfo);
      const role = userInfo.uid === process.env.ADMIN_ID ? 'admin' : 'user';
      const response = NextResponse.json({ success: true, role });
      response.cookies.set('skn_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    } catch (e) {
      // fall back to users collection below
    }

    // 2) Fallback: custom users collection (legacy)
    let userDoc: any = null;
    try {
      const byEmail = await databases.listDocuments(
        process.env.DATABASE_ID as string,
        process.env.USERS_COLLECTION_ID as string,
        [Query.equal('email', email), Query.limit(1)]
      );
      if (byEmail.total > 0) userDoc = byEmail.documents[0];
    } catch (e) {
      return NextResponse.json({ success: false, error: 'User lookup failed' }, { status: 500 });
    }

    if (!userDoc) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const storedHash: string | undefined = (userDoc.passwordHash as string) || (userDoc.password as string);
    if (!storedHash) {
      return NextResponse.json({ success: false, error: 'Password not set' }, { status: 401 });
    }

    let ok = false;
    try { ok = await bcrypt.compare(password, storedHash); } catch {}
    if (!ok) ok = password === storedHash;

    if (!ok) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    console.log('Login Debug (fallback):', { userId: userDoc.authId || userDoc.$id, adminId: process.env.ADMIN_ID });

    const userInfo = {
      uid: userDoc.authId || userDoc.$id,
      email: userDoc.email,
      username: userDoc.username,
      createdAt: userDoc.$createdAt
    };
    console.log('User info from DB:', userInfo);

    const token = createAuthToken(userInfo);
    const role = userInfo.uid === process.env.ADMIN_ID ? 'admin' : 'user';
    const response = NextResponse.json({ success: true, role });
    response.cookies.set('skn_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 