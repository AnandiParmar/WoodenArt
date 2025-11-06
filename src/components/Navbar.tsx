"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, ShoppingBag, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
interface NavbarProps {
  showLogo: boolean;
}

export default function Navbar({ showLogo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [introDismissed, setIntroDismissed] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const persistedUser = useAppSelector((state) => state.user);

  useEffect(() => {
    try {
      setIntroDismissed(sessionStorage.getItem('introDismissed') === '1');
    } catch {}
    const handleIntro = () => setIntroDismissed(true);
    window.addEventListener('intro-dismissed', handleIntro as EventListener);
    return () => window.removeEventListener('intro-dismissed', handleIntro as EventListener);
  }, []);

  const isLoggedIn = Boolean(
    (user && user.role) ||
    (persistedUser && persistedUser.role) ||
    (typeof window !== 'undefined' && localStorage.getItem('Authentication') === 'true')
  );

  const effectiveUser = (user && user.role) ? user : (persistedUser && persistedUser.role ? {
    firstName: persistedUser.firstName || 'User',
    lastName: persistedUser.lastName || '',
    email: persistedUser.email || '',
    role: persistedUser.role,
    id: persistedUser.id || 0,
  } as any : null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsApp = () => {
    window.open("https://wa.me/918306126245", "_blank");
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: showLogo ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border "
            : "bg-background/70 backdrop-blur-md shadow-sm bg-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              {introDismissed ? (
                <>
                  <div className="w-45 h-10 bg-foreground rounded-md flex items-center justify-left flex-shrink-0">
                    <Image src="/logo.png" alt="Logo" width={100} height={200} className="w-full h-full object-contain" />
                  </div>
                </>
              ) : (
                // Placeholder mount for animated logo to portal into after intro
                <div id="nav-logo-mount" className="w-[170px] h-12" />
              )}
            </motion.div>

            <div className="nav-inline-show items-center gap-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="link-nav-home">
                Home
              </Link>
              {pathname === "/" ? (
                <>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    data-testid="link-nav-services"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    data-testid="link-nav-contact"
                  >
                    Contact
                  </button>
                </>
              ) : null}
              <Link href="/gallery" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="link-nav-gallery">
                Gallery
              </Link>
              <Link href="/shop" className="text-foreground hover:text-primary transition-colors font-medium">
                Shop
              </Link>
              {effectiveUser && isLoggedIn && (
                <>
                  <Link href="/custom-furniture" className="text-foreground hover:text-primary transition-colors font-medium">
                    Custom Furniture
                  </Link>
                  <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors font-medium">
                    <ShoppingBag className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                  <Link href="/wishlist" className="relative text-foreground hover:text-primary transition-colors font-medium">
                    <Heart className="w-5 h-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                  <Link href="/orders" className="text-foreground hover:text-primary transition-colors font-medium">
                    Orders
                  </Link>
                </>
              )}
              {/* Auth area */}
              {effectiveUser && isLoggedIn ? (
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm text-foreground/80">Hi, {effectiveUser.firstName}</span>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-red-700 hover:bg-muted"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-amber-900 hover:bg-muted transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-orange-900 shadow-sm transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                size="sm"
                onClick={handleWhatsApp}
                className="hidden md:flex"
                data-testid="button-nav-whatsapp"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="nav-toggle-show p-2 hover-elevate active-elevate-2 rounded-md"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[73px] left-0 right-0 z-30 bg-background/98 backdrop-blur-md border-b border-border nav-mobile-only"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
                data-testid="link-mobile-home"
              >
                Home
              </Link>
              {pathname === "/" && (
                <>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
                    data-testid="link-mobile-services"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
                    data-testid="link-mobile-contact"
                  >
                    Contact
                  </button>
                </>
              )}
              <Link 
                href="/gallery" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
                data-testid="link-mobile-gallery"
              >
                Gallery
              </Link>
              <Link 
                href="/shop" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Shop
              </Link>
              {effectiveUser && isLoggedIn ? (
                <>
                  <Link 
                    href="/custom-furniture" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    Custom Furniture
                  </Link>
                  <Link 
                    href="/cart" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Cart {cartItems.length > 0 && `(${cartItems.length})`}
                  </Link>
                  <Link 
                    href="/wishlist" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    <Heart className="w-4 h-4" />
                    Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                  </Link>
                  <Link 
                    href="/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    Orders
                  </Link>
                </>
              ) : null}
              {effectiveUser && isLoggedIn ? (
                <div className="space-y-2">
                  <div className="py-2 text-sm text-foreground/80">Hi, {effectiveUser.firstName}</div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-3 rounded-md text-sm font-medium text-foreground hover:text-red-700 hover:bg-muted"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left py-2 text-foreground hover:text-amber-900 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left py-2 font-semibold text-white rounded-md bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-orange-900 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
              <Button
                size="sm"
                onClick={handleWhatsApp}
                className="w-full"
                data-testid="button-mobile-whatsapp"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact on WhatsApp
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
