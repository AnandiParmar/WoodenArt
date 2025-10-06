'use client';

import { useState, useEffect } from 'react';
import { AnimatedLogo } from './animated-logo';

export const ScrollLogo = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 200);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Show logo after a short delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`transition-all duration-700 ease-in-out ${
      isScrolled ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
    }`}>
      <AnimatedLogo isInNavbar={false} />
    </div>
  );
};
