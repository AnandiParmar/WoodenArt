// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/AuthContext';
// import RecentProducts from '@/components/recent-products';
// import { useAppDispatch, useAppSelector } from '@/redux/store';
// import { listProducts } from '@/redux/features/product/productActions';


// export default function Home() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [hasMovedToNavbar, setHasMovedToNavbar] = useState(false);
//   const { user, isAdmin } = useAuth();
//   const recent = useAppSelector((s: { product: { items: Array<{ id: number; name: string; price: number; featureImage?: string; createdAt?: string }> } }) => s.product.items);
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     let timeoutId: ReturnType<typeof setTimeout>;
    
//     const handleScroll = () => {
//       const scrolled = window.scrollY > 150; // Increased threshold for more stability
      
//       // Clear previous timeout
//       clearTimeout(timeoutId);
      
//       // Debounce the logo movement
//       timeoutId = setTimeout(() => {
//         // Once logo moves to navbar, keep it there permanently
//         if (scrolled && !hasMovedToNavbar) {
//           setHasMovedToNavbar(true);
//         }
//       }, 100); // 100ms debounce for stability
//     };

//     window.addEventListener('scroll', handleScroll);
    
//     // Show logo after a short delay
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 500);

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       clearTimeout(timer);
//       clearTimeout(timeoutId);
//     };
//   }, [hasMovedToNavbar]);

//   // Fetch recent products for homepage
//   useEffect(() => {
//     dispatch(listProducts());
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen relative home-page bg-gradient-to-br from-slate-50 via-white to-gray-100">
//       {/* Subtle background pattern - only show when logo is centered */}
//       {!hasMovedToNavbar && (
//         <div className="absolute inset-0 overflow-hidden">
//           {/* Geometric pattern overlay */}
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          
//           {/* Soft gradient overlays */}
//           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 via-transparent to-amber-50/20"></div>
//           <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
//           <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-r from-amber-100/20 to-transparent rounded-full blur-3xl"></div>
//         </div>
//       )}

//       {/* Main Logo - Center of screen, moves to navbar when scrolled, stays in navbar after that */}
//       <div className={`logo-transition transition-all duration-700 ease-in-out ${
//         hasMovedToNavbar 
//           ? 'fixed top-6 left-6 z-40 scale-75' 
//           : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 scale-100'
//       } ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
//         <div className="relative group">
//           {!hasMovedToNavbar ? (
//             // Split logo animation when centered
//             <div className="flex items-center space-x-1">
//               {/* Logo image coming from left - smaller size */}
//               <div className={`relative w-16 h-16 md:w-22 md:h-22 ${
//                 isVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-20'
//               }`}>
//                 <Image
//                   src="/logo1.jpg"
//                   alt="Wooden Art Logo"
//                   fill
//                   className="object-contain"
//                   priority
//                 />
//               </div>
              
//               {/* Text coming from right - normal size, taller than icon */}
//               <div className={`${
//                 isVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-20'
//               }`}>
//                 <div className="text-2xl md:text-2xl font-extrabold text-black leading-[0.8] animate-logo-bounce ">
//                   TRILOK
//                 </div>
//                 <div className="text-2xl md:text-2xl font-extrabold text-black leading-[0.8]">
//                   WOODEN
//                 </div>
//                 <div className="text-2xl md:text-2xl font-extrabold text-black leading-[0.8]">
//                   ARTS
//                 </div>
//               </div>
//             </div>
//           ) : (
//             // Complete logo when in navbar - stays here permanently
//             <div className="flex items-center space-x-0">
//               <div className="relative w-10 h-10">
//                 <Image
//                   src="/logo1.jpg"
//                   alt="Wooden Art Logo"
//                   fill
//                   className="object-contain"
//                   priority
//                 />
//               </div>
//               <div className="hidden sm:block">
//                 <div className="text-xs font-extrabold text-black leading-[1] ">
//                   TRILOK
//                 </div>
//                 <div className="text-xs font-extrabold text-black leading-[0.8]">
//                   WOODEN
//                 </div>
//                 <div className="text-xs font-extrabold text-black leading-[0.8]">
//                   ARTS
//                 </div>
//               </div>
//             </div>
//             )}
          
//           {/* Decorative glow effect - only when centered */}
//           {!hasMovedToNavbar && (
//             <div className="absolute inset-0 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-xl animate-logo-glow"></div>
//           )}
//         </div>
//       </div>

//       {/* Floating decorative elements - only show when logo is centered */}
//       {!hasMovedToNavbar && (
//         <>
//           <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-accent-300 rounded-full animate-pulse opacity-40"></div>
//           <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-primary-300 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>
//           <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-secondary-300 rounded-full animate-pulse opacity-35" style={{ animationDelay: '2s' }}></div>
//           <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-accent-400 rounded-full animate-pulse opacity-25" style={{ animationDelay: '0.5s' }}></div>
//         </>
//       )}


