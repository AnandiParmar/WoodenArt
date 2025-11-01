import { useState } from "react";
import ImageLightbox from "../ImageLightbox";
import { Button } from "@/components/ui/button";

const sampleImages = [
  { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", alt: "Mountain 1" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e", alt: "Forest" },
  { src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29", alt: "Mountain 2" },
];

export default function ImageLightboxExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>Open Lightbox</Button>
      <ImageLightbox
        images={sampleImages}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNext={() => setCurrentIndex((currentIndex + 1) % sampleImages.length)}
        onPrev={() => setCurrentIndex((currentIndex - 1 + sampleImages.length) % sampleImages.length)}
      />
    </div>
  );
}
