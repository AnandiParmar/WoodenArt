"use client";
import { useState, useMemo, useEffect } from "react";
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
import DomeGallery from "@/components/Animations/Dome/DomeGallery";

interface Product {
    id: string;
    name: string;
    featureImage: string | null;
    images?: string[] | null;
    category?: {
        id: string;
        name: string;
    } | null;
}

interface Category {
    id: string;
    name: string;
}

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Fetch products and categories when products category is selected
    useEffect(() => {
       
            setLoadingProducts(true);
            
            // Fetch categories
            const fetchCategories = async () => {
                try {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    const headers: HeadersInit = { 'Content-Type': 'application/json' };
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const categoriesRes = await fetch('/api/graphql', {
                        method: 'POST',
                        headers,
                        credentials: 'include',
                        body: JSON.stringify({
                            query: `query { categories { id name } }`
                        }),
                    });
                    const categoriesData = await categoriesRes.json();
                    if (categoriesData.data?.categories) {
                        setCategories(categoriesData.data.categories);
                    }
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };

            // Fetch products
            const fetchProducts = async () => {
                try {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    const headers: HeadersInit = { 'Content-Type': 'application/json' };
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const productsRes = await fetch('/api/graphql', {
                        method: 'POST',
                        headers,
                        credentials: 'include',
                        body: JSON.stringify({
                            query: `query { products(filter: { isActive: true }, first: 100) { edges { node { id name featureImage images category { id name } } } } }`
                        }),
                    });
                    const productsData = await productsRes.json();
                    if (productsData.data?.products?.edges) {
                        const productsList = productsData.data.products.edges.map((edge: any) => edge.node);
                        setProducts(productsList);
                    }
                } catch (error) {
                    console.error('Error fetching products:', error);
                } finally {
                    setLoadingProducts(false);
                }
            };

            fetchCategories();
            fetchProducts();
        
    }, []);

    // Convert products to gallery image format - include all images (featureImage + images array)
    const productImages: GalleryImage[] = useMemo(() => {
        const images: GalleryImage[] = [];
        
        products
            .filter((p) => {
                // Check if product has any images (featureImage or images array)
                const hasImages = p.featureImage || (p.images && Array.isArray(p.images) && p.images.length > 0);
                if (!hasImages) return false;
                
                // Filter by subcategory if selected
                if (selectedSubcategory === "all") return true;
                return p.category && p.category.id === selectedSubcategory;
            })
            .forEach((p) => {
                const productImagesList: string[] = [];
                
                // Add featureImage if it exists
                if (p.featureImage) {
                    productImagesList.push(p.featureImage);
                }
                
                // Add all images from images array (avoid duplicates)
                if (p.images && Array.isArray(p.images)) {
                    p.images.forEach((img) => {
                        if (img && typeof img === 'string' && !productImagesList.includes(img)) {
                            productImagesList.push(img);
                        }
                    });
                }
                
                // Create a gallery image for each product image (only if src is valid)
                productImagesList
                    .filter((imgSrc) => imgSrc && typeof imgSrc === 'string' && imgSrc.trim() !== '')
                    .forEach((imgSrc, imgIndex) => {
                        images.push({
                            id: `product-${p.id}-image-${imgIndex}`,
                            src: imgSrc,
                            alt: `${p.name}${imgIndex > 0 ? ` - Image ${imgIndex + 1}` : ''}`,
                            category: "products",
                            subcategory: p.category?.id || "all",
                        });
                    });
            });
        
        return images;
    }, [products, selectedSubcategory]);

    const filteredImages: GalleryImage[] = useMemo(() => {
        // Build base set according to the selected category
        let base: GalleryImage[];
        if (selectedCategory === "products") {
            base = productImages;
        } else if (selectedCategory === "all") {
            // Merge dynamic products with static/gallery furniture items
            const FurnitureImages = galleryImages.filter((img: GalleryImage) => img.category === "furniture");
            base = [...productImages, ...FurnitureImages];
        } else {
            // Furniture or other single categories based on static list
            base = galleryImages.filter((img: GalleryImage) => img.category === selectedCategory);
        }

        // Apply subcategory filter if any
        if (selectedSubcategory !== "all") {
            base = base.filter((img: GalleryImage) => img.subcategory === selectedSubcategory);
        }

        return base;
    }, [selectedCategory, selectedSubcategory, productImages]);

    const availableSubcategories = useMemo(() => {
        if (selectedCategory === "products") {
            // Use dynamic categories from database
            return categories.map((cat) => ({
                id: cat.id,
                label: cat.name,
            }));
        }
        
        if (selectedCategory === "all") {
            return [...gallerySubcategories.products, ...gallerySubcategories.furniture];
        }
        
        return gallerySubcategories.furniture;
    }, [selectedCategory, categories]);

    // Calculate dynamic counts based on actual images
    const galleryCategoriesWithCounts = useMemo(() => {
        const furnitureImagesCount = galleryImages.filter((img: GalleryImage) => img.category === "furniture").length;
        const productsImagesCount = productImages.length;
        const allItemsCount = furnitureImagesCount + productsImagesCount;

        return galleryCategories.map((cat) => {
            if (cat.id === "all") {
                return { ...cat, count: allItemsCount };
            } else if (cat.id === "products") {
                return { ...cat, count: productsImagesCount };
            } else if (cat.id === "furniture") {
                return { ...cat, count: furnitureImagesCount };
            }
            return cat;
        });
    }, [productImages]);

    const openLightbox = (index: number) => {
        // Ensure index is valid
        if (index >= 0 && index < filteredImages.length) {
        setLightboxIndex(index);
        setLightboxOpen(true);
        }
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setSelectedSubcategory("all");
        // Reset lightbox when category changes
        setLightboxIndex(0);
        setLightboxOpen(false);
    };

    // Reset lightbox index when filtered images change
    useEffect(() => {
        if (lightboxIndex >= filteredImages.length) {
            setLightboxIndex(0);
            if (lightboxOpen) {
                setLightboxOpen(false);
            }
        }
    }, [filteredImages.length, lightboxIndex, lightboxOpen]);

    // Prepare images array for lightbox - filter out any invalid entries
    const lightboxImages = useMemo(() => {
        return filteredImages
            .filter((img) => img && img.src && img.alt)
            .map((img) => ({ src: img.src, alt: img.alt }));
    }, [filteredImages]);

    // if(selectedCategory == 'all'){
    //     return 
    // }
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
                        {galleryCategoriesWithCounts.map((category: GalleryCategory) => (
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
                            {loadingProducts ? (
                                "Loading products..."
                            ) : (
                                <>
                            Showing <span className="font-semibold text-foreground">{filteredImages.length}</span> items
                                </>
                            )}
                        </p>
                    </motion.div>
                    {selectedCategory != 'all' && (
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loadingProducts ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-md animate-pulse" />
                            ))
                        ) : (
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
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
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
                        )}
                    </motion.div>
                    )}
                    {selectedCategory == 'all' && (
                    <div className="flex justify-center items-center w-full min-h-[80vh] overflow-hidden">
                        <div className="w-full max-w-[1400px] h-[80vh] mx-auto [&_.edge-fade]:hidden [&_.overlay]:hidden">
                            <DomeGallery images={[...productImages, ...galleryImages.filter((img: GalleryImage) => img.category === "furniture").map((img: GalleryImage) => ({ src: img.src, alt: img.alt }))]} fit={0.5} fitBasis="auto" minRadius={600} maxRadius={Infinity} padFactor={0.25}  dragSensitivity={0.5} enlargeTransitionMs={300} dragDampening={2} openedImageWidth="400px" openedImageHeight="400px" imageBorderRadius="30px" openedImageBorderRadius="30px" grayscale={true} />
                        </div>
                    </div>
                    )}
                    {/* Empty State */}
                    {!loadingProducts && filteredImages.length === 0 && (
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
                {lightboxImages.length > 0 && (
                <ImageLightbox
                        images={lightboxImages}
                        currentIndex={Math.min(lightboxIndex, lightboxImages.length - 1)}
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                        onNext={() => setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)}
                    onPrev={() =>
                            setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length)
                    }
                />
                )}
            </div>
            <Footer />
        </>
    );
}