import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AuthService } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, code, password } = await req.json();
  if (!email || !code || !password) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.resetOtp || user.resetOtp !== code) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  if (!user.resetOtpExpiresAt || user.resetOtpExpiresAt < new Date()) {
    return NextResponse.json({ error: 'Code expired' }, { status: 400 });
  }

  const hashed = await AuthService.hashPassword(password);
  await prisma.user.update({
    where: { email },
    data: {
      password: hashed,
      resetOtp: null,
      resetOtpExpiresAt: null,
    },
  });

  return NextResponse.json({ ok: true });
}


