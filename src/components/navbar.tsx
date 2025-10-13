'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMovedToNavbar, setHasMovedToNavbar] = useState(false);
  const [hasEverMovedToNavbar, setHasEverMovedToNavbar] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      const scrolled = window.scrollY > 150; // Match the home page threshold
      setIsScrolled(scrolled);
      
      // Clear previous timeout
      clearTimeout(timeoutId);
      
      // Debounce the logo position check
      timeoutId = setTimeout(() => {
        // Only check logo position if we've scrolled enough
        if (scrolled) {
          const logoElement = document.querySelector('.logo-transition');
          if (logoElement) {
            const logoRect = logoElement.getBoundingClientRect();
            // More precise detection: logo should be in top-left corner with specific dimensions
            const isInNavbarPosition = logoRect.top < 50 && logoRect.left < 50 && logoRect.width < 200;
            setHasMovedToNavbar(isInNavbarPosition);
            
            // Track if logo has ever moved to navbar
            if (isInNavbarPosition && !hasEverMovedToNavbar) {
              setHasEverMovedToNavbar(true);
            }
          }
        }
        
        // If logo has ever moved to navbar, keep navbar visible
        if (hasEverMovedToNavbar) {
          setHasMovedToNavbar(true);
        }
      }, 5); // 50ms debounce
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial state on mount
    const checkInitialState = () => {
      const logoElement = document.querySelector('.logo-transition');
      if (logoElement) {
        const logoRect = logoElement.getBoundingClientRect();
        const isInNavbarPosition = logoRect.top < 50 && logoRect.left < 50 && logoRect.width < 200;
        if (isInNavbarPosition) {
          setHasMovedToNavbar(true);
          setHasEverMovedToNavbar(true);
        }
      }
    };
    
    // Check after a short delay to ensure DOM is ready
    setTimeout(checkInitialState, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [hasEverMovedToNavbar]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  // Always show a solid navbar with dark text on all pages
  const shouldShowNavbar = true;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
      shouldShowNavbar 
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 text-gray-700 hover:text-blue-600 hover:bg-gray-50`}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Debug: Show admin status */}
              {/* {user && (
                <div className={`text-xs px-2 py-1 rounded ${
                  shouldShowNavbar ? 'bg-gray-100 text-gray-600' : 'bg-white/20 text-white'
                }`}>
                  Admin: {isAdmin ? 'Yes' : 'No'}
                </div>
              )} */}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
              
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      shouldShowNavbar ? 'text-gray-700' : 'text-white'
                }`}>
                  Welcome, {user.firstName}
                    </div>
                   
                  </div>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      shouldShowNavbar 
                      ? 'text-gray-700 hover:text-red-600 hover:bg-red-50' 
                      : 'text-white hover:text-red-200 hover:bg-red-500/20'
                  }`}
                >
                  Logout
                </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 text-gray-700 hover:text-blue-600 hover:bg-gray-50`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`
                    px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 
                    hover:scale-105 hover:shadow-lg transform hover:-translate-y-0.5
                    bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white
                  `}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                shouldShowNavbar 
                  ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-50' 
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
              ${shouldShowNavbar 
                ? 'bg-white border-gray-200' 
                : 'bg-white/10 border-white/20'
              }
            `}>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:scale-105 ${
                    shouldShowNavbar 
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-50' 
                      : 'text-white hover:text-gray-200 hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className={`group relative w-full px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-0.5 ${
                          shouldShowNavbar 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md' 
                            : 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-white border border-purple-400/30 hover:border-purple-400/50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Admin Panel</span>
                        </div>
                        {/* Hover effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    )}
                    <div className={`px-4 py-3 text-center ${
                      shouldShowNavbar ? 'text-gray-700' : 'text-white'
                    }`}>
                      <div className="text-base font-medium">
                      Welcome, {user.firstName}
                      </div>
                      {isAdmin && (
                        <div className={`text-sm ${
                          shouldShowNavbar ? 'text-purple-600' : 'text-purple-300'
                        }`}>
                          Administrator
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:scale-105 ${
                        isScrolled 
                          ? 'text-gray-700 hover:text-red-600 hover:bg-red-50' 
                          : 'text-white hover:text-red-200 hover:bg-red-500/20'
                      }`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:scale-105 ${
                        isScrolled 
                          ? 'text-gray-700 hover:text-accent-600 hover:bg-gray-50' 
                          : 'text-white hover:text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        w-full px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 
                        hover:scale-105 hover:shadow-xl
                        ${isScrolled 
                          ? 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white' 
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                        }
                      `}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
