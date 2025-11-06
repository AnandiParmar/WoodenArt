import { connectToDatabase } from '@/lib/mongodb';
import { CartItem } from '@/models/CartItem';
import { Product } from '@/models/Product';
import { Context } from '@/app/graphql/user/context';

export const cartResolvers = {
  Query: {
    myCart: async (_: unknown, __: unknown, ctx: Context) => {
      if (!ctx.user) throw new Error('Unauthorized');
      const user = ctx.user;
      await connectToDatabase();
      const cart = await CartItem.find({ userId: user.id }).lean();
      // Prefer stored snapshot fields from cart
      return (cart as any[]).map((ci) => ({
        productId: ci.productId,
        productName: ci.productName,
        productImage: ci.productImage ?? null,
        price: Number(ci.price) || 0,
        discount: ci.discount != null ? Number(ci.discount) : 0,
        quantity: ci.quantity,
        stock: Number(ci.stock) || 0,
      }));
    },
  },
  Mutation: {
    addToCart: async (_: unknown, { productId, quantity }: { productId: string; quantity?: number }, ctx: Context) => {
      if (!ctx.user) throw new Error('Unauthorized');
      const user = ctx.user;
      await connectToDatabase();
      const productIdStr = productId;
      const p = await Product.findById(productIdStr).lean();
      if (!p) throw new Error('Product not found');
      const q = Math.max(1, quantity ?? 1);
      if ((p.stock ?? 0) < q) throw new Error('Insufficient stock');
      const existing = await CartItem.findOne({ userId: user.id, productId: productIdStr });
      if (existing) {
        existing.quantity = existing.quantity + q;
        // refresh snapshot
        existing.productName = p.name;
        existing.productImage = p.featureImage ?? null;
        existing.price = Number(p.price);
        existing.discount = p.discount != null ? Number(p.discount) : null;
        existing.stock = Number(p.stock ?? 0);
        await existing.save();
        return { productId: existing.productId, quantity: existing.quantity };
      }
      const created = await CartItem.create({
        userId: user.id,
        productId: productIdStr,
        productName: p.name,
        productImage: p.featureImage ?? null,
        price: Number(p.price),
        discount: p.discount != null ? Number(p.discount) : null,
        stock: Number(p.stock ?? 0),
        quantity: q,
      });
      return { productId: created.productId, quantity: created.quantity };
    },
    updateCartItem: async (_: unknown, { productId, quantity }: { productId: string; quantity: number }, ctx: Context) => {
      if (!ctx.user) throw new Error('Unauthorized');
      const user = ctx.user;
      await connectToDatabase();
      const productIdStr = String(productId);
      const updated = await CartItem.findOneAndUpdate({ userId: user.id, productId: productIdStr }, { $set: { quantity } }, { new: true });
      if (!updated) throw new Error('Item not found in cart');
      return { productId: updated.productId, quantity: updated.quantity };
    },
    removeFromCart: async (_: unknown, { productId }: { productId: string }, ctx: Context) => {
      if (!ctx.user) throw new Error('Unauthorized');
      const user = ctx.user;
      await connectToDatabase();
      const productIdStr = String(productId);
      await CartItem.deleteOne({ userId: user.id, productId: productIdStr });
      return true;
    },
  },
};



