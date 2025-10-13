'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export const ConditionalNavbar = () => {
  const pathname = usePathname();
  
  // Don't show navbar on admin pages or auth pages
  if (pathname.startsWith('/admin') || 
      pathname.startsWith('/login') || 
      pathname.startsWith('/register') || 
      pathname.startsWith('/forgot-password')) {
    return null;
  }
  
  return <Navbar />;
};
