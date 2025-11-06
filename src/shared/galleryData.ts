export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "products" | "furniture";
  subcategory: string;
}

export interface GalleryCategory {
  id: "all" | "products" | "furniture";
  label: string;
  count: number;
}

export interface SubcategoryItem {
  id: string;
  label: string;
}

// Furniture sources mapped from /public/Furniture subfolders
const furnitureSources = [
  { id: "bed", label: "Beds", basePath: "/Furniture/bed/", files: [
"BED_FURNITURE_13.jpeg","BED_FURNITURE_14.jpeg","BED_FURNITURE_15.jpeg",
    "BED_FURNITURE_16.jpeg","BED_FURNITURE_17.jpeg","BED_FURNITURE_18.jpeg","BED_FURNITURE_10.jpeg","BED_FURNITURE_11.jpeg",
    "BED_FURNITURE_12.jpeg"
  ]},
  { id: "cupboard", label: "Cupboards", basePath: "/Furniture/cupboard/", files: [
    "FURNITURE_CUPBOARD1.jpeg","FURNITURE_CUPBOARD_2.jpeg","FURNITURE_CUPBOARD_6.jpeg","FURNITURE_CUPBOARD_7.jpeg","FURNITURE_CUPBOARD_8.jpeg"
  ]},
  { id: "door", label: "Doors", basePath: "/Furniture/door/", files: [
    "DOOR_FURNITURE_1.jpg","DOOR_FURNITURE_2.jpg","DOOR_FURNITURE_6.jpeg","DOOR_FURNITURE_7.jpeg","DOOR_FURNITURE_8.jpeg","DOOR_FURNITURE_9.jpeg"
  ]},
  { id: "dressing-mirror", label: "Dressing Mirrors", basePath: "/Furniture/DRESSING MIRROR/", files: [
   "DRESSING_FURNITURE_3.jpeg","DRESSING_FURNITURE_4.jpeg","DRESSING_FURNITURE_5.jpeg"
  ]},
  { id: "hotel-furniture", label: "Hotel Furniture", basePath: "/Furniture/hotel/", files: [
    "WhatsApp Image 2025-10-20 at 8.01.40 PM.jpeg",
    "WhatsApp Image 2025-10-20 at 8.01.50 PM (1).jpeg","WhatsApp Image 2025-10-20 at 8.01.52 PM.jpeg",
    "WhatsApp Image 2025-10-20 at 8.03.49 PM.jpeg","WhatsApp Image 2025-10-20 at 8.04.03 PM.jpeg",
    "WhatsApp Image 2025-10-20 at 8.04.07 PM.jpeg",
    "DSC05770.JPG","DSC05772.JPG","DSC05775.JPG","DSC05778.JPG","DSC05799.JPG","DSC05811.JPG","DSC05812.JPG"
  ]},
  { id: "hotel-hall-decor", label: "Hall Decor", basePath: "/Furniture/hotel/HALL DECORE/", files: [
    "HALL DECORE_1.jpeg","HALL DECORE_2.jpeg","HALL DECORE_3.jpeg","HALL DECORE_4.jpeg","HALL DECORE_5.jpeg"
  ]},
  { id: "kitchen", label: "Kitchens", basePath: "/Furniture/kitchen/", files: [
    "WhatsApp Image 2025-10-20 at 8.03.37 PM.jpeg","WhatsApp Image 2025-10-20 at 8.03.57 PM.jpeg",
    "WhatsApp Image 2025-10-20 at 8.04.05 PM (2).jpeg","WhatsApp Image 2025-10-20 at 8.04.07 PM (1).jpeg",
    "WhatsApp Image 2025-10-20 at 8.04.12 PM.jpeg"
  ]},
  { id: "main-gate", label: "Main Gates", basePath: "/Furniture/main gate/", files: [
    "SHRIHARI_VRL_2 (3).JPG","SHRIHARI_VRL_2 (5).JPG","SHRIHARI_VRL_2 (6).JPG",
    "SHRIHARI_VRL_4 (1).JPG",
    "SHRIHARI_VRL_4 (3).JPG","SHRIHARI_VRL_4 (7).JPG","WhatsApp Image 2025-10-20 at 8.01.47 PM (1).jpeg",
    "WhatsApp Image 2025-10-20 at 8.01.57 PM (1).jpeg"
  ]},
  { id: "sofa", label: "Sofas", basePath: "/Furniture/SOFA/", files: [
"WhatsApp Image 2025-10-20 at 8.03.54 PM.jpeg","WhatsApp Image 2025-10-20 at 8.04.10 PM (1).jpeg","03fb2ffb-6899-4758-bfd7-2bec6fa84593.jpg",
    "WhatsApp Image 2025-10-20 at 8.01.48 PM.jpeg","WhatsApp Image 2025-10-20 at 8.01.53 PM (1).jpeg",
    
  ]},
  { id: "step-railing", label: "Step Railings", basePath: "/Furniture/STEP RELLLING/", files: [
    "WhatsApp Image 2025-10-20 at 8.01.34 PM.jpeg"
  ]},
  { id: "tv-unit", label: "TV Units", basePath: "/Furniture/tv unit/", files: [
    "WhatsApp Image 2025-10-20 at 8.03.51 PM.jpeg","WhatsApp Image 2025-10-20 at 8.03.53 PM.jpeg",
    "WhatsApp Image 2025-10-20 at 8.04.05 PM (1).jpeg","WhatsApp Image 2025-10-20 at 8.04.08 PM (1).jpeg",
    "WhatsApp Image 2025-10-20 at 8.04.11 PM (1).jpeg","WhatsApp Image 2025-10-20 at 8.04.11 PM (2).jpeg",
    "WhatsApp Image 2025-10-20 at 8.04.11 PM.jpeg",
    "SHRIHARI_VRL_4 (25).JPG",
    "SHRIHARI_VRL_4 (51).JPG","WhatsApp Image 2025-10-20 at 8.01.30 PM.jpeg",
    "WhatsApp Image 2025-10-20 at 8.01.32 PM.jpeg",
    "WhatsApp Image 2025-10-20 at 8.01.33 PM.jpeg","WhatsApp Image 2025-10-20 at 8.01.38 PM (1).jpeg",
    "WhatsApp Image 2025-10-20 at 8.01.45 PM.jpeg","WhatsApp Image 2025-10-20 at 8.01.46 PM.jpeg",
    "WhatsApp Image 2025-10-20 at 8.01.54 PM.jpeg"
    
  ]},
  { id: "wall-unit", label: "Wall Units", basePath: "/Furniture/WALL UNIT/", files: [
   "WhatsApp Image 2025-10-20 at 8.04.08 PM.jpeg",
    "WhatsApp Image 2025-10-20 at 8.04.09 PM.jpeg","WhatsApp Image 2025-10-20 at 8.04.11 PM.jpeg"
  ]},
];

