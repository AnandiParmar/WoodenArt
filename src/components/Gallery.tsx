import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const galleryImages = [
  { src: "/generated_images/Wooden_coffee_table_lifestyle_782cab75.png", alt: "Wooden coffee table in modern living room" },
  { src: "/generated_images/Wooden_bookshelf_home_library_f9948e5e.png", alt: "Wooden bookshelf home library" },
  { src: "/generated_images/Restaurant_wooden_furniture_setup_0cf1f7bf.png", alt: "Restaurant wooden furniture setup" },
  { src: "/generated_images/Wooden_desk_organizer_set_c18c88e8.png", alt: "Wooden desk organizer set" },
  { src: "/generated_images/Premium_wooden_bedroom_furniture_9cef91ce.png", alt: "Premium wooden bedroom furniture" },
  { src: "/generated_images/Carved_wooden_antique_decorations_51ccec9b.png", alt: "Carved wooden antique decorations" },
];

export default function Gallery() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="gallery" className="py-20 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Featured Work
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing our finest creations and custom installations
          </p>
        </div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="group relative aspect-[4/3] overflow-hidden rounded-md hover-elevate active-elevate-2"
              data-testid={`gallery-item-${index}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
