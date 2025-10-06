'use client';

import { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  isInNavbar?: boolean;
  className?: string;
}

export const AnimatedLogo = ({ isInNavbar = false, className = '' }: AnimatedLogoProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const logoClasses = `
    ${isInNavbar ? 'logo-navbar' : 'logo-center'}
    ${isVisible ? 'animate-fade-in-scale' : 'opacity-0'}
    ${className}
  `.trim();

  return (
    <div className={logoClasses}>
      <div className="flex items-center space-x-4">
        {/* Logo Icon */}
        <div className="relative group">
          <div className={`
            ${isInNavbar ? 'w-10 h-10' : 'w-20 h-20'} 
            bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800 
            rounded-2xl flex items-center justify-center shadow-2xl 
            transform group-hover:scale-110 transition-all duration-500 
            border-2 border-accent-200 relative overflow-hidden
          `}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-400/20 to-accent-600/20 animate-pulse-slow"></div>
            <span className={`text-white font-bold relative z-10 ${isInNavbar ? 'text-lg' : 'text-3xl'}`}>
              W
            </span>
          </div>
          
          {/* Decorative elements */}
          {!isInNavbar && (
            <>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full animate-pulse shadow-md" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>
        
        {/* Logo Text */}
        <div className={`${isInNavbar ? 'hidden sm:block' : 'block'}`}>
          <h1 className={`
            font-bold text-foreground 
            ${isInNavbar ? 'text-xl' : 'text-5xl md:text-7xl lg:text-8xl'}
            bg-gradient-to-r from-accent-700 via-primary-800 to-accent-900 
            bg-clip-text text-transparent
            leading-tight
          `}>
            Wooden Art
          </h1>
          {!isInNavbar && (
            <p className="text-primary-600 text-xl md:text-2xl mt-4 animate-fade-in-up font-medium tracking-wide">
              Crafting Digital Excellence
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
