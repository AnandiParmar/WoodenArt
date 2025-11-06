import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Helper function to decode JWT token without verification to check expiry
 */
function decodeTokenWithoutVerification(token: string): { email?: string; type?: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    // Base64URL decode with proper padding
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padLength = (4 - (base64.length % 4)) % 4;
    base64 += '='.repeat(padLength);
    
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Helper function to check if token is expired
 */
function isTokenExpired(decoded: { exp?: number } | null): boolean {
  if (!decoded || !decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || '';
  if (!token) {
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; type: string };
    if (decoded.type !== 'verification') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: decoded.email }).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if token matches stored token
    if (user.verificationToken !== token) {
      // Token expired or already used - delete inactive user if not verified
      if (!user.verifiedAt) {
        await User.deleteOne({ email: decoded.email });
      }
      return NextResponse.json({ error: 'Token invalid or expired' }, { status: 400 });
    }

    // Verify and activate user
    await User.updateOne({ email: decoded.email }, { $set: { isActive: true, verifiedAt: new Date(), verificationToken: null } });

    return NextResponse.redirect(new URL('/login?verified=1', req.url));
  } catch (e) {
    // JWT verification failed - check if token is expired
    await connectToDatabase();
    
    // Try to decode token without verification to get email
    const decodedPayload = decodeTokenWithoutVerification(token);
    const isExpired = isTokenExpired(decodedPayload);
    
    if (isExpired && decodedPayload?.email) {
      // Token is expired - delete the unverified user if exists
      const user = await User.findOne({ email: decodedPayload.email }).lean();
      if (user && !user.verifiedAt) {
        await User.deleteOne({ email: decodedPayload.email });
        return NextResponse.json({ error: 'Verification token expired. User removed. Please register again.' }, { status: 400 });
      }
    } else {
      // Try to find user by stored token
      const user = await User.findOne({ verificationToken: token }).lean();
      if (user && !user.verifiedAt) {
        await User.deleteOne({ _id: (user as any)._id });
      }
    }
    
    return NextResponse.json({ error: 'Token invalid or expired' }, { status: 400 });
  }
}


