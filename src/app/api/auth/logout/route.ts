import { NextResponse } from 'next/server';

export async function POST() {
  // Client stores tokens; nothing to clear server-side. Respond OK.
  return NextResponse.json({ ok: true });
}


