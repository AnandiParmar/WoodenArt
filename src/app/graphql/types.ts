import { PrismaClient, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// GraphQL Input Types (matching schema definitions)
export interface ProductInput {
  name: string;
  description?: string;
  price: Decimal;
  discount?: Decimal;
  discountType?: 'PERCENT' | 'FIXED';
  sku?: string;
  stock?: number;
  featureImage?: string | null;
  images?: Prisma.InputJsonValue;
  material?: string;
  color?: string;
  specialFeature?: string;
  style?: string;
  isActive?: boolean;
  categoryId: string;
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: Decimal;
  discount?: Decimal;
  discountType?: 'PERCENT' | 'FIXED';
  sku?: string;
  stock?: number;
  featureImage?: string | null;
  images?: Prisma.InputJsonValue;
  material?: string;
  color?: string;
  specialFeature?: string;
  style?: string;
  isActive?: boolean;
  categoryId?: string;
}

export interface ProductFilterInput {
  categoryId?: string;
  isActive?: boolean;
  minPrice?: Decimal;
  maxPrice?: Decimal;
  material?: string;
  color?: string;
  style?: string;
  search?: string;
}

export interface ProductSortInput {
  field: 'NAME' | 'PRICE' | 'CREATED_AT' | 'UPDATED_AT' | 'AVERAGE_RATING' | 'STOCK';
  direction: 'ASC' | 'DESC';
}

export interface CategoryInput {
  name: string;
  description?: string;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string;
}

export interface RatingInput {
  productId: string;
  userId: string;
  rating: number;
  review?: string;
}

export interface RatingUpdateInput {
  rating?: number;
  review?: string;
}

export interface RatingFilterInput {
  productId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
  hasReview?: boolean;
}

export interface RatingSortInput {
  field: 'RATING' | 'CREATED_AT' | 'UPDATED_AT';
  direction: 'ASC' | 'DESC';
}

// GraphQL Response Types
export interface ProductWithRelations {
  id: number;
  name: string;
  description: string | null;
  price: Decimal;
  discount: Decimal | null;
  sku: string | null;
  stock: number;
  featureImage: string | null;
  images: Prisma.JsonValue | null;
  material: string | null;
  color: string | null;
  specialFeature: string | null;
  style: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  averageRating: number;
  totalRatings: number;
  category?: {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  ratings?: Array<{
    id: number;
    productId: number;
    userId: number;
    rating: number;
    review: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface CategoryWithRelations {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  products?: ProductWithRelations[];
}

export interface RatingWithRelations {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  review: string | null;
  createdAt: Date;
  updatedAt: Date;
  product?: ProductWithRelations;
}

// GraphQL Context
export interface GraphQLContext {
  prisma: PrismaClient;
}

// Pagination Types
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ProductConnection {
  edges: Array<{
    node: ProductWithRelations;
    cursor: string;
  }>;
  pageInfo: PageInfo;
  totalCount: number;
}

export interface RatingConnection {
  edges: Array<{
    node: RatingWithRelations;
    cursor: string;
  }>;
  pageInfo: PageInfo;
  totalCount: number;
}
