"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  showLogo: boolean;
}

export default function Navbar({ showLogo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [introDismissed, setIntroDismissed] = useState<boolean>(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    try {
      setIntroDismissed(sessionStorage.getItem('introDismissed') === '1');
    } catch {}
    const handleIntro = () => setIntroDismissed(true);
    window.addEventListener('intro-dismissed', handleIntro as EventListener);
    return () => window.removeEventListener('intro-dismissed', handleIntro as EventListener);
  }, []);

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
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
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
                  <div className="w-10 h-10 bg-foreground rounded-md flex items-center justify-center flex-shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-6 h-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="hsl(var(--background))" />
                      <path d="M2 17l10 5 10-5" stroke="hsl(var(--background))" />
                      <path d="M2 12l10 5 10-5" stroke="hsl(var(--background))" />
                    </svg>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="font-serif text-xl font-bold text-foreground leading-none">
                      TRILOK
                      <br />
                      <span className="text-sm">WOODEN ART</span>
                    </h1>
                  </div>
                </>
              ) : (
                // Placeholder mount for animated logo to portal into after intro
                <div id="nav-logo-mount" className="w-[170px] h-12" />
              )}
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
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
              {/* Auth area */}
              {user ? (
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm text-foreground/80">Hi, {user.firstName}</span>
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
                className="md:hidden p-2 hover-elevate active-elevate-2 rounded-md"
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
            className="fixed top-[73px] left-0 right-0 z-30 bg-background/98 backdrop-blur-md border-b border-border md:hidden"
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
              {user ? (
                <div className="space-y-2">
                  <div className="py-2 text-sm text-foreground/80">Hi, {user.firstName}</div>
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
