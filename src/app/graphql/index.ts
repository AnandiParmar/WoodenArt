import { gql } from 'graphql-tag';
import { sharedTypes } from './shared/types';
import { productSchema } from './product/schema';
import { categorySchema } from './category/schema';
import { ratingSchema } from './rating/schema';
import { userSchema } from './user/schema';
import { productResolvers } from './product/resolver';
import { categoryResolvers } from './category/resolver';
import { ratingResolvers } from './rating/resolver';
import { userResolvers } from './user/resolver';

// Base schema with common types and scalars
const baseSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

// Merge all schemas
export const typeDefs = [
  sharedTypes,
  baseSchema,
  productSchema,
  categorySchema,
  ratingSchema,
  userSchema,
];

// Merge all resolvers
export const resolvers = {
  Query: {
    ...(productResolvers as any).Query,
    ...(categoryResolvers as any).Query,
    ...(ratingResolvers as any).Query,
    ...(userResolvers as any).Query,
  },
  Mutation: {
    ...(productResolvers as any).Mutation,
    ...(categoryResolvers as any).Mutation,
    ...(ratingResolvers as any).Mutation,
    ...(userResolvers as any).Mutation,
  },
  // Type-specific resolvers
  ...((productResolvers as any).Product ? { Product: (productResolvers as any).Product } : {}),
  ...((categoryResolvers as any).Category ? { Category: (categoryResolvers as any).Category } : {}),
  ...((ratingResolvers as any).Rating ? { Rating: (ratingResolvers as any).Rating } : {}),
  ...((userResolvers as any).User ? { User: (userResolvers as any).User } : {}),
};

// Export individual schemas and resolvers for modular use
export {
  sharedTypes,
  productSchema,
  categorySchema,
  ratingSchema,
  userSchema,
  productResolvers,
  categoryResolvers,
  ratingResolvers,
  userResolvers,
};