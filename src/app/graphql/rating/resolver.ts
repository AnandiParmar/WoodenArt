import { PrismaClient, Prisma } from '@prisma/client';
import { 
  RatingInput, 
  RatingUpdateInput, 
  RatingFilterInput, 
  RatingSortInput,
  RatingWithRelations,
  RatingConnection
} from '../types';

const prisma = new PrismaClient();

export const ratingResolvers = {
  Query: {
    rating: async (_: unknown, { id }: { id: string }): Promise<RatingWithRelations | null> => {
      return await prisma.rating.findUnique({
        where: { id: parseInt(id) },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    },

    ratings: async (
      _: unknown,
      {
        filter,
        sort,
        first,
        after,
      }: {
        filter?: RatingFilterInput;
        sort?: RatingSortInput;
        first?: number;
        after?: string;
        last?: number;
        before?: string;
      }
    ): Promise<RatingConnection> => {
      const where: Prisma.RatingWhereInput = {};

      if (filter) {
        if (filter.productId) {
          where.productId = parseInt(filter.productId);
        }
        if (filter.userId) {
          where.userId = parseInt(filter.userId);
        }
        if (filter.minRating || filter.maxRating) {
          where.rating = {};
          if (filter.minRating) {
            where.rating.gte = filter.minRating;
          }
          if (filter.maxRating) {
            where.rating.lte = filter.maxRating;
          }
        }
        if (filter.hasReview !== undefined) {
          if (filter.hasReview) {
            where.review = { not: null };
          } else {
            where.review = null;
          }
        }
      }

      let orderBy: Prisma.RatingOrderByWithRelationInput = { createdAt: 'desc' };
      
      if (sort) {
        const direction = sort.direction.toLowerCase() as 'asc' | 'desc';
        switch (sort.field) {
          case 'RATING':
            orderBy = { rating: direction };
            break;
          case 'CREATED_AT':
            orderBy = { createdAt: direction };
            break;
          case 'UPDATED_AT':
            orderBy = { updatedAt: direction };
            break;
          default:
            orderBy = { createdAt: 'desc' };
        }
      }

      const skip = after ? parseInt(Buffer.from(after, 'base64').toString()) : 0;
      const take = first || 10;

      const [ratings, totalCount] = await Promise.all([
        prisma.rating.findMany({
          where,
          orderBy,
          skip,
          take,
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        }),
        prisma.rating.count({ where }),
      ]);

      const edges = ratings.map((rating, index) => ({
        node: rating,
        cursor: Buffer.from((skip + index).toString()).toString('base64'),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage: skip + take < totalCount,
          hasPreviousPage: skip > 0,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null,
        },
        totalCount,
      };
    },

    ratingsByProduct: async (_: unknown, { productId }: { productId: string }): Promise<RatingWithRelations[]> => {
      return await prisma.rating.findMany({
        where: { productId: parseInt(productId) },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    },

    ratingsByUser: async (_: unknown, { userId }: { userId: string }): Promise<RatingWithRelations[]> => {
      return await prisma.rating.findMany({
        where: { userId: parseInt(userId) },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    },

    averageRating: async (_: unknown, { productId }: { productId: string }): Promise<number> => {
      const result = await prisma.rating.aggregate({
        where: { productId: parseInt(productId) },
        _avg: {
          rating: true,
        },
      });

      return result._avg.rating || 0;
    },
  },

  Mutation: {
    createRating: async (_: unknown, { input }: { input: RatingInput }): Promise<RatingWithRelations> => {
      // Validate rating value
      if (input.rating < 1 || input.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: parseInt(input.productId) },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // Check if user already rated this product
      const existingRating = await prisma.rating.findUnique({
        where: {
          productId_userId: {
            productId: parseInt(input.productId),
            userId: parseInt(input.userId),
          },
        },
      });

      if (existingRating) {
        throw new Error('User has already rated this product');
      }

      // Create rating
      const rating = await prisma.rating.create({
        data: {
          productId: parseInt(input.productId),
          userId: parseInt(input.userId),
          rating: input.rating,
          review: input.review,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });

      // Update product's average rating and total ratings
      await updateProductRatingStats(parseInt(input.productId));

      return rating;
    },

    updateRating: async (_: unknown, { id, input }: { id: string; input: RatingUpdateInput }): Promise<RatingWithRelations> => {
      // Validate rating value if provided
      if (input.rating && (input.rating < 1 || input.rating > 5)) {
        throw new Error('Rating must be between 1 and 5');
      }

      const existingRating = await prisma.rating.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingRating) {
        throw new Error('Rating not found');
      }

      const rating = await prisma.rating.update({
        where: { id: parseInt(id) },
        data: input,
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });

      // Update product's average rating and total ratings
      await updateProductRatingStats(existingRating.productId);

      return rating;
    },

    deleteRating: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      const existingRating = await prisma.rating.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingRating) {
        throw new Error('Rating not found');
      }

      const productId = existingRating.productId;

      await prisma.rating.delete({
        where: { id: parseInt(id) },
      });

      // Update product's average rating and total ratings
      await updateProductRatingStats(productId);

      return true;
    },
  },

  Rating: {
    product: async (parent: RatingWithRelations) => {
      if (parent.product) return parent.product;
      return await prisma.product.findUnique({
        where: { id: parent.productId },
        include: {
          category: true,
        },
      });
    },
  },
};

// Helper function to update product rating statistics
async function updateProductRatingStats(productId: number) {
  const stats = await prisma.rating.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating: stats._avg.rating || 0,
      totalRatings: stats._count.rating,
    },
  });
}