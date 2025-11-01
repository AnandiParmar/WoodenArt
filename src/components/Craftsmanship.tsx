import { motion } from "framer-motion";
import Image from "next/image";

interface CraftSection {
  title: string;
  description: string;
  image: string;
  imageLeft: boolean;
}

const craftSections: CraftSection[] = [
  {
    title: "Expert Artisans",
    description: "Our skilled craftsmen bring decades of experience, combining traditional woodworking techniques with modern precision to create furniture that stands the test of time.",
    image: "/generated_images/Artisan_crafting_wooden_furniture_b7d4dfe9.png",
    imageLeft: false,
  },
  {
    title: "Premium Materials",
    description: "We carefully select the finest quality timber, ensuring every piece showcases the natural beauty of wood grain while maintaining structural integrity and durability.",
    image: "/generated_images/Premium_wood_grain_texture_7275bbaf.png",
    imageLeft: true,
  },
  {
    title: "Precision Craftsmanship",
    description: "Every joint, every finish, every detail is meticulously crafted to perfection. Our attention to detail ensures furniture that is both beautiful and built to last generations.",
    image: "/generated_images/Expert_wooden_furniture_joinery_f5c306a0.png",
    imageLeft: false,
  },
];

export default function Craftsmanship() {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
            The Art of Woodworking
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Quality craftsmanship in every detail
          </p>
        </div>

        <div className="space-y-24">
          {craftSections.map((section) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                section.imageLeft ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={section.imageLeft ? "lg:order-2" : "lg:order-1"}>
                <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    priority={section.title === "Expert Artisans"}
                  />
                </div>
              </div>
              <div className={section.imageLeft ? "lg:order-1" : "lg:order-2"}>
                <h3 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                  {section.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {section.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
