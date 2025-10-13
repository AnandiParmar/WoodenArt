'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import RecentProducts from '@/components/recent-products';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { listProducts } from '@/redux/features/product/productActions';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasMovedToNavbar, setHasMovedToNavbar] = useState(false);
  const { user, isAdmin } = useAuth();
  const recent = useAppSelector((s: { product: { items: Array<{ id: number; name: string; price: number; featureImage?: string; createdAt?: string }> } }) => s.product.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      const scrolled = window.scrollY > 150; // Increased threshold for more stability
      
      // Clear previous timeout
      clearTimeout(timeoutId);
      
      // Debounce the logo movement
      timeoutId = setTimeout(() => {
        // Once logo moves to navbar, keep it there permanently
        if (scrolled && !hasMovedToNavbar) {
          setHasMovedToNavbar(true);
        }
      }, 100); // 100ms debounce for stability
    };

    window.addEventListener('scroll', handleScroll);
    
    // Show logo after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      clearTimeout(timeoutId);
    };
  }, [hasMovedToNavbar]);

  // Fetch recent products for homepage
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen relative home-page bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Subtle background pattern - only show when logo is centered */}
      {!hasMovedToNavbar && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Geometric pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          
          {/* Soft gradient overlays */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 via-transparent to-amber-50/20"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-r from-amber-100/20 to-transparent rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Main Logo - Center of screen, moves to navbar when scrolled, stays in navbar after that */}
      <div className={`logo-transition transition-all duration-700 ease-in-out ${
        hasMovedToNavbar 
          ? 'fixed top-6 left-6 z-40 scale-75' 
          : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 scale-100'
      } ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative group">
          {!hasMovedToNavbar ? (
            // Split logo animation when centered
            <div className="flex items-center space-x-1">
              {/* Logo image coming from left - smaller size */}
              <div className={`relative w-16 h-16 md:w-22 md:h-22 ${
                isVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-20'
              }`}>
                <Image
                  src="/logo1.jpg"
                  alt="Wooden Art Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Text coming from right - normal size, taller than icon */}
              <div className={`${
                isVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-20'
              }`}>
                <div className="text-2xl md:text-2xl font-extrabold text-black leading-[0.8] animate-logo-bounce ">
                  TRILOK
                </div>
                <div className="text-2xl md:text-2xl font-extrabold text-black leading-[0.8]">
                  WOODEN
                </div>
                <div className="text-2xl md:text-2xl font-extrabold text-black leading-[0.8]">
                  ARTS
                </div>
              </div>
            </div>
          ) : (
            // Complete logo when in navbar - stays here permanently
            <div className="flex items-center space-x-0">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo1.jpg"
                  alt="Wooden Art Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-extrabold text-black leading-[1] ">
                  TRILOK
                </div>
                <div className="text-xs font-extrabold text-black leading-[0.8]">
                  WOODEN
                </div>
                <div className="text-xs font-extrabold text-black leading-[0.8]">
                  ARTS
                </div>
              </div>
            </div>
            )}
          
          {/* Decorative glow effect - only when centered */}
          {!hasMovedToNavbar && (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-xl animate-logo-glow"></div>
          )}
        </div>
      </div>

      {/* Floating decorative elements - only show when logo is centered */}
      {!hasMovedToNavbar && (
        <>
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-accent-300 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-primary-300 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-secondary-300 rounded-full animate-pulse opacity-35" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-accent-400 rounded-full animate-pulse opacity-25" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}


      {/* Content that appears when scrolling - visible when logo is in navbar */}
      <div className={`relative z-10 transition-opacity duration-1000 ${hasMovedToNavbar ? 'opacity-100' : 'opacity-0'}`}>
        <div className="pt-32 pb-20 px-8 min-h-screen">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Background pattern for content area */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[length:40px_40px]"></div>
            {/* Hero section content */}
            <div className="text-center space-y-8">
              <div className="animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                  Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Wooden Art</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Experience the perfect blend of traditional craftsmanship and modern digital innovation. 
                  Scroll down to explore our world of wooden artistry.
                </p>
              </div>
            </div>
            
            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
              {[
                { title: "Craftsmanship", description: "Traditional techniques meet modern innovation", icon: "🎨" },
                { title: "Digital Excellence", description: "Cutting-edge technology for timeless results", icon: "💻" },
                { title: "Quality Materials", description: "Premium materials sourced with care", icon: "🌳" },
                { title: "Custom Solutions", description: "Tailored to your unique vision", icon: "✨" },
                { title: "Expert Team", description: "Skilled artisans and developers", icon: "👥" },
                { title: "Timeless Design", description: "Creating pieces that last generations", icon: "⏰" }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-blue-300/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group"
                  style={{ animationDelay: `${2 + i * 0.1}s` }}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent products from store */}
            <RecentProducts products={recent.map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              image: (p as unknown as { featureImage?: string; image?: string }).featureImage ||
                     (p as unknown as { featureImage?: string; image?: string }).image,
              createdAt: p.createdAt,
            }))} />

            {/* Call to action section */}
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12 border border-gray-200">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Ready to Experience the Magic?
                </h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Discover the beauty of wooden artistry and craftsmanship that stands the test of time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    Get Started
                  </button>
                  <a 
                    href="/admin" 
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center"
                  >
                    Admin Panel
                  </a>
                </div>
              </div>
            </div>

            {/* Additional content to ensure proper scrolling */}
            <div className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Why Choose Wooden Art?
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  We combine traditional craftsmanship with modern technology to create timeless pieces that tell your story.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Handcrafted Excellence</h4>
                  <p className="text-gray-600">Every piece is carefully crafted by skilled artisans using traditional techniques passed down through generations.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Modern Innovation</h4>
                  <p className="text-gray-600">We use cutting-edge technology to enhance our traditional methods, ensuring precision and quality in every creation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Admin Button - Only visible for ADMIN users when logo is in navbar */}
      {isAdmin && user && hasMovedToNavbar && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link
            href="/admin"
            className="group relative inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 font-semibold text-sm"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Admin Panel</span>
            </div>
            {/* Animated background effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/30 to-slate-600/30 animate-pulse"></div>
          </Link>
        </div>
      )}
    </div>
  );
}
