import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fetch category name
    let category: { id: string; name: string } | null = null;
    if (product.categoryId) {
      const cat = await Category.findById(product.categoryId).select({ _id: 1, name: 1 }).lean();
      if (cat) category = { id: String(cat._id), name: cat.name };
    }

    return NextResponse.json({
      product: {
        id: String(product._id),
        name: product.name,
        description: product.description ?? null,
        price: Number(product.price),
        discount: product.discount != null ? Number(product.discount) : null,
        stock: product.stock,
        featureImage: product.featureImage ?? null,
        images: product.images ?? [],
        material: product.material ?? null,
        color: product.color ?? null,
        style: product.style ?? null,
        specialFeature: product.specialFeature ?? null,
        averageRating: product.averageRating ?? 0,
        totalRatings: product.totalRatings ?? 0,
        category,
      },
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}


