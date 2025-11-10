import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { CartItem } from '@/models/CartItem';
import { Product } from '@/models/Product';
import { authenticateRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

export const orderResolvers = {
  Query: {
    myOrders: async (_: unknown, __: unknown, ctx: { req: NextRequest }) => {
      const user = await authenticateRequest(ctx.req);
      if (!user) throw new Error('Unauthorized');
      await connectToDatabase();
      const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
      const ids = Array.from(new Set(orders.flatMap(o => o.items.map(i => i.productId))));
      const products = await Product.find({ _id: { $in: ids.map(String) } }).select({ _id: 1, name: 1, featureImage: 1 }).lean();
      const idToP = new Map(products.map((p: any) => [p._id, p]));
      return orders.map((o: any) => ({
        id: String(o._id),
        orderNumber: o.orderNumber,
        status: o.status,
        totalAmount: Number(o.totalAmount),
        createdAt: (o.createdAt as Date).toISOString(),
        items: o.items.map((it: any, idx: number) => {
          const p = idToP.get(it.productId);
          return { id: `${o._id}-${idx}`, productId: it.productId, productName: p?.name ?? 'Unknown', productImage: p?.featureImage ?? null, quantity: it.quantity, price: Number(it.price) };
        }),
      }));
    },
    allOrders: async (_: unknown, __: unknown, ctx: { req: NextRequest }) => {
      const user = await authenticateRequest(ctx.req);
      if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized');
      await connectToDatabase();
      const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
      return orders.map((o: any) => ({ id: String(o._id), orderNumber: o.orderNumber, status: o.status, totalAmount: Number(o.totalAmount), createdAt: (o.createdAt as Date).toISOString() }));
    },
  },
  Mutation: {
    createOrder: async (
      _: unknown,
      { shipping }: { shipping: { address: string; city: string; state: string; zip: string; phone: string; paymentMethod?: string; notes?: string } },
      ctx: { req: NextRequest }
    ) => {
      const user = await authenticateRequest(ctx.req);
      if (!user) throw new Error('Unauthorized');
      await connectToDatabase();
      const cart = await CartItem.find({ userId: user.id }).lean();
      if (cart.length === 0) throw new Error('Cart is empty');
      const ids = cart.map(c => c.productId);
      const products = await Product.find({ _id: { $in: ids.map(String) } }).lean();
      const idToP = new Map(products.map((p: any) => [p._id, p]));
      let total = 0;
      for (const c of cart) {
        const p = idToP.get(c.productId);
        if (!p) throw new Error(`Product ${c.productId} not found`);
        if ((p.stock ?? 0) < c.quantity) throw new Error(`Insufficient stock for ${p.name}`);
        const price = Number(p.price);
        const disc = p.discount ? Number(p.discount) : 0;
        const final = disc > 0 ? price - (price * disc) / 100 : price;
        total += final * c.quantity;
      }
      const orderNumber = `ORD-${Date.now()}-${user.id}`;
      const items = cart.map((c) => {
        const p = idToP.get(c.productId)!;
        const price = Number(p.price);
        const disc = p.discount ? Number(p.discount) : 0;
        const final = disc > 0 ? price - (price * disc) / 100 : price;
        return { productId: c.productId, quantity: c.quantity, price: final };
      });
      const created = await Order.create({
        userId: user.id,
        orderNumber,
        totalAmount: total,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingZipCode: shipping.zip,
        shippingPhone: shipping.phone,
        paymentMethod: shipping.paymentMethod,
        notes: shipping.notes,
        items,
      });
      for (const c of cart) {
        const p = idToP.get(c.productId);
        if (p) await Product.findByIdAndUpdate(String(p._id), { $inc: { stock: -c.quantity } });
      }
      await CartItem.deleteMany({ userId: user.id });
      return { id: String(created._id), orderNumber: created.orderNumber, status: created.status, totalAmount: Number(created.totalAmount) };
    },
    updateOrderStatus: async (_: unknown, { orderId, status }: { orderId: string; status: string }, ctx: { req: NextRequest }) => {
      const user = await authenticateRequest(ctx.req);
      if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized');
      await connectToDatabase();
      const updated = await Order.findByIdAndUpdate(orderId, { $set: { status } }, { new: true }).lean();
      return { id: String(updated!._id), status: updated!.status };
    },
  },
};



