// // NOTE: Use public paths (strings) to avoid StaticImageData typing from Next image imports
// const ringBox = "/generated_images/Wooden_ring_box_7bd1291c.png";
// const brushStand = "/generated_images/Wooden_brush_stand_5515b3e0.png";
// const cupHolder = "/generated_images/Wooden_cup_holder_440ef6a2.png";
// const wallClock = "/generated_images/Wooden_wall_clock_91a5bf12.png";
// const deskLamp = "/generated_images/Wooden_desk_lamp_5cac8fd5.png";
// const antiqueImage = "/generated_images/Carved_wooden_antique_decorations_51ccec9b.png";
// const organizerImage = "/generated_images/Wooden_desk_organizer_set_c18c88e8.png";

// const bedImage = "/generated_images/Wooden_bed_frame_06862ac8.png";
// const bedroomImage = "/generated_images/Premium_wooden_bedroom_furniture_9cef91ce.png";
// const doorImage = "/generated_images/Carved_wooden_door_cdffdce1.png";
// const hotelImage = "/generated_images/Hotel_wooden_furniture_installation_d56e8f6e.png";
// const kitchenImage = "/generated_images/Wooden_kitchen_cabinets_f5ad184f.png";
// const tvUnitImage = "/generated_images/Wooden_TV_unit_3300b34c.png";
// const sofaImage = "/generated_images/Wooden_sofa_frame_d33a65ba.png";
// const restaurantImage = "/generated_images/Restaurant_wooden_furniture_setup_0cf1f7bf.png";
// const coffeeTableImage = "/generated_images/Wooden_coffee_table_lifestyle_782cab75.png";
// const bookshelfImage = "/generated_images/Wooden_bookshelf_home_library_f9948e5e.png";

// export interface GalleryImage {
//   id: string;
//   src: string;
//   alt: string;
//   category: string;
//   subcategory: string;
// }

// export const galleryCategories = [
//   { id: "all", label: "All Items", count: 0 },
//   { id: "products", label: "Products", count: 0 },
//   { id: "furniture", label: "Furniture", count: 0 },
// ];

// export const gallerySubcategories = {
//   products: [
//     { id: "ring-box", label: "Ring Boxes" },
//     { id: "antique", label: "Antiques" },
//     { id: "brush-stand", label: "Brush Stands" },
//     { id: "cup-holder", label: "Cup Holders" },
//     { id: "desk-accessories", label: "Desk Accessories" },
//     { id: "home-decor", label: "Home Decor" },
//   ],
//   furniture: [
//     { id: "bed", label: "Beds" },
//     { id: "door", label: "Doors" },
//     { id: "hotel-furniture", label: "Hotel Furniture" },
//     { id: "kitchen", label: "Kitchen" },
//     { id: "tv-unit", label: "TV Units" },
//     { id: "sofa", label: "Sofas" },
//     { id: "dining", label: "Dining" },
//     { id: "storage", label: "Storage" },
//   ],
// };

// // Gallery images organized by category
// export const galleryImages: GalleryImage[] = [
//   // Products - Ring Boxes
//   { id: "p1", src: ringBox, alt: "Handcrafted wooden ring box", category: "products", subcategory: "ring-box" },
//   { id: "p2", src: ringBox, alt: "Carved wooden jewelry box", category: "products", subcategory: "ring-box" },
//   { id: "p3", src: ringBox, alt: "Premium ring holder box", category: "products", subcategory: "ring-box" },
//   { id: "p4", src: ringBox, alt: "Luxury wooden ring case", category: "products", subcategory: "ring-box" },
//   { id: "p5", src: ringBox, alt: "Elegant ring storage box", category: "products", subcategory: "ring-box" },

//   // Products - Antiques
//   { id: "p6", src: antiqueImage, alt: "Carved wooden antique panel", category: "products", subcategory: "antique" },
//   { id: "p7", src: antiqueImage, alt: "Traditional wooden sculpture", category: "products", subcategory: "antique" },
//   { id: "p8", src: antiqueImage, alt: "Antique wooden artifact", category: "products", subcategory: "antique" },
//   { id: "p9", src: antiqueImage, alt: "Decorative wooden antique", category: "products", subcategory: "antique" },
//   { id: "p10", src: antiqueImage, alt: "Heritage wooden carving", category: "products", subcategory: "antique" },
//   { id: "p11", src: antiqueImage, alt: "Classic wooden ornament", category: "products", subcategory: "antique" },

