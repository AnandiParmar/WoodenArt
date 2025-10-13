'use client';

import React from 'react';
import Link from 'next/link';

export interface RecentProductItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  createdAt?: string;
}

export interface RecentProductsProps {
  products: RecentProductItem[];
  title?: string;
}

export function RecentProducts({ products, title = 'Recent Products' }: RecentProductsProps) {
  const items = [...products]
    .sort((a, b) => (b.createdAt?.localeCompare(a.createdAt || '') || 0))
    .slice(0, 6);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <Link href="/products" className="text-accent-700 hover:underline text-sm font-medium">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="group block bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
            <div className="aspect-[4/3] bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image || '/window.svg'} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-gray-900 group-hover:text-accent-700">{p.name}</h4>
                <span className="text-sm font-bold text-gray-900">₹{Number(p.price).toFixed(2)}</span>
              </div>
              {p.createdAt && (
                <p className="text-xs text-gray-500 mt-1">Added on {new Date(p.createdAt).toLocaleDateString()}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RecentProducts;


