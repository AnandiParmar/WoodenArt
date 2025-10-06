'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
      isScrolled 
        ? 'py-4 bg-white shadow-lg border-b border-gray-200' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo space - the main logo will move here when scrolled */}
          <div className="flex-shrink-0 w-16 h-16">
            {/* This space is reserved for the logo that moves from center */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-accent-600 hover:bg-gray-50' 
                      : 'text-white hover:text-gray-200 hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className={`
              px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 
              hover:scale-105 hover:shadow-lg transform hover:-translate-y-0.5
              ${isScrolled 
                ? 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
              }
            `}>
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-accent-600 hover:bg-gray-50' 
                  : 'text-white hover:text-gray-200 hover:bg-white/10'
              }`}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className={`
              px-4 pt-4 pb-6 space-y-2 rounded-2xl mt-4 shadow-2xl backdrop-blur-md border
              ${isScrolled 
                ? 'bg-white border-gray-200' 
                : 'bg-white/10 border-white/20'
              }
            `}>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-accent-600 hover:bg-gray-50' 
                      : 'text-white hover:text-gray-200 hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4">
                <button className={`
                  w-full px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 
                  hover:scale-105 hover:shadow-xl
                  ${isScrolled 
                    ? 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white' 
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                  }
                `}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