//   // Products - Brush Stands
//   { id: "p12", src: brushStand, alt: "Wooden brush organizer", category: "products", subcategory: "brush-stand" },
//   { id: "p13", src: brushStand, alt: "Desk brush holder", category: "products", subcategory: "brush-stand" },
//   { id: "p14", src: brushStand, alt: "Handcrafted brush stand", category: "products", subcategory: "brush-stand" },
//   { id: "p15", src: brushStand, alt: "Multi-compartment brush holder", category: "products", subcategory: "brush-stand" },
//   { id: "p16", src: brushStand, alt: "Natural wood brush organizer", category: "products", subcategory: "brush-stand" },

//   // Products - Cup Holders
//   { id: "p17", src: cupHolder, alt: "Wooden cup holder set", category: "products", subcategory: "cup-holder" },
//   { id: "p18", src: cupHolder, alt: "Circular wooden coaster", category: "products", subcategory: "cup-holder" },
//   { id: "p19", src: cupHolder, alt: "Premium cup holder", category: "products", subcategory: "cup-holder" },
//   { id: "p20", src: cupHolder, alt: "Handmade wooden coaster set", category: "products", subcategory: "cup-holder" },

//   // Products - Desk Accessories
//   { id: "p21", src: organizerImage, alt: "Wooden desk organizer", category: "products", subcategory: "desk-accessories" },
//   { id: "p22", src: organizerImage, alt: "Pen holder set", category: "products", subcategory: "desk-accessories" },
//   { id: "p23", src: deskLamp, alt: "Wooden desk lamp", category: "products", subcategory: "desk-accessories" },
//   { id: "p24", src: organizerImage, alt: "Desk storage organizer", category: "products", subcategory: "desk-accessories" },

//   // Products - Home Decor
//   { id: "p25", src: wallClock, alt: "Rustic wooden wall clock", category: "products", subcategory: "home-decor" },
//   { id: "p26", src: wallClock, alt: "Handcrafted wall clock", category: "products", subcategory: "home-decor" },
//   { id: "p27", src: deskLamp, alt: "Modern wooden lamp", category: "products", subcategory: "home-decor" },

//   // Furniture - Beds
//   { id: "f1", src: bedImage, alt: "King size wooden bed frame", category: "furniture", subcategory: "bed" },
//   { id: "f2", src: bedroomImage, alt: "Premium bedroom furniture set", category: "furniture", subcategory: "bed" },
//   { id: "f3", src: bedImage, alt: "Modern wooden bed", category: "furniture", subcategory: "bed" },
//   { id: "f4", src: bedroomImage, alt: "Luxury bed frame with headboard", category: "furniture", subcategory: "bed" },
//   { id: "f5", src: bedImage, alt: "Contemporary wooden bed", category: "furniture", subcategory: "bed" },
//   { id: "f6", src: bedroomImage, alt: "Elegant bedroom set", category: "furniture", subcategory: "bed" },
//   { id: "f7", src: bedImage, alt: "Custom wooden bed frame", category: "furniture", subcategory: "bed" },
//   { id: "f8", src: bedroomImage, alt: "Handcrafted bed furniture", category: "furniture", subcategory: "bed" },
//   { id: "f9", src: bedImage, alt: "Minimalist wooden bed", category: "furniture", subcategory: "bed" },
//   { id: "f10", src: bedroomImage, alt: "Classic bedroom furniture", category: "furniture", subcategory: "bed" },

//   // Furniture - Doors
//   { id: "f11", src: doorImage, alt: "Carved wooden door", category: "furniture", subcategory: "door" },
//   { id: "f12", src: doorImage, alt: "Traditional wooden entrance door", category: "furniture", subcategory: "door" },
//   { id: "f13", src: doorImage, alt: "Custom carved door design", category: "furniture", subcategory: "door" },
//   { id: "f14", src: doorImage, alt: "Solid wood door panel", category: "furniture", subcategory: "door" },
//   { id: "f15", src: doorImage, alt: "Decorative wooden door", category: "furniture", subcategory: "door" },

