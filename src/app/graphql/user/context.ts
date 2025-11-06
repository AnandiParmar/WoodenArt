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
  // console.log("user",user)
  // Debug logging
  if (!user) {
    // console.log('🔍 GraphQL Context - No user authenticated');
    // console.log('Cookies:', Object.fromEntries(req.cookies.getAll().map(c => [c.name, c.value])));
  } else {
    //  console.log('✅ GraphQL Context - User authenticated:', user.email);
  }
  
  return {
    user,
    req,
  };
}
