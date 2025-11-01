import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function ContactCTA() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const handleWhatsApp = () => {
    window.open("https://wa.me/918306126245", "_blank");
  };

  return (
    <section id="contact" className="py-20 md:py-24 bg-accent/20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <MessageCircle className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
          Let's Create Together
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          We provide customized onsite interior decorative furniture making and services.
          Contact us for your unique wooden art requirements.
        </p>
        <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-foreground mb-8">
          <Phone className="w-6 h-6" />
          <a href="tel:+918306126245" className="hover:text-primary transition-colors" data-testid="link-phone">
            +91 83061 26245
          </a>
        </div>
        <Button
          size="lg"
          onClick={handleWhatsApp}
          className="text-base font-semibold px-8 py-6"
          data-testid="button-whatsapp-cta"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Contact us on WhatsApp
        </Button>
      </motion.div>
    </section>
  );
}
