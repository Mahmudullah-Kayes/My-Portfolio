import { NextResponse } from 'next/server';
import { pingSupabase } from '../../../utils/keepAlive';

// This function will be called when the API route is accessed
export async function GET() {
  try {
    const result = await pingSupabase();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Supabase pinged successfully',
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error('Error in keep-alive route:', error);
    return NextResponse.json(
      { error: 'Failed to ping Supabase' },
      { status: 500 }
    );
  }
} 