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

export const gallerySubcategories: Record<"products" | "furniture", SubcategoryItem[]> = {
  products: [
    { id: "ring-box", label: "Ring Boxes" },
    { id: "antique", label: "Antiques" },
    { id: "brush-stand", label: "Brush Stands" },
    { id: "cup-holder", label: "Cup Holders" },
    { id: "desk-accessories", label: "Desk Accessories" },
    { id: "home-decor", label: "Home Decor" },
  ],
  furniture: [
    { id: "bed", label: "Beds" },
    { id: "door", label: "Doors" },
    { id: "hotel-furniture", label: "Hotel Furniture" },
    { id: "kitchen", label: "Kitchen" },
    { id: "tv-unit", label: "TV Units" },
    { id: "sofa", label: "Sofas" },
    { id: "dining", label: "Dining" },
    { id: "storage", label: "Storage" },
  ],
};

export const galleryImages: GalleryImage[] = [
  // Products - Ring Boxes
  { id: "p1", src: "/generated_images/Wooden_ring_box_7bd1291c.png", alt: "Handcrafted wooden ring box", category: "products", subcategory: "ring-box" },
  { id: "p2", src: "/generated_images/Wooden_ring_box_7bd1291c.png", alt: "Carved wooden jewelry box", category: "products", subcategory: "ring-box" },
  { id: "p3", src: "/generated_images/Wooden_ring_box_7bd1291c.png", alt: "Premium ring holder box", category: "products", subcategory: "ring-box" },
  { id: "p4", src: "/generated_images/Wooden_ring_box_7bd1291c.png", alt: "Luxury wooden ring case", category: "products", subcategory: "ring-box" },
  { id: "p5", src: "/generated_images/Wooden_ring_box_7bd1291c.png", alt: "Elegant ring storage box", category: "products", subcategory: "ring-box" },

  // Products - Antiques
  { id: "p6", src: "/generated_images/Carved_wooden_antique_decorations_51ccec9b.png", alt: "Carved wooden antique panel", category: "products", subcategory: "antique" },
  { id: "p7", src: "/generated_images/Carved_wooden_antique_decorations_51ccec9b.png", alt: "Traditional wooden sculpture", category: "products", subcategory: "antique" },
  { id: "p8", src: "/generated_images/Carved_wooden_antique_decorations_51ccec9b.png", alt: "Antique wooden artifact", category: "products", subcategory: "antique" },
  { id: "p9", src: "/generated_images/Carved_wooden_antique_decorations_51ccec9b.png", alt: "Decorative wooden antique", category: "products", subcategory: "antique" },
  { id: "p10", src: "/generated_images/Carved_wooden_antique_decorations_51ccec9b.png", alt: "Heritage wooden carving", category: "products", subcategory: "antique" },
  { id: "p11", src: "/generated_images/Carved_wooden_antique_decorations_51ccec9b.png", alt: "Classic wooden ornament", category: "products", subcategory: "antique" },

  // Products - Brush Stands
  { id: "p12", src: "/generated_images/Wooden_brush_stand_5515b3e0.png", alt: "Wooden brush organizer", category: "products", subcategory: "brush-stand" },
  { id: "p13", src: "/generated_images/Wooden_brush_stand_5515b3e0.png", alt: "Desk brush holder", category: "products", subcategory: "brush-stand" },
  { id: "p14", src: "/generated_images/Wooden_brush_stand_5515b3e0.png", alt: "Handcrafted brush stand", category: "products", subcategory: "brush-stand" },
  { id: "p15", src: "/generated_images/Wooden_brush_stand_5515b3e0.png", alt: "Multi-compartment brush holder", category: "products", subcategory: "brush-stand" },
  { id: "p16", src: "/generated_images/Wooden_brush_stand_5515b3e0.png", alt: "Natural wood brush organizer", category: "products", subcategory: "brush-stand" },

  // Products - Cup Holders
  { id: "p17", src: "/generated_images/Wooden_cup_holder_440ef6a2.png", alt: "Wooden cup holder set", category: "products", subcategory: "cup-holder" },
  { id: "p18", src: "/generated_images/Wooden_cup_holder_440ef6a2.png", alt: "Circular wooden coaster", category: "products", subcategory: "cup-holder" },
  { id: "p19", src: "/generated_images/Wooden_cup_holder_440ef6a2.png", alt: "Premium cup holder", category: "products", subcategory: "cup-holder" },
  { id: "p20", src: "/generated_images/Wooden_cup_holder_440ef6a2.png", alt: "Handmade wooden coaster set", category: "products", subcategory: "cup-holder" },

  // Products - Desk Accessories
  { id: "p21", src: "/generated_images/Wooden_desk_organizer_set_c18c88e8.png", alt: "Wooden desk organizer", category: "products", subcategory: "desk-accessories" },
  { id: "p22", src: "/generated_images/Wooden_desk_organizer_set_c18c88e8.png", alt: "Pen holder set", category: "products", subcategory: "desk-accessories" },
  { id: "p23", src: "/generated_images/Wooden_desk_lamp_5cac8fd5.png", alt: "Wooden desk lamp", category: "products", subcategory: "desk-accessories" },
  { id: "p24", src: "/generated_images/Wooden_desk_organizer_set_c18c88e8.png", alt: "Desk storage organizer", category: "products", subcategory: "desk-accessories" },

  // Products - Home Decor
  { id: "p25", src: "/generated_images/Wooden_wall_clock_91a5bf12.png", alt: "Rustic wooden wall clock", category: "products", subcategory: "home-decor" },
  { id: "p26", src: "/generated_images/Wooden_wall_clock_91a5bf12.png", alt: "Handcrafted wall clock", category: "products", subcategory: "home-decor" },
  { id: "p27", src: "/generated_images/Wooden_desk_lamp_5cac8fd5.png", alt: "Modern wooden lamp", category: "products", subcategory: "home-decor" },

  // Furniture - Beds
  { id: "f1", src: "/generated_images/Wooden_bed_frame_06862ac8.png", alt: "King size wooden bed frame", category: "furniture", subcategory: "bed" },
  { id: "f2", src: "/generated_images/Premium_wooden_bedroom_furniture_9cef91ce.png", alt: "Premium bedroom furniture set", category: "furniture", subcategory: "bed" },
  { id: "f3", src: "/generated_images/Wooden_bed_frame_06862ac8.png", alt: "Modern wooden bed", category: "furniture", subcategory: "bed" },
  { id: "f4", src: "/generated_images/Premium_wooden_bedroom_furniture_9cef91ce.png", alt: "Luxury bed frame with headboard", category: "furniture", subcategory: "bed" },
  { id: "f5", src: "/generated_images/Wooden_bed_frame_06862ac8.png", alt: "Contemporary wooden bed", category: "furniture", subcategory: "bed" },
  { id: "f6", src: "/generated_images/Premium_wooden_bedroom_furniture_9cef91ce.png", alt: "Elegant bedroom set", category: "furniture", subcategory: "bed" },
  { id: "f7", src: "/generated_images/Wooden_bed_frame_06862ac8.png", alt: "Custom wooden bed frame", category: "furniture", subcategory: "bed" },
  { id: "f8", src: "/generated_images/Premium_wooden_bedroom_furniture_9cef91ce.png", alt: "Handcrafted bed furniture", category: "furniture", subcategory: "bed" },
  { id: "f9", src: "/generated_images/Wooden_bed_frame_06862ac8.png", alt: "Minimalist wooden bed", category: "furniture", subcategory: "bed" },
  { id: "f10", src: "/generated_images/Premium_wooden_bedroom_furniture_9cef91ce.png", alt: "Classic bedroom furniture", category: "furniture", subcategory: "bed" },

  // Furniture - Doors
  { id: "f11", src: "/generated_images/Carved_wooden_door_cdffdce1.png", alt: "Carved wooden door", category: "furniture", subcategory: "door" },
  { id: "f12", src: "/generated_images/Carved_wooden_door_cdffdce1.png", alt: "Traditional wooden entrance door", category: "furniture", subcategory: "door" },
  { id: "f13", src: "/generated_images/Carved_wooden_door_cdffdce1.png", alt: "Custom carved door design", category: "furniture", subcategory: "door" },
  { id: "f14", src: "/generated_images/Carved_wooden_door_cdffdce1.png", alt: "Solid wood door panel", category: "furniture", subcategory: "door" },
  { id: "f15", src: "/generated_images/Carved_wooden_door_cdffdce1.png", alt: "Decorative wooden door", category: "furniture", subcategory: "door" },

  // Furniture - Hotel Furniture
  { id: "f16", src: "/generated_images/Hotel_wooden_furniture_installation_d56e8f6e.png", alt: "Hotel lobby furniture", category: "furniture", subcategory: "hotel-furniture" },
  { id: "f17", src: "/generated_images/Hotel_wooden_furniture_installation_d56e8f6e.png", alt: "Custom hotel reception desk", category: "furniture", subcategory: "hotel-furniture" },
  { id: "f18", src: "/generated_images/Restaurant_wooden_furniture_setup_0cf1f7bf.png", alt: "Restaurant dining furniture", category: "furniture", subcategory: "hotel-furniture" },
  { id: "f19", src: "/generated_images/Hotel_wooden_furniture_installation_d56e8f6e.png", alt: "Hotel room furniture set", category: "furniture", subcategory: "hotel-furniture" },
  { id: "f20", src: "/generated_images/Restaurant_wooden_furniture_setup_0cf1f7bf.png", alt: "Commercial dining setup", category: "furniture", subcategory: "hotel-furniture" },
  { id: "f21", src: "/generated_images/Hotel_wooden_furniture_installation_d56e8f6e.png", alt: "Luxury hotel furniture", category: "furniture", subcategory: "hotel-furniture" },
  { id: "f22", src: "/generated_images/Restaurant_wooden_furniture_setup_0cf1f7bf.png", alt: "Restaurant interior furniture", category: "furniture", subcategory: "hotel-furniture" },
  { id: "f23", src: "/generated_images/Hotel_wooden_furniture_installation_d56e8f6e.png", alt: "Hotel seating arrangement", category: "furniture", subcategory: "hotel-furniture" },

  // Furniture - Kitchen
  { id: "f24", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Wooden kitchen cabinets", category: "furniture", subcategory: "kitchen" },
  { id: "f25", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Custom kitchen island", category: "furniture", subcategory: "kitchen" },
  { id: "f26", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Modern kitchen cabinetry", category: "furniture", subcategory: "kitchen" },
  { id: "f27", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Kitchen storage solutions", category: "furniture", subcategory: "kitchen" },
  { id: "f28", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Handcrafted kitchen units", category: "furniture", subcategory: "kitchen" },
  { id: "f29", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Contemporary kitchen design", category: "furniture", subcategory: "kitchen" },
  { id: "f30", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Wooden kitchen furniture", category: "furniture", subcategory: "kitchen" },
  { id: "f31", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Premium kitchen cabinets", category: "furniture", subcategory: "kitchen" },
  { id: "f32", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Custom kitchen woodwork", category: "furniture", subcategory: "kitchen" },
  { id: "f33", src: "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png", alt: "Kitchen cabinetry set", category: "furniture", subcategory: "kitchen" },

  // Furniture - TV Units
  { id: "f34", src: "/generated_images/Wooden_TV_unit_3300b34c.png", alt: "Modern TV entertainment unit", category: "furniture", subcategory: "tv-unit" },
  { id: "f35", src: "/generated_images/Wooden_TV_unit_3300b34c.png", alt: "Wooden TV stand with storage", category: "furniture", subcategory: "tv-unit" },
  { id: "f36", src: "/generated_images/Wooden_TV_unit_3300b34c.png", alt: "Contemporary TV cabinet", category: "furniture", subcategory: "tv-unit" },
  { id: "f37", src: "/generated_images/Wooden_TV_unit_3300b34c.png", alt: "Custom TV unit design", category: "furniture", subcategory: "tv-unit" },

  // Furniture - Sofas
  { id: "f38", src: "/generated_images/Wooden_sofa_frame_d33a65ba.png", alt: "Wooden frame sofa", category: "furniture", subcategory: "sofa" },
  { id: "f39", src: "/generated_images/Wooden_sofa_frame_d33a65ba.png", alt: "Mid-century modern sofa", category: "furniture", subcategory: "sofa" },
  { id: "f40", src: "/generated_images/Wooden_sofa_frame_d33a65ba.png", alt: "Elegant wooden sofa set", category: "furniture", subcategory: "sofa" },
  { id: "f41", src: "/generated_images/Wooden_sofa_frame_d33a65ba.png", alt: "Contemporary sofa design", category: "furniture", subcategory: "sofa" },

  // Furniture - Dining
  { id: "f42", src: "/generated_images/Wooden_coffee_table_lifestyle_782cab75.png", alt: "Wooden dining table", category: "furniture", subcategory: "dining" },
  { id: "f43", src: "/generated_images/Wooden_coffee_table_lifestyle_782cab75.png", alt: "Dining room furniture", category: "furniture", subcategory: "dining" },
  { id: "f44", src: "/generated_images/Restaurant_wooden_furniture_setup_0cf1f7bf.png", alt: "Dining chairs and table set", category: "furniture", subcategory: "dining" },

  // Furniture - Storage
  { id: "f45", src: "/generated_images/Wooden_bookshelf_home_library_f9948e5e.png", alt: "Wooden bookshelf", category: "furniture", subcategory: "storage" },
  { id: "f46", src: "/generated_images/Wooden_bookshelf_home_library_f9948e5e.png", alt: "Library shelving unit", category: "furniture", subcategory: "storage" },
  { id: "f47", src: "/generated_images/Wooden_bookshelf_home_library_f9948e5e.png", alt: "Custom storage cabinet", category: "furniture", subcategory: "storage" },
];

export const galleryCategories: GalleryCategory[] = [
  { id: "all", label: "All Items", count: 0 },
  { id: "products", label: "Products", count: 0 },
  { id: "furniture", label: "Furniture", count: 0 },
];

// Compute counts dynamically based on images
galleryCategories[0].count = galleryImages.length;
galleryCategories[1].count = galleryImages.filter((img) => img.category === "products").length;
galleryCategories[2].count = galleryImages.filter((img) => img.category === "furniture").length;