//   // Furniture - Hotel Furniture
//   { id: "f16", src: hotelImage, alt: "Hotel lobby furniture", category: "furniture", subcategory: "hotel-furniture" },
//   { id: "f17", src: hotelImage, alt: "Custom hotel reception desk", category: "furniture", subcategory: "hotel-furniture" },
//   { id: "f18", src: restaurantImage, alt: "Restaurant dining furniture", category: "furniture", subcategory: "hotel-furniture" },
//   { id: "f19", src: hotelImage, alt: "Hotel room furniture set", category: "furniture", subcategory: "hotel-furniture" },
//   { id: "f20", src: restaurantImage, alt: "Commercial dining setup", category: "furniture", subcategory: "hotel-furniture" },
//   { id: "f21", src: hotelImage, alt: "Luxury hotel furniture", category: "furniture", subcategory: "hotel-furniture" },
//   { id: "f22", src: restaurantImage, alt: "Restaurant interior furniture", category: "furniture", subcategory: "hotel-furniture" },
//   { id: "f23", src: hotelImage, alt: "Hotel seating arrangement", category: "furniture", subcategory: "hotel-furniture" },

//   // Furniture - Kitchen
//   { id: "f24", src: kitchenImage, alt: "Wooden kitchen cabinets", category: "furniture", subcategory: "kitchen" },
//   { id: "f25", src: kitchenImage, alt: "Custom kitchen island", category: "furniture", subcategory: "kitchen" },
//   { id: "f26", src: kitchenImage, alt: "Modern kitchen cabinetry", category: "furniture", subcategory: "kitchen" },
//   { id: "f27", src: kitchenImage, alt: "Kitchen storage solutions", category: "furniture", subcategory: "kitchen" },
//   { id: "f28", src: kitchenImage, alt: "Handcrafted kitchen units", category: "furniture", subcategory: "kitchen" },
//   { id: "f29", src: kitchenImage, alt: "Contemporary kitchen design", category: "furniture", subcategory: "kitchen" },
//   { id: "f30", src: kitchenImage, alt: "Wooden kitchen furniture", category: "furniture", subcategory: "kitchen" },
//   { id: "f31", src: kitchenImage, alt: "Premium kitchen cabinets", category: "furniture", subcategory: "kitchen" },
//   { id: "f32", src: kitchenImage, alt: "Custom kitchen woodwork", category: "furniture", subcategory: "kitchen" },
//   { id: "f33", src: kitchenImage, alt: "Kitchen cabinetry set", category: "furniture", subcategory: "kitchen" },

//   // Furniture - TV Units
//   { id: "f34", src: tvUnitImage, alt: "Modern TV entertainment unit", category: "furniture", subcategory: "tv-unit" },
//   { id: "f35", src: tvUnitImage, alt: "Wooden TV stand with storage", category: "furniture", subcategory: "tv-unit" },
//   { id: "f36", src: tvUnitImage, alt: "Contemporary TV cabinet", category: "furniture", subcategory: "tv-unit" },
//   { id: "f37", src: tvUnitImage, alt: "Custom TV unit design", category: "furniture", subcategory: "tv-unit" },

//   // Furniture - Sofas
//   { id: "f38", src: sofaImage, alt: "Wooden frame sofa", category: "furniture", subcategory: "sofa" },
//   { id: "f39", src: sofaImage, alt: "Mid-century modern sofa", category: "furniture", subcategory: "sofa" },
//   { id: "f40", src: sofaImage, alt: "Elegant wooden sofa set", category: "furniture", subcategory: "sofa" },
//   { id: "f41", src: sofaImage, alt: "Contemporary sofa design", category: "furniture", subcategory: "sofa" },

//   // Furniture - Dining
//   { id: "f42", src: coffeeTableImage, alt: "Wooden dining table", category: "furniture", subcategory: "dining" },
//   { id: "f43", src: coffeeTableImage, alt: "Dining room furniture", category: "furniture", subcategory: "dining" },
//   { id: "f44", src: restaurantImage, alt: "Dining chairs and table set", category: "furniture", subcategory: "dining" },

//   // Furniture - Storage
//   { id: "f45", src: bookshelfImage, alt: "Wooden bookshelf", category: "furniture", subcategory: "storage" },
//   { id: "f46", src: bookshelfImage, alt: "Library shelving unit", category: "furniture", subcategory: "storage" },
//   { id: "f47", src: bookshelfImage, alt: "Custom storage cabinet", category: "furniture", subcategory: "storage" },
// ];

// // Update category counts
// galleryCategories[0].count = galleryImages.length;
// galleryCategories[1].count = galleryImages.filter(img => img.category === "products").length;
// galleryCategories[2].count = galleryImages.filter(img => img.category === "furniture").length;
