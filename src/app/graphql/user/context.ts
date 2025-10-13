import { NextRequest } from 'next/server';
import { UserPayload } from '@/lib/auth';

export interface Context {
  user: UserPayload | null;
  req: NextRequest;
}

export async function createContext(req: NextRequest): Promise<Context> {
  // Import here to avoid circular dependencies
  const { authenticateRequest } = await import('@/lib/auth');
  
  const user = await authenticateRequest(req);
  
  return {
    user,
    req,
  };
}
