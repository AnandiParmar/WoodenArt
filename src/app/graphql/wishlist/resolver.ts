import { connectToDatabase } from '@/lib/mongodb';
import { WishlistItem } from '@/models/WishlistItem';
import { Product } from '@/models/Product';
import { Context } from '@/app/graphql/user/context';

export const wishlistResolvers = {
  Query: {
    myWishlist: async (_: unknown, __: unknown, ctx: Context) => {
      if (!ctx.user) throw new Error('Unauthorized');
      const user = ctx.user;
      await connectToDatabase();
      const ws = await WishlistItem.find({ userId: user.id }).lean();
      const ids = ws.map(w => String(w.productId));
      const products = await Product.find({ _id: { $in: ids } }).lean();
      // Create map using string IDs (MongoDB ObjectIds)
      const idToP = new Map(products.map((p: any) => [String(p._id), p]));
      return ws.map((w) => {
        const productIdStr = String(w.productId);
        const p = idToP.get(productIdStr);
        return {
          productId: w.productId, // Keep as string (MongoDB ObjectId)
          productName: p?.name ?? 'Unknown',
          productImage: p?.featureImage ?? null,
          price: p ? Number(p.price) : 0,
          discount: p?.discount ? Number(p.discount) : 0,
          stock: p?.stock ?? 0,
        };
      });
    },
  },
  Mutation: {
    addToWishlist: async (_: unknown, { productId }: { productId: string }, ctx: Context) => {
      if (!ctx.user) throw new Error('Unauthorized');
      const user = ctx.user;
      await connectToDatabase();
      const productIdStr = String(productId);
      const exists = await WishlistItem.findOne({ userId: user.id, productId: productIdStr }).lean();
      if (exists) return true;
      await WishlistItem.create({ userId: user.id, productId: productIdStr });
      return true;
    },
    removeFromWishlist: async (_: unknown, { productId }: { productId: string }, ctx: Context) => {
      if (!ctx.user) throw new Error('Unauthorized');
      const user = ctx.user;
      await connectToDatabase();
      const productIdStr = String(productId);
      await WishlistItem.deleteOne({ userId: user.id, productId: productIdStr });
      return true;
    },
  },
};



