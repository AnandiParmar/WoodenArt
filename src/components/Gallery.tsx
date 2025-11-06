import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { useState, useEffect } from "react";

const galleryImages = [
  { src: "/FeaturedWork/Feature1.png", alt: "Wooden walking stick carved with owl design" },
  { src: "/FeaturedWork/Feature3.jpeg", alt: "Modern modular kitchen interior with wooden cabinets and beige finish" },
  { src: "/FeaturedWork/Feature5.jpg", alt: "Wooden Dolphine-shaped mobile stand with double slot design" },
  { src: "/FeaturedWork/Feature4.jpeg", alt: "Contemporary living room interior with wooden paneling and TV unit" },
  { src: "/FeaturedWork/Feature2.png", alt: "Wooden turtle figurine handcrafted decor piece" },
  { src: "/FeaturedWork/Feature6.png", alt: "Foldable wooden table and heart-shaped wooden jewelry box set" },
];


export default function Gallery() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  
  const handleCardClick = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    // Toggle: if same card is clicked, close it; otherwise open the clicked card
    const newIndex = clickedIndex === index ? null : index;
    setClickedIndex(newIndex);
  };

  // Close overlay when clicking outside on mobile
  useEffect(() => {
    if (clickedIndex !== null) {
      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        const target = e.target as HTMLElement;
        // Don't close if clicking inside any gallery card or overlay content
        const clickedCard = target.closest('[data-testid^="gallery-item"]');
        const clickedOverlay = target.closest('.gallery-overlay-content');
        
        if (!clickedCard && !clickedOverlay) {
          setClickedIndex(null);
        }
      };
      
      // Use a delay to avoid immediate closing when card is clicked
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true);
        document.addEventListener('touchend', handleClickOutside, true);
      }, 200);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside, true);
        document.removeEventListener('touchend', handleClickOutside, true);
      };
    }
  }, [clickedIndex]);
  
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
          initial={{ opacity: 0 ,y: 50}}
          animate={inView ? { opacity: 1 ,y: 0 } : { opacity: 0 ,y: 50 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group shadow-xl/30 border border-gray-200  bg-background/40  hover:shadow-xl transition-shadow"
            >
            <motion.div
              
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="group relative aspect-[4/3] overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
              data-testid={`gallery-item-${index}`}
              onClick={(e) => handleCardClick(e, index)}
              onTouchEnd={(e) => handleCardClick(e, index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover UI to mimic the reference layout without dimming entire image */}
              {/* Show on hover (desktop) OR when clicked (mobile) */}
              <div 
                className={`gallery-overlay-content absolute inset-0 z-10 transition-opacity duration-300 ${
                  clickedIndex === index 
                    ? 'opacity-100' 
                    : 'opacity-0 md:group-hover:opacity-100'
                }`}
                style={{
                  pointerEvents: clickedIndex === index ? 'auto' : 'none'
                }}
              >
                {/* top full-width black header with text */}
                <div className="pointer-events-none absolute top-0 left-0 w-full h-2/4 bg-black/90 rounded-b-md shadow-lg">
                  <div className="p-5 m-auto">
                    <h3 className="text-white md:text-2xl text-lg font-semibold leading-tight">{image.alt}</h3>
                    {/* <p className="text-blue-200 mt-2">This ones pretty nice</p> */}
                  </div>
                </div>
                {/* small thumbnail bottom-left */}
                <div className="pointer-events-none absolute left-0 bottom-0 md:w-50 md:h-37 w-[50%] h-[50%] max-w-[50%] max-h-[50%] overflow-hidden bg-white  ring-1 ring-white/20 shadow">
                  <img
                    src={image.src}
                    alt="preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* MORE link bottom-right */}
                  <div className="absolute right-0 bottom-0 md:w-50 md:h-37 w-[50%] h-[50%] max-w-[50%] max-h-[50%] bg-white flex items-center justify-center border border-gray-200 pointer-events-auto overflow-hidden">
                  <a
                    href="#"
                    className="text-indigo-900 text-sm font-medium tracking-wide hover:text-indigo-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    MORE ↗
                  </a>
                </div>
              </div>
            </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
