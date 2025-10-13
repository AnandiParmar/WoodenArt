'use client';

import React from 'react';
import SectionHeading from '@/components/section-heading';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <SectionHeading
          overline="About"
          title="About Trilok Wooden Arts"
          subtitle="We craft bespoke furniture, wooden antiques, and interior decor with a focus on quality and longevity."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Inspired by the spirit of artisanal craftsmanship, we collaborate with clients to create
              furniture and decor that fit homes, restaurants, hotels, and commercial interiors.
            </p>
            <p>
              From customized dining sets to accent pieces, each item is built to last with sustainably
              sourced materials and thoughtful design details.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">What we stand for</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>High quality carpentry and finishing</li>
              <li>Customization for unique spaces</li>
              <li>Durable materials and fair pricing</li>
              <li>On-site interior fit-outs on request</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


