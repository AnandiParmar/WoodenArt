'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const items = [
  { title: 'Custom Bed Frames', img: '/images/furniture/bed.jpg' },
  { title: 'Modular Cabinets', img: '/images/furniture/cabinet.jpg' },
  { title: 'Office Desks', img: '/images/furniture/desk.jpg' },
  { title: 'Ceiling Panels', img: '/images/furniture/ceiling.jpg' },
];

export default function FurniturePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <Navbar showLogo={true} />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Custom Furniture Services</h1>
            <p className="text-gray-600">We design and build furniture tailored to your space and style.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((it) => (
              <div key={it.title} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="relative w-full h-56 bg-gray-100">
                  <Image src={it.img} alt={it.title} fill className="object-contain" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="font-semibold text-gray-900">{it.title}</div>
                  <Link href="/custom-furniture" className="px-3 py-1 rounded-full text-sm bg-amber-600 text-white hover:bg-amber-700">Contact Us</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



