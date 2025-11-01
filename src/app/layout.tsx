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
    if (!showLoading) {
      const handleScroll = () => {
        if (window.scrollY > 60) setShowNavbar(true);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [showLoading]);
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased ${showLoading ? "bg-background" : ""}`} >
        <ReduxProvider>
          <AuthProvider>
            {/* Hide navbar on auth routes */}
            {!(pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset')) && (
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
