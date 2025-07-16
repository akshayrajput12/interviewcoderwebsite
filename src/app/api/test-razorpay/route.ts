import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Check environment variables
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    return NextResponse.json({
      success: true,
      config: {
        razorpay_key_id_exists: !!razorpayKeyId,
        razorpay_key_secret_exists: !!razorpayKeySecret,
        public_key_id_exists: !!publicKeyId,
        razorpay_key_id_length: razorpayKeyId?.length || 0,
        razorpay_key_secret_length: razorpayKeySecret?.length || 0,
        public_key_id_length: publicKeyId?.length || 0,
        razorpay_key_id_prefix: razorpayKeyId?.substring(0, 8) || 'missing',
        public_key_id_prefix: publicKeyId?.substring(0, 8) || 'missing',
      },
    });
  } catch (error) {
    console.error('Test Razorpay error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
