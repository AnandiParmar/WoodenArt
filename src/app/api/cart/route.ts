import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import { authenticateRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { CartItem } from '@/models/CartItem';

// GET - Get user's cart
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const cartItems = await CartItem.find({ userId: user.id }).lean();
    const productIds = cartItems.map(ci => ci.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    // Create map using string IDs (MongoDB ObjectIds)
    const idToProduct = new Map(products.map((p: any) => [String(p._id), p]));
    const items = cartItems.map((ci) => {
      const productIdStr = String(ci.productId);
      const p = idToProduct.get(productIdStr);
      return {
        productId: ci.productId, // Keep as string (MongoDB ObjectId)
        productName: p?.name ?? 'Unknown',
        productImage: p?.featureImage ?? undefined,
        price: p ? Number(p.price) : 0,
        discount: p?.discount ? Number(p.discount) : undefined,
        quantity: ci.quantity,
        stock: p?.stock ?? 0,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Check if product exists and is active (Mongo)
    await connectToDatabase();
    const product = await Product.findById(String(productId)).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Use productId as string (MongoDB ObjectId)
    const productIdStr = String(productId);

    await connectToDatabase();
    const existing = await CartItem.findOne({ userId: user.id, productId: productIdStr });
    if (existing) {
      existing.quantity = existing.quantity + quantity;
      await existing.save();
      return NextResponse.json({ item: { productId: existing.productId, quantity: existing.quantity } });
    }
    const created = await CartItem.create({ userId: user.id, productId: productIdStr, quantity });
    return NextResponse.json({ item: { productId: created.productId, quantity: created.quantity } });
  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// PUT - Update cart item quantity
export async function PUT(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await CartItem.findOneAndUpdate(
      { userId: user.id, productId },
      { $set: { quantity } },
      { new: true }
    );
    if (!updated) return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    return NextResponse.json({ item: { productId: updated.productId, quantity: updated.quantity } });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await CartItem.deleteOne({ userId: user.id, productId:productId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart delete error:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}


