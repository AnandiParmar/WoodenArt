import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const handleWhatsApp = () => {
    window.open("https://wa.me/918306126245", "_blank");
  };

  const handleExplore = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(/Elegant_wooden_dining_set_09ac1588.png)`,
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6">
            Handcrafted Excellence
            <br />
            <span className="text-primary-foreground">in Every Grain</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10"
        >
          Premium wooden furniture, decorative antiques, and custom interior solutions.
          Transforming spaces with timeless craftsmanship.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            onClick={handleWhatsApp}
            className="text-base font-semibold px-8 py-6 bg-primary/90 backdrop-blur-sm border border-primary-border"
            data-testid="button-whatsapp-hero"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact on WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={handleExplore}
            className="text-base font-semibold px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white/30"
            data-testid="button-explore"
          >
            Explore Our Work
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-white/70 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
