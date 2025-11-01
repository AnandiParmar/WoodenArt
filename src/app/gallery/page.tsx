"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageLightbox from "@/components/ImageLightbox";
import {
    galleryImages,
    galleryCategories,
    gallerySubcategories,
    type GalleryImage,
    type GalleryCategory,
    type SubcategoryItem,
} from "../../shared/galleryData";

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Using framer-motion viewport on elements instead of an external intersection observer

    const filteredImages: GalleryImage[] = useMemo(() => {
        let filtered: GalleryImage[] = galleryImages;

        if (selectedCategory !== "all") {
            filtered = filtered.filter((img: GalleryImage) => img.category === selectedCategory);
        }

        if (selectedSubcategory !== "all") {
            filtered = filtered.filter((img: GalleryImage) => img.subcategory === selectedSubcategory);
        }

        return filtered;
    }, [selectedCategory, selectedSubcategory]);

    const availableSubcategories = useMemo(() => {
        if (selectedCategory === "all" || selectedCategory === "products") {
            return selectedCategory === "all"
                ? [...gallerySubcategories.products, ...gallerySubcategories.furniture]
                : gallerySubcategories.products;
        }
        return gallerySubcategories.furniture;
    }, [selectedCategory]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setSelectedSubcategory("all");
    };

    return (
        <>
            <Navbar showLogo={true} />
            <div className="min-h-screen pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-foreground mb-4">
                            Our Gallery
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Explore our extensive collection of handcrafted wooden products and furniture
                        </p>
                    </motion.div>

                    {/* Main Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-3 mb-8"
                    >
                        {galleryCategories.map((category: GalleryCategory) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? "default" : "outline"}
                                onClick={() => handleCategoryChange(category.id)}
                                className="font-semibold"
                                data-testid={`button-category-${category.id}`}
                            >
                                {category.label}
                                <Badge variant="secondary" className="ml-2">
                                    {category.count}
                                </Badge>
                            </Button>
                        ))}
                    </motion.div>

                    {/* Subcategory Filter */}
                    {selectedCategory !== "all" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 overflow-hidden"
                        >
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <Badge
                                    variant={selectedSubcategory === "all" ? "default" : "outline"}
                                    className="cursor-pointer px-4 py-2 hover-elevate active-elevate-2"
                                    onClick={() => setSelectedSubcategory("all")}
                                    data-testid="badge-subcategory-all"
                                >
                                    All
                                </Badge>
                                {availableSubcategories.map((sub: SubcategoryItem) => (
                                    <Badge
                                        key={sub.id}
                                        variant={selectedSubcategory === sub.id ? "default" : "outline"}
                                        className="cursor-pointer px-4 py-2 hover-elevate active-elevate-2"
                                        onClick={() => setSelectedSubcategory(sub.id)}
                                        data-testid={`badge-subcategory-${sub.id}`}
                                    >
                                        {sub.label}
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Results Count */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mb-8"
                    >
                        <p className="text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{filteredImages.length}</span> items
                        </p>
                    </motion.div>

                    {/* Gallery Grid */}
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredImages.map((image: GalleryImage, index: number) => (
                                <motion.div
                                    key={image.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4, delay: index * 0.02 }}
                                    className="group relative aspect-square overflow-hidden rounded-md hover-elevate active-elevate-2 cursor-pointer"
                                    onClick={() => openLightbox(index)}
                                    data-testid={`gallery-image-${image.id}`}
                                >
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <p className="text-white text-sm font-medium line-clamp-2">
                                                {image.alt}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Empty State */}
                    {filteredImages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <p className="text-muted-foreground text-lg">
                                No items found in this category. Please try a different filter.
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Lightbox */}
                <ImageLightbox
                    images={filteredImages.map((img) => ({ src: img.src, alt: img.alt }))}
                    currentIndex={lightboxIndex}
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    onNext={() => setLightboxIndex((lightboxIndex + 1) % filteredImages.length)}
                    onPrev={() =>
                        setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length)
                    }
                />
            </div>
            <Footer />
        </>
    );
}