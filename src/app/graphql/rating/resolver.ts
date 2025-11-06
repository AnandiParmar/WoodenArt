import { connectToDatabase } from '@/lib/mongodb';
import { Rating as RatingModel } from '@/models/Rating';
import { Product as ProductModel } from '@/models/Product';
import { 
  RatingInput, 
  RatingUpdateInput, 
  RatingFilterInput, 
  RatingSortInput,
  RatingWithRelations,
  RatingConnection
} from '../types';

type Direction = 'asc' | 'desc';

export const ratingResolvers = {
  Query: {
    rating: async (_: unknown, { id }: { id: string }): Promise<RatingWithRelations | null> => {
      await connectToDatabase();
      const r = await RatingModel.findById(id).lean();
      if (!r) return null;
      return { id: String(r._id), productId: r.productId, userId: r.userId, rating: r.rating, review: r.review || null } as any;
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
      await connectToDatabase();
      const filterQuery: Record<string, unknown> = {};

      if (filter) {
        if (filter.productId) filterQuery['productId'] = parseInt(filter.productId);
        if (filter.userId) filterQuery['userId'] = parseInt(filter.userId);
        const rFilter: Record<string, unknown> = {};
        if (filter.minRating) rFilter['$gte'] = filter.minRating;
        if (filter.maxRating) rFilter['$lte'] = filter.maxRating;
        if (Object.keys(rFilter).length) filterQuery['rating'] = rFilter;
        if (filter.hasReview !== undefined) filterQuery['review'] = filter.hasReview ? { $ne: null } : null;
      }

      let sortObj: Record<string, Direction> = { createdAt: 'desc' };
      
      if (sort) {
        const direction = sort.direction.toLowerCase() as 'asc' | 'desc';
        switch (sort.field) {
          case 'RATING':
            sortObj = { rating: direction };
            break;
          case 'CREATED_AT':
            sortObj = { createdAt: direction };
            break;
          case 'UPDATED_AT':
            sortObj = { updatedAt: direction };
            break;
          default:
            sortObj = { createdAt: 'desc' };
        }
      }

      const skip = after ? parseInt(Buffer.from(after, 'base64').toString()) : 0;
      const take = first || 10;

      const [ratings, totalCount] = await Promise.all([
        RatingModel.find(filterQuery).sort(sortObj).skip(skip).limit(take).lean(),
        RatingModel.countDocuments(filterQuery),
      ]);

      const edges = ratings.map((r: any, index: number) => ({
        node: {
          id: String(r._id),
          productId: r.productId,
          userId: r.userId,
          rating: r.rating,
          review: r.review ?? null,
          createdAt: (r.createdAt as Date).toISOString?.() ?? r.createdAt,
          updatedAt: (r.updatedAt as Date).toISOString?.() ?? r.updatedAt,
          product: undefined,
        } as any,
        cursor: Buffer.from((skip + index).toString()).toString('base64'),
      }));

      return { edges, pageInfo: { hasNextPage: skip + take < totalCount, hasPreviousPage: skip > 0, startCursor: edges[0]?.cursor || null, endCursor: edges[edges.length - 1]?.cursor || null }, totalCount };
    },

    ratingsByProduct: async (_: unknown, { productId }: { productId: string }): Promise<RatingWithRelations[]> => {
      await connectToDatabase();
      const rows = await RatingModel.find({ productId: parseInt(productId) }).sort({ createdAt: -1 }).lean();
      return rows as any;
    },

    ratingsByUser: async (_: unknown, { userId }: { userId: string }): Promise<RatingWithRelations[]> => {
      await connectToDatabase();
      const rows = await RatingModel.find({ userId: parseInt(userId) }).sort({ createdAt: -1 }).lean();
      return rows as any;
    },

    averageRating: async (_: unknown, { productId }: { productId: string }): Promise<number> => {
      await connectToDatabase();
      const rows = await RatingModel.find({ productId: parseInt(productId) }).lean();
      if (rows.length === 0) return 0;
      const avg = rows.reduce((s, r: any) => s + (r.rating || 0), 0) / rows.length;
      return avg;
    },
  },

  Mutation: {
    createRating: async (_: unknown, { input }: { input: RatingInput }): Promise<RatingWithRelations> => {
      await connectToDatabase();
      // Validate rating value
      if (input.rating < 1 || input.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Check if product exists
      const product = await ProductModel.findById(String(input.productId)).lean();

      if (!product) {
        throw new Error('Product not found');
      }

      // Check if user already rated this product
      const existingRating = await RatingModel.findOne({ productId: parseInt(input.productId), userId: parseInt(input.userId) }).lean();

      if (existingRating) {
        throw new Error('User has already rated this product');
      }

      // Create rating
      const rating = await RatingModel.create({
        productId: parseInt(input.productId),
        userId: parseInt(input.userId),
        rating: input.rating,
        review: input.review,
      });

      // Update product's average rating and total ratings
      await updateProductRatingStats(parseInt(input.productId));

      return { id: String(rating._id), productId: rating.productId, userId: rating.userId, rating: rating.rating, review: rating.review || null } as any;
    },

    updateRating: async (_: unknown, { id, input }: { id: string; input: RatingUpdateInput }): Promise<RatingWithRelations> => {
      await connectToDatabase();
      // Validate rating value if provided
      if (input.rating && (input.rating < 1 || input.rating > 5)) {
        throw new Error('Rating must be between 1 and 5');
      }

      const existingRating = await RatingModel.findById(id).lean();

      if (!existingRating) {
        throw new Error('Rating not found');
      }

      const rating = await RatingModel.findByIdAndUpdate(id, { $set: input }, { new: true }).lean();

      // Update product's average rating and total ratings
      await updateProductRatingStats(existingRating.productId as any);

      return { id: String(rating!._id), productId: rating!.productId, userId: rating!.userId, rating: rating!.rating, review: rating!.review || null } as any;
    },

    deleteRating: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      await connectToDatabase();
      const existingRating = await RatingModel.findById(id).lean();

      if (!existingRating) {
        throw new Error('Rating not found');
      }

      const productId = existingRating.productId;

      await RatingModel.findByIdAndDelete(id);

      // Update product's average rating and total ratings
      await updateProductRatingStats(productId as any);

      return true;
    },
  },

  Rating: {
    product: async (parent: RatingWithRelations) => {
      await connectToDatabase();
      const p = await ProductModel.findById(String(parent.productId)).lean();
      if (!p) return null as any;
      return { id: String(p._id), name: p.name } as any;
    },
  },
};

// Helper function to update product rating statistics
async function updateProductRatingStats(productId: number) {
  await connectToDatabase();
  const rows = await RatingModel.find({ productId }).lean();
  const avg = rows.length ? rows.reduce((s, r: any) => s + (r.rating || 0), 0) / rows.length : 0;
  await ProductModel.findByIdAndUpdate(String(productId), { $set: { averageRating: avg, totalRatings: rows.length } });
}