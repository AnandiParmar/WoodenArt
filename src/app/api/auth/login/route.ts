import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const auth = await AuthService.login(email, password);

    return NextResponse.json(auth);
  } catch (e: any) {
    const message = e?.message || 'Invalid credentials';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}


