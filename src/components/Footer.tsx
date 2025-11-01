import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
              Trilok Wooden Art
            </h3>
            <p className="text-muted-foreground mb-4">
              Premium handcrafted wooden furniture and decorative antiques since years of excellence.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Our Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#services" className="hover:text-primary transition-colors" data-testid="link-service-interior">
                  Interior Furniture
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors" data-testid="link-service-antiques">
                  Wooden Antiques
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors" data-testid="link-service-decorating">
                  Interior Decorating
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors" data-testid="link-service-items">
                  Wooden Items
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#services" className="hover:text-primary transition-colors" data-testid="link-about">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors" data-testid="link-gallery">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors" data-testid="link-custom">
                  Custom Orders
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors" data-testid="link-contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="tel:+918306126245" className="hover:text-primary transition-colors" data-testid="link-footer-phone">
                  +91 83061 26245
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a 
                  href="https://wa.me/918306126245" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  data-testid="link-footer-whatsapp"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@trilokwoodenart.in" className="hover:text-primary transition-colors" data-testid="link-footer-email">
                  info@trilokwoodenart.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Trilok Wooden Art. All rights reserved. Crafted with passion.</p>
        </div>
      </div>
    </footer>
  );
}
