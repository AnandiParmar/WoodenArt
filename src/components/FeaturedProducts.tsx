'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { listProducts } from '@/redux/features/product/productActions';

export default function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.product.items);
  const loading = useAppSelector((s) => s.product.loading);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(listProducts());
    }
  }, [dispatch]);

  // Build one representative product per category
  const categoryCards = useMemo(() => {
    const active = (products || []).filter((p: any) => p.status === 'Active');
    const byCategory = new Map<string, any>();
    for (const p of active) {
      const key = p.category || 'Uncategorized';
      if (!byCategory.has(key)) {
        byCategory.set(key, p);
      }
    }
    return Array.from(byCategory.entries()).map(([category, p]) => ({ category, product: p }));
  }, [products]);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-gray-900">Product Categories</h2>
            <p className="text-gray-600">Browse categories and explore all items</p>
            {/* Mobile: place the button under subtitle */}
            <Link href="/shop" className="mt-3 inline-block text-amber-700 hover:text-amber-800 font-semibold md:hidden">Explore more →</Link>
          </div>
          {/* Desktop/Tablet: keep button on the right */}
          <Link href="/shop" className="hidden md:inline-block text-amber-700 hover:text-amber-800 font-semibold w-[146px]">Explore more →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : categoryCards.length === 0 ? (
          <div className="text-gray-500">No products available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 sm-cols-2 gap-6">
            {categoryCards.map(({ category, product: p }) => (
              <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition">
                <div className="relative w-full h-48 ">
                  {p?.image || p?.featureImage ? (
                    <Image src={p.image || p.featureImage} alt={category} fill className="object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">                        
                  <div className="text-sm text-gray-500 line-clamp-1">Category</div>
                  <div className="font-semibold text-gray-900 group-hover:text-amber-700 line-clamp-1">{category}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}



