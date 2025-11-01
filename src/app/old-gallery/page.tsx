'use client';

import React from 'react';
import SectionHeading from '@/components/section-heading';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { listProducts } from '@/redux/features/product/productActions';

export default function GalleryPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s: { product: { items: Array<{ id: number; name: string; featureImage?: string; images?: string[] }> } }) => s.product.items);
  const [lightbox, setLightbox] = React.useState<string | null>(null);
  const [visibleMap, setVisibleMap] = React.useState<Record<number, boolean>>({});
  const [loadedMap, setLoadedMap] = React.useState<Record<number, boolean>>({});
  const [tab, setTab] = React.useState<'ALL' | 'FEATURE' | 'GALLERY'>('ALL');

  React.useEffect(() => {
    // If no products are in the store yet, pull them in so we can build the gallery
    if (!products || products.length === 0) {
      dispatch(listProducts());
    }
  }, [dispatch]);

  type ImageMeta = { src: string; product: string; type: 'FEATURE' | 'GALLERY' };
  const imagesMeta = React.useMemo(() => {
    const metas: ImageMeta[] = [];
    for (const p of products || []) {
      if (p && typeof p === 'object') {
        const anyP = p as unknown as { name?: string; featureImage?: string; images?: unknown };
        const title = anyP.name || 'Product';
        if (anyP.featureImage) metas.push({ src: anyP.featureImage, product: title, type: 'FEATURE' });
        const imgs = Array.isArray(anyP.images) ? (anyP.images as string[]) : [];
        for (const u of imgs) metas.push({ src: u, product: title, type: 'GALLERY' });
      }
    }
    const normalized = metas
      .filter((m) => Boolean(m.src))
      .map((m) => ({ ...m, src: m.src.startsWith('/public/') ? m.src.replace('/public', '') : m.src }));
    // Deduplicate by url+type
    const seen = new Set<string>();
    return normalized.filter((m) => {
      const key = `${m.src}|${m.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [products]);

  // Ensure tiles are visible on initial render so users don't see empty space before hovering
  React.useEffect(() => {
    if (imagesMeta.length > 0) {
      const map: Record<number, boolean> = {};
      imagesMeta.forEach((_, i) => (map[i] = true));
      setVisibleMap(map);
    }
  }, [imagesMeta.length]);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <SectionHeading overline="Gallery" title="Image Gallery" subtitle="Browse feature images and gallery photos from our products. Click any tile to view." />

        <div className="flex items-center gap-2">
          {(['ALL','FEATURE','GALLERY'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${tab===t ? 'bg-accent-600 text-white border-accent-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >{t === 'ALL' ? 'All' : t === 'FEATURE' ? 'Feature Images' : 'Gallery Images'}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagesMeta.length === 0 && (
            <p className="col-span-full text-gray-500">No images yet. Add products with images to see them here.</p>
          )}
          {imagesMeta
            .filter((m) => tab === 'ALL' || m.type === tab)
            .map((m, idx) => (
            <div
              key={`${m.src}-${idx}`}
              className={`group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer transition-all duration-500 ${
                visibleMap[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              onClick={() => setLightbox(m.src)}
              onMouseEnter={() => setVisibleMap((v) => ({ ...v, [idx]: true }))}
              style={{ transitionDelay: `${idx * 60}ms` }}
            >
              {/* Placeholder shimmer until image loads */}
              <div className={`absolute inset-0 ${loadedMap[idx] ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}> 
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v11a2 2 0 01-2 2H9.414a2 2 0 00-1.414.586L6 21v-3H6a2 2 0 01-2-2V5z" />
                  </svg>
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.src}
                alt={`gallery-${idx}`}
                loading="lazy"
                onLoad={() => setLoadedMap((l) => ({ ...l, [idx]: true }))}
                className={`w-full h-full object-cover transform group-hover:scale-110 transition-[transform,opacity,filter] duration-500 ${
                  loadedMap[idx] ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-1 rounded-full bg-white/90 text-gray-800 border border-gray-200">{m.type === 'FEATURE' ? 'Feature' : 'Gallery'}</div>
              <div className="absolute bottom-2 left-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">{m.product}</div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <div className="w-full max-w-3xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            <div className="relative rounded-xl overflow-auto shadow-2xl max-h-[85vh] bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightbox} alt="preview" className="w-full h-auto object-contain block mx-auto" />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-semibold shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


