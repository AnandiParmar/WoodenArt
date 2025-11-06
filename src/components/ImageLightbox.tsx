'use client';

import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  images: Array<{ src: string; alt: string }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: ImageLightboxProps) {
  if (!images.length) return null;

  // Ensure currentIndex is valid
  const validIndex = Math.max(0, Math.min(currentIndex, images.length - 1));
  const currentImage = images[validIndex];
  
  // If currentImage is still undefined, close the lightbox
  if (!currentImage) {
    if (isOpen) {
      onClose();
    }
    return null;
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 border-none bg-transparent shadow-none overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{currentImage.alt || "Image viewer"}</DialogTitle>
        </VisuallyHidden>
        
        {/* Backdrop with blur and subtle gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br backdrop-blur-lg"
          onClick={onClose}
        />

        {/* Main content container */}
        <div className="relative w-full h-full flex items-center justify-center z-10">
          {/* Close button - Top right */}
         

          {/* Image container */}
          <div 
            className="flex items-center justify-center w-full h-full px-4 md:px-8 py-4 md:py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative flex items-center justify-center w-full h-full"
              >
                <div className="relative max-w-full max-h-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-visible flex items-center justify-center border border-white/20">
                  {/* Left arrow - Previous image */}
                  {images.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                      }}
                      className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-r from-white/95 to-white/90 hover:from-white hover:to-white text-gray-900 transition-all duration-300 hover:scale-110 shadow-xl border-2 border-gray-200/50 hover:border-gray-300 hover:shadow-2xl"
                      data-testid="button-prev-image"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-10 h-10 md:w-12 md:h-12 font-bold stroke-[3] text-gray-800" />
                    </Button>
                  )}
                  
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="max-w-full max-h-[75vh] object-contain block rounded-xl"
                    style={{ maxHeight: '75vh' }}
                  />
                  
                  {/* Right arrow - Next image */}
                  {images.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                      }}
                      className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-50 h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-l from-white/95 to-white/90 hover:from-white hover:to-white text-gray-900 transition-all duration-300 hover:scale-110 shadow-xl border-2 border-gray-200/50 hover:border-gray-300 hover:shadow-2xl"
                      data-testid="button-next-image"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-10 h-10 md:w-12 md:h-12 font-bold stroke-[3] text-gray-800" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
            
          </div>

          {/* Image counter and info - Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 z-50 pb-6 px-6">
            <div className="flex items-center justify-between max-w-4xl mx-auto gap-4">
              {/* Image title */}
              {currentImage.alt && (
                <div className="flex-1 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl rounded-full px-6 md:px-8 py-3 md:py-4 border border-white/30 shadow-xl">
                  <span className="text-sm md:text-base font-semibold text-white max-w-md truncate block">
                    {currentImage.alt}
                  </span>
                </div>
              )}
              
              {/* Counter and Close button */}
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl rounded-full px-5 md:px-6 py-3 md:py-4 border border-white/30 shadow-xl">
                  <span className="text-sm md:text-base font-bold text-white">
                    {currentIndex + 1} / {images.length}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 backdrop-blur-xl border border-red-400/30 hover:border-red-400/50 text-white transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-red-500/20"
                  data-testid="button-close-lightbox"
                  aria-label="Close lightbox"
                >
                  <X className="w-6 h-6 md:w-7 md:h-7 font-bold stroke-[3]" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
