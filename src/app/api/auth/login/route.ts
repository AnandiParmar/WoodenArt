import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const auth = await AuthService.login(email, password);

    const res = NextResponse.json(auth);
    const isProd = process.env.NODE_ENV === 'production';
    // Set httpOnly cookies so middleware can authenticate admin routes
    res.cookies.set('auth-token', auth.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1h
    });
    res.cookies.set('refresh-token', auth.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7d
    });
    // Also set userId and email cookies for fallback authentication
    res.cookies.set('userId', String(auth.user.id), {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7d
    });
    res.cookies.set('email', auth.user.email, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7d
    });
    res.cookies.set('role', auth.user.role, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7d
    });
    return res;
  } catch (e: any) {
    const message = e?.message || 'Invalid credentials';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}


