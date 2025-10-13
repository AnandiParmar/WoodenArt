'use client';

import React from 'react';
import SectionHeading from '@/components/section-heading';
import FeatureCard from '@/components/feature-card';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <SectionHeading
          overline="Services"
          title="What We Offer"
          subtitle="Customized furniture, wooden antiques, and interior decor solutions — built to your requirement."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={<span>🪵</span>} title="Custom Furniture" description="Tailor-made home and hotel furniture to suit your space and taste." />
          <FeatureCard icon={<span>🏺</span>} title="Wooden Antiques" description="Decorative wooden items and heritage-inspired accents for interiors." />
          <FeatureCard icon={<span>🏨</span>} title="Interior Fit-outs" description="On-site interior furnishing for restaurants, hotels, and retail spaces." />
        </div>
      </div>
    </div>
  );
}


