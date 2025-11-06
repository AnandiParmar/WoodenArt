import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import type { NextRequest } from 'next/server';
import { typeDefs, resolvers } from '@/app/graphql';
import { createContext } from '@/app/graphql/user/context';

export const dynamic = 'force-dynamic';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => createContext(req as any)
});

export async function GET(request: NextRequest) {
  return handler(request as any);
}

export async function POST(request: NextRequest) {
  return handler(request as any);
}


