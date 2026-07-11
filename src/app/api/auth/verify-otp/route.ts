import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, code, type } = await request.json();

    if (!email || !code || !type) {
      return NextResponse.json({ error: 'Email, code, and type are required' }, { status: 400 });
    }

    // Find matching OTP
    const [otp] = await db
      .select()
      .from(schema.otpCodes)
      .where(
        and(
          eq(schema.otpCodes.email, email),
          eq(schema.otpCodes.code, code),
          eq(schema.otpCodes.type, type),
          eq(schema.otpCodes.used, false),
          gt(schema.otpCodes.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!otp) {
      return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new one.' }, { status: 400 });
    }

    // Mark OTP as used
    await db
      .update(schema.otpCodes)
      .set({ used: true })
      .where(eq(schema.otpCodes.id, otp.id));

    console.log(`[OTP] Verified ${type} OTP for ${email}`);

    return NextResponse.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('[OTP] Error verifying OTP:', error);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
