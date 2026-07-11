import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email, password, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required' }, { status: 400 });
    }

    if (type !== 'login' && type !== 'reset') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Verify user exists
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    // For login type, verify password first
    if (type === 'login') {
      if (!password) {
        return NextResponse.json({ error: 'Password is required for login verification' }, { status: 400 });
      }
      if (!user.password) {
        return NextResponse.json({ error: 'This account uses Google login. Please sign in with Google.' }, { status: 400 });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
    }

    // For reset type, verify user has a password-based account
    if (type === 'reset') {
      if (!user.password) {
        return NextResponse.json({ error: 'This account uses Google login. Password reset is not available.' }, { status: 400 });
      }
    }

    // Invalidate any existing unused OTPs for this email and type
    const existingOtps = await db
      .select()
      .from(schema.otpCodes)
      .where(and(eq(schema.otpCodes.email, email), eq(schema.otpCodes.type, type), eq(schema.otpCodes.used, false)));

    for (const otp of existingOtps) {
      await db
        .update(schema.otpCodes)
        .set({ used: true })
        .where(eq(schema.otpCodes.id, otp.id));
    }

    // Generate and store OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await db.insert(schema.otpCodes).values({
      email,
      code,
      type,
      expiresAt,
    });

    // Send OTP email
    await sendOTPEmail(email, code, type);

    console.log(`[OTP] Sent ${type} OTP to ${email}`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('[OTP] Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
  }
}
