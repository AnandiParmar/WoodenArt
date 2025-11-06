import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import { authenticateRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { CartItem } from '@/models/CartItem';
import { getIO } from '@/lib/socketServer';

// GET - Get user's orders
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const adminView = searchParams.get('admin') === '1' || searchParams.get('all') === '1';

    const where = adminView && user.role === 'ADMIN' ? {} : { userId: user.id };

    await connectToDatabase();
    const orders = await Order.find(where).sort({ createdAt: -1 }).lean();
    // Enrich item names/images from Mongo products
    const allProductIds = Array.from(new Set(orders.flatMap(o => o.items.map(i => i.productId))));
    const products = await Product.find({ _id: { $in: allProductIds.map(String) } }).select({ _id: 1, name: 1, featureImage: 1 }).lean();
    const idToProduct = new Map(products.map((p: any) => [p._id, p]));
    const formattedOrders = orders.map((order) => ({
      id: String(order._id),
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingZipCode: order.shippingZipCode,
      shippingPhone: order.shippingPhone,
      paymentMethod: order.paymentMethod || undefined,
      paymentStatus: order.paymentStatus,
      items: order.items.map((item, idx) => {
        const p = idToProduct.get(item.productId);
        return {
          id: `${order._id}-${idx}`,
          productId: item.productId,
          productName: p?.name ?? 'Unknown',
          productImage: p?.featureImage ?? undefined,
          quantity: item.quantity,
          price: Number(item.price),
        };
      }),
      createdAt: (order.createdAt as Date).toISOString(),
      updatedAt: (order.updatedAt as Date).toISOString(),
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      shippingPhone,
      paymentMethod,
      notes,
    } = await req.json();

    if (!shippingAddress || !shippingCity || !shippingState || !shippingZipCode || !shippingPhone) {
      return NextResponse.json({ error: 'All shipping fields are required' }, { status: 400 });
    }

    await connectToDatabase();
    // Get user's cart from Mongo
    const cartItems = await CartItem.find({ userId: user.id }).lean();

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    // Fetch products from Mongo for pricing/stock
    const productIds = cartItems.map(ci => ci.productId);
    const products = await Product.find({ _id: { $in: productIds.map(String) } }).lean();
    const idToProduct = new Map(products.map((p: any) => [p._id, p]));
    for (const item of cartItems) {
      const product = idToProduct.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const price = Number(product.price);
      const discount = product.discount ? Number(product.discount) : 0;
      const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
      totalAmount += finalPrice * item.quantity;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${user.id}`;

    // Prepare order items data
    const orderItemsData = cartItems.map(item => {
      const p = idToProduct.get(item.productId)!;
      const price = Number(p.price);
      const discount = p.discount ? Number(p.discount) : 0;
      const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
      return { productId: item.productId, quantity: item.quantity, price: finalPrice };
    });

    await connectToDatabase();
    const created = await Order.create({
      userId: user.id,
      orderNumber,
      totalAmount,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZipCode,
      shippingPhone,
      paymentMethod,
      notes,
      items: orderItemsData,
    });

    // Update stock in Mongo
    for (const item of cartItems) {
      const current = idToProduct.get(item.productId);
      if (current) {
        await Product.findByIdAndUpdate(String(current._id), { $inc: { stock: -item.quantity } });
      }
    }

    // Clear Mongo cart
    await CartItem.deleteMany({ userId: user.id });

    // Emit order created to user room
    try {
      const io = getIO();
      io?.to(`user:${user.id}`).emit('order_created', {
        id: String(created._id),
        orderNumber: created.orderNumber,
        status: created.status,
        totalAmount: Number(created.totalAmount),
        createdAt: (created.createdAt as Date).toISOString(),
      });
    } catch {}

    return NextResponse.json({ order: { id: String(created._id), orderNumber: created.orderNumber, status: created.status, totalAmount: Number(created.totalAmount) } }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PATCH - Update order status (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, status } = await req.json();
    const validStatuses = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'];
    if (!orderId || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Order.findByIdAndUpdate(orderId, { $set: { status } }, { new: true });

    // Emit status update to all and user room
    try {
      const io = getIO();
      io?.emit('order_status_updated', { id: String(updated!._id), status: updated!.status, userId: updated!.userId });
      io?.to(`user:${updated!.userId}`).emit('order_status_updated', { id: String(updated!._id), status: updated!.status });
    } catch {}

    return NextResponse.json({
      order: {
        id: String(updated!._id),
        orderNumber: updated!.orderNumber,
        status: updated!.status,
        totalAmount: Number(updated!.totalAmount),
        createdAt: (updated!.createdAt as Date).toISOString(),
      },
    });
  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

