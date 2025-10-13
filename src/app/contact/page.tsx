'use client';

import React from 'react';
import SectionHeading from '@/components/section-heading';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <SectionHeading overline="Contact" title="Get in touch" subtitle="We’d love to hear about your project. Fill the form and we’ll reply soon." />

        <div className="grid md:grid-cols-2 gap-8">
          <form className="space-y-4">
            <input className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="Your name" />
            <input className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="Email" />
            <textarea className="w-full border border-gray-300 rounded-lg px-4 py-3" rows={5} placeholder="Message" />
            <button type="submit" className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-semibold">Send</button>
          </form>
          <div className="space-y-3 text-gray-700">
            <p><strong>Address:</strong> Veraval-Junagadh bypass road, Veraval, Gir Somnath-362266</p>
            <p><strong>Phone:</strong> +91 83061 26245</p>
            <p><strong>Hours:</strong> Mon–Fri 9:00–17:00, Sat–Sun 11:00–15:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}


