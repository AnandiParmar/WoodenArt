import { NextRequest } from 'next/server';
import { initSocket } from '@/lib/socketServer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  // This route exists only to ensure the server is initialized; socket.io attaches to the HTTP server
  // It returns a simple 200; clients connect directly via socket.io path
  // @ts-ignore - access Node server from request (only works in Node runtime)
  const server = (req as any).nextUrl?.server || (global as any).server;
  if (server) initSocket(server);
  return new Response('ok');
}