//       {/* Content that appears when scrolling - visible when logo is in navbar */}
//       <div className={`relative z-10 transition-opacity duration-1000 ${hasMovedToNavbar ? 'opacity-100' : 'opacity-0'}`}>
//         <div className="pt-32 pb-20 px-6 min-h-screen">
//           <div className="max-w-7xl mx-auto space-y-20">
            
//             {/* Hero Section */}
//             <section className="text-center space-y-6 my-50">
//               <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900">
//                 Handcrafted Wooden Excellence
//               </h1>
//               <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
//                 Premium wooden products & custom furniture for homes, offices, hotels & more
//               </p>
//               <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
//                 <Link href="/gallery" className="px-10 py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
//                   View Gallery
//                 </Link>
//                 <Link href="/contact" className="px-10 py-4 border-2 border-amber-700 hover:bg-amber-700 hover:text-white text-amber-700 rounded-xl font-bold text-lg transition-all">
//                   Contact Us
//                 </Link>
//               </div>
//             </section>

//             {/* Two Main Services */}
//             <section className="grid md:grid-cols-2 gap-6">
//               <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-10 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-2xl">
//                 <div className="text-6xl mb-6 text-center">🪵</div>
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">Wooden Products for Sale</h2>
//                 <p className="text-gray-700 mb-6">
//                   Handcrafted wooden items perfect for everyday use and home decoration.
//                 </p>
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {['Laptop Tables', 'Mobile Stands', 'Jewelry Holders', 'Home Decor'].map((item) => (
//                     <span key={item} className="px-4 py-2 bg-white/80 text-gray-800 rounded-full text-sm font-medium border border-amber-300">
//                       {item}
//                     </span>
//                   ))}
//                 </div>
//                 <Link href="/products" className="inline-block px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold transition-all hover:scale-105">
//                   Shop Now →
//                 </Link>
//               </div>

//               <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-10 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-2xl">
//                 <div className="text-6xl mb-6 text-center">🏠</div>
//                 <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Furniture Solutions</h2>
//                 <p className="text-gray-700 mb-6">
//                   From homes to hotels, offices to restaurants — custom furniture tailored to your space.
//                 </p>
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {['Ceiling Panels', 'Bed Frames', 'Cabinet Systems', 'Office Desks'].map((item) => (
//                     <span key={item} className="px-4 py-2 bg-white/80 text-gray-800 rounded-full text-sm font-medium border border-orange-300">
//                       {item}
//                     </span>
//                   ))}
//                 </div>
//                 <Link href="/services" className="inline-block px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white rounded-lg font-semibold transition-all hover:scale-105">
//                   Learn More →
//                 </Link>
//               </div>
//             </section>

//             {/* Recent Products */}
//             <RecentProducts products={recent.map((p) => ({
//               id: p.id,
//               name: p.name,
//               price: p.price,
//               image: (p as unknown as { featureImage?: string; image?: string }).featureImage ||
//                      (p as unknown as { featureImage?: string; image?: string }).image,
//               createdAt: p.createdAt,
//             }))} />

//             {/* CTA Section */}
//             <section className="bg-gradient-to-r from-amber-700 to-orange-700 rounded-3xl p-12 text-white text-center">
//               <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
//               <p className="text-xl mb-8 text-amber-100">
//                 WhatsApp: +91 83061 26245
//               </p>
//               <Link href="/contact" className="inline-block px-10 py-4 bg-white hover:bg-gray-100 text-amber-800 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl">
//                 Get In Touch
//               </Link>
//             </section>
//           </div>
//         </div>
//       </div>

//       {/* Floating Admin Button - Only visible for ADMIN users when logo is in navbar */}
//       {isAdmin && user && hasMovedToNavbar && (
//         <div className="fixed bottom-6 right-6 z-50">
//           <Link
//             href="/admin"
//             className="group relative inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 font-semibold text-sm"
//           >
//             <div className="flex items-center space-x-3">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               <span>Admin Panel</span>
//             </div>
//             {/* Animated background effect */}
//             <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             {/* Pulse effect */}
//             <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/30 to-slate-600/30 animate-pulse"></div>
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { useState, useEffect } from "react";

import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Craftsmanship from "@/components/Craftsmanship";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  
 

  return (
    <div className="min-h-screen">
      
      <Hero />
      <Services />
      <Gallery />
      <Craftsmanship />
      <ContactCTA />
      <Footer />
    </div>
  );
}
