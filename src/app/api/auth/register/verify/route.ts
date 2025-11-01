import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

    const user = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if token matches stored token
    if (user.verificationToken !== token) {
      // Token expired or already used - delete inactive user if not verified
      if (!user.verifiedAt) {
        await prisma.user.delete({ where: { email: decoded.email } });
      }
      return NextResponse.json({ error: 'Token invalid or expired' }, { status: 400 });
    }

    // Verify and activate user
    await prisma.user.update({
      where: { email: decoded.email },
      data: {
        isActive: true,
        verifiedAt: new Date(),
        verificationToken: null,
      },
    });

    return NextResponse.redirect(new URL('/login?verified=1', req.url));
  } catch (e) {
    // JWT verification failed
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });
    if (user && !user.verifiedAt) {
      await prisma.user.delete({ where: { id: user.id } });
    }
    return NextResponse.json({ error: 'Token invalid or expired' }, { status: 400 });
  }
}


