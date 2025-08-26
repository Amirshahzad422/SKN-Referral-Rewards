import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Call Appwrite function
    const response = await fetch(`${process.env.APPWRITE_ENDPOINT}/functions/createAccountWithPin/executions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID!,
        'X-Appwrite-Key': process.env.APPWRITE_API_KEY!,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    
    if (result.status === 'completed') {
      return NextResponse.json(JSON.parse(result.response));
    } else {
      return NextResponse.json(
        { success: false, error: 'Function execution failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 