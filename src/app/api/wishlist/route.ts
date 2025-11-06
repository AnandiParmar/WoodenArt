import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import { authenticateRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { WishlistItem } from '@/models/WishlistItem';

// GET - Get user's wishlist
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const wishlist = await WishlistItem.find({ userId: user.id }).lean();
    const productIds = wishlist.map(w => String(w.productId));
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    // Create map using string IDs (MongoDB ObjectIds)
    const idToProduct = new Map(products.map((p: any) => [String(p._id), p]));
    const items = wishlist.map(w => {
      const productIdStr = String(w.productId);
      const p = idToProduct.get(productIdStr);
      return {
        productId: w.productId, // Keep as string (MongoDB ObjectId)
        productName: p?.name ?? 'Unknown',
        productImage: p?.featureImage ?? undefined,
        price: p ? Number(p.price) : 0,
        discount: p?.discount ? Number(p.discount) : undefined,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// POST - Add item to wishlist
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Check if product exists and is active (Mongo)
    await connectToDatabase();
    const product = await Product.findById(String(productId)).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Use productId as string (MongoDB ObjectId)
    const productIdStr = String(productId);
    const existing = await WishlistItem.findOne({ userId: user.id, productId: productIdStr });
    if (existing) return NextResponse.json({ message: 'Already in wishlist' });
    await WishlistItem.create({ userId: user.id, productId: productIdStr });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Wishlist add error:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// DELETE - Remove item from wishlist
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

    // Use productId as string (MongoDB ObjectId)
    const productIdStr = String(productId);
    await connectToDatabase();
    await WishlistItem.deleteOne({ userId: user.id, productId: productIdStr });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Wishlist delete error:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}


