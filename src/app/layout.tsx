'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/redux-provider";
// import { ConditionalNavbar } from "@/components/conditional-navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import LoadingAnimation from "@/components/LoadingAnimation";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket  from "@/Sokcet";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// export const metadata: Metadata = {
//   title: "Wooden Art - Crafting Digital Excellence",
//   description: "Experience the perfect blend of traditional craftsmanship and modern digital innovation. Beautiful animations and warm earthy design.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Show overlay immediately on first paint; reveal content after animation
  const [showNavbar, setShowNavbar] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const pathname = usePathname();


  useEffect(() => {

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server=============================');
     
    });
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (hasVisited) {
      setShowLoading(false);
      setShowNavbar(true);
    } else {
      // Keep overlay visible for first visit
      localStorage.setItem("hasVisitedBefore", "true");
      setShowNavbar(true);
      setShowLoading(true);
    }

  }, []);

  const handleAnimationComplete = () => {
    setShowLoading(false);
    setShowNavbar(true);
  };

  useEffect(() => {
    // Don't attach scroll listener on admin/auth routes - navbar should never show there
    const isAdminOrAuthRoute = pathname.startsWith('/login') || 
                                pathname.startsWith('/register') || 
                                pathname.startsWith('/forgot-password') || 
                                pathname.startsWith('/reset') || 
                                pathname.startsWith('/admin');
    
    if (!showLoading && !isAdminOrAuthRoute) {
      // Navbar should always be visible on non-admin routes
      // The showLogo prop controls logo visibility, not navbar visibility
      setShowNavbar(true);
    }
  }, [showLoading, pathname]);

  useEffect(() => {
    // Always hide navbar on admin and auth routes
    if(pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset') || pathname.startsWith('/admin')) {
      setShowNavbar(false);
    } else {
      // For other routes, always show navbar (visible at top and when scrolled)
      setShowNavbar(true);
    }
  }, [pathname]);
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/public/logo2.jpg" />
        <title>Trilok Wooden Art</title>
        <meta name="description" content="Trilok Wooden Art is a platform for creating and sharing wooden art." />
        <meta name="keywords" content="wooden art, art, craft, woodworking, handmade" />
        <meta name="author" content="TriLok Wooden Art" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandexbot" content="index, follow" />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased ${showLoading ? "bg-background" : ""}`} >
        <ReduxProvider>
          <AuthProvider>
            {/* Hide navbar on auth routes and admin routes - never show on admin routes */}
            {!pathname.startsWith('/admin') && 
             !pathname.startsWith('/login') && 
             !pathname.startsWith('/register') && 
             !pathname.startsWith('/forgot-password') && 
             !pathname.startsWith('/reset') && (
              <Navbar showLogo={showNavbar} />
            )}
            {showLoading && <LoadingAnimation onComplete={handleAnimationComplete} />}

              {children}
            {/* </LiquidEther> */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