const furnitureSubcategories: SubcategoryItem[] = furnitureSources.map((s) => ({ id: s.id, label: s.label }));

export const gallerySubcategories: Record<"products" | "furniture", SubcategoryItem[]> = {
  products: [
    { id: "ring-box", label: "Ring Boxes" },
    { id: "antique", label: "Antiques" },
    { id: "brush-stand", label: "Brush Stands" },
    { id: "cup-holder", label: "Cup Holders" },
    { id: "desk-accessories", label: "Desk Accessories" },
    { id: "home-decor", label: "Home Decor" },
  ],
  furniture: furnitureSubcategories,
};

export const galleryImages: GalleryImage[] = [];

// Add ALL furniture images derived from the folder lists above
furnitureSources.forEach((group) => {
  group.files.forEach((file, index) => {
    galleryImages.push({
      id: `${group.id}-${index}`,
      src: `${group.basePath}${file}`,
      alt: group.label,
      category: "furniture",
      subcategory: group.id,
    });
  });
});

export const galleryCategories: GalleryCategory[] = [
  { id: "all", label: "All Items", count: 0 },
  { id: "products", label: "Products", count: 0 },
  { id: "furniture", label: "Furniture", count: 0 },
];

// Compute counts dynamically based on images
galleryCategories[0].count = galleryImages.length;
galleryCategories[1].count = galleryImages.filter((img) => img.category === "products").length;
galleryCategories[2].count = galleryImages.filter((img) => img.category === "furniture").length;


