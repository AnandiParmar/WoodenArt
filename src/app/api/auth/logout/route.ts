import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear auth cookies
  res.cookies.set('auth-token', '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('refresh-token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}


