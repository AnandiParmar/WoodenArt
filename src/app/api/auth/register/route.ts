import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { AuthService } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/lib/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const VERIFY_TTL_SEC = 15 * 60; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await User.findOne({ email }).lean();
    
    if (existing) {
      // Check if existing user is unverified and has expired token
      if (!existing.verifiedAt && existing.verificationToken) {
        try {
          // Try to verify the stored token to check if it's expired
          const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
          jwt.verify(existing.verificationToken, JWT_SECRET);
          // Token is still valid - user exists and token not expired
          return NextResponse.json({ error: 'User already exists. Please check your email for verification link.' }, { status: 409 });
        } catch (tokenError) {
          // Token is expired or invalid - delete the unverified user
          await User.deleteOne({ email });
          // Continue with registration below
        }
      } else {
        // User exists and is verified, or doesn't have a token
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }
    }

    const hashed = await AuthService.hashPassword(password);
    
    // Generate JWT token for verification
    const verificationToken = jwt.sign(
      { email, type: 'verification' },
      JWT_SECRET,
      { expiresIn: `${VERIFY_TTL_SEC}s` }
    );

    await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      role: 'USER',
      isActive: false,
      verificationToken,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const verifyUrl = `${baseUrl}/api/auth/register/verify?token=${verificationToken}`;

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify your Wooden Art account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #d97706; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; padding: 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Wooden Art</h1>
              <p style="margin: 10px 0 0 0; padding: 0; color: #fff8dc; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">Crafting Excellence in Wood</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; padding: 0; color: #1f2937; font-size: 24px; font-weight: 600; font-family: Arial, Helvetica, sans-serif;">Hello ${firstName}!</h2>
              
              <!-- Welcome Message -->
              <p style="margin: 0 0 20px 0; padding: 0; color: #374151; font-size: 16px; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">
                Thank you for registering with <strong style="color: #d97706;">Wooden Art</strong>! We're excited to have you join our community of woodcraft enthusiasts.
              </p>
              
              <p style="margin: 0 0 30px 0; padding: 0; color: #374151; font-size: 16px; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">
                To complete your registration and start exploring our beautiful wooden products, please verify your email address by clicking the button below:
              </p>
              
              <!-- Verification Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 0 0 30px 0;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background-color: #d97706; border-radius: 6px;">
                          <a href="${verifyUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; border-radius: 6px;">Verify Email Address</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Important Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; padding: 0; color: #92400e; font-size: 14px; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">
                      <strong>Important:</strong> This verification link will expire in <strong>15 minutes</strong>. If you need a new verification link, please register again.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0; padding: 0; color: #6b7280; font-size: 13px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Can't click the button?</p>
                    <p style="margin: 0 0 8px 0; padding: 0; color: #9ca3af; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">Copy and paste this link into your browser:</p>
                    <p style="margin: 0; padding: 0; color: #d97706; font-size: 11px; word-break: break-all; font-family: 'Courier New', monospace; line-height: 1.4;">${verifyUrl}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 20px 0;">
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
                  </td>
                </tr>
              </table>
              
              <!-- Footer Note -->
              <p style="margin: 20px 0 0 0; padding: 0; color: #6b7280; font-size: 13px; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">
                <strong style="color: #374151;">Didn't create an account?</strong><br>
                If you didn't register with Wooden Art, you can safely ignore this email. Your email address won't be added to our mailing list.
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px 20px; text-align: center;">
              <p style="margin: 0 0 10px 0; padding: 0; color: #9ca3af; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">&copy; ${new Date().getFullYear()} Wooden Art. All rights reserved.</p>
              <p style="margin: 0; padding: 0; color: #6b7280; font-size: 11px; font-family: Arial, Helvetica, sans-serif;">This is an automated email. Please do not reply to this message.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await sendEmail(
      email,
      'Verify your Wooden Art account',
      emailHtml
    );

    return NextResponse.json({ ok: true, message: 'Verification email sent' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


