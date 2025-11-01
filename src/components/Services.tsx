import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Interior Furniture",
    description: "We manufacture customized furniture as per customer requirement suitable for home and hotel furniture.",
    image: "/generated_images/Premium_wooden_bedroom_furniture_9cef91ce.png",
  },
  {
    title: "Wooden Antiques",
    description: "We provide decorative wooden antique items with intricate craftsmanship and traditional designs.",
    image: "/generated_images/Carved_wooden_antique_decorations_51ccec9b.png",
  },
  {
    title: "Interior Decorating Furniture",
    description: "High quality interior decorative furniture for hotels, homes, restaurants, and industrial spaces as per customer requirement.",
    image: "/generated_images/Hotel_wooden_furniture_installation_d56e8f6e.png",
  },
  {
    title: "Wooden Items",
    description: "Wide range of wooden products including laptop tables, mobile stands, jewelry holders, and decorative collections.",
    image: "/generated_images/Wooden_lifestyle_product_collection_11ce2aae.png",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Our Craftsmanship
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            The wide range of furniture, decorative interior, and wooden handicraft services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
