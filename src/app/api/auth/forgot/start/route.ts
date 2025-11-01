import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Please register first or email is not available please register' }, { status: 404 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { email },
    data: {
      resetOtp: code,
      resetOtpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Password Reset - Wooden Art</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #92400e 0%, #d97706 50%, #f59e0b 100%); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">🪵 Wooden Art</h1>
                    <p style="color: #fff8dc; margin: 10px 0 0 0; font-size: 14px; font-weight: 300;">Crafting Excellence in Wood</p>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Password Reset Request 🔐</h2>
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">We received a request to reset your password for your <strong style="color: #d97706;">Wooden Art</strong> account.</p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Use the verification code below to reset your password:</p>
                    
                    <!-- OTP Code -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding: 0 0 30px 0;">
                          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 3px solid #f59e0b; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);">
                            <p style="color: #92400e; font-size: 14px; margin: 0 0 15px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                            <h1 style="color: #d97706; font-size: 48px; letter-spacing: 12px; margin: 0; font-family: 'Courier New', monospace; font-weight: bold; text-align: center;">${code}</h1>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Important Info -->
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 30px 0;">
                      <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>⏰ Important:</strong> This verification code will expire in <strong>10 minutes</strong>. Enter this code on the password reset page to continue.
                      </p>
                    </div>
                    
                    <!-- Security Warning -->
                    <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 6px; margin: 30px 0;">
                      <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>⚠️ Security Notice:</strong> If you did not request a password reset, please ignore this email. Your password will remain unchanged. If you're concerned about your account security, please contact our support team immediately.
                      </p>
                    </div>
                    
                    <!-- Divider -->
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <!-- Footer Note -->
                    <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">
                      <strong style="color: #374151;">Need help?</strong><br>
                      If you're having trouble resetting your password, please contact our support team for assistance.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #1f2937; padding: 30px; border-radius: 0 0 12px 12px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Wooden Art. All rights reserved.</p>
                    <p style="color: #6b7280; font-size: 11px; margin: 0;">This is an automated email. Please do not reply to this message.</p>
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
    'Your Wooden Art password reset code',
    emailHtml
  );

  return NextResponse.json({ ok: true });
}


