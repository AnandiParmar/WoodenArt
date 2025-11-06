"use client";

/**
 * @author: @dorian_baffier
 * @description: Card Flip
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { Repeat2, ShoppingCart, Heart, Star } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CardFlipProps {
    // Product data
    id: string;
    image?: string | null;
    title: string;
    description?: string | null;
    price: number;
    discount?: number | null;
    rating?: number;
    reviewsCount?: number;
    stock?: number;
    category?: string;
    // Actions
    onAddToCart?: () => void;
    onToggleWishlist?: () => void;
    isInWishlist?: boolean;
    isLoading?: boolean;
    // Link
    productUrl?: string;
}

export default function CardFlip({
    id,
    image,
    title,
    description,
    price,
    discount = 0,
    rating = 4.5,
    reviewsCount = 120,
    stock = 0,
    category,
    onAddToCart,
    onToggleWishlist,
    isInWishlist = false,
    isLoading = false,
    productUrl,
}: CardFlipProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    
    const finalPrice = discount && discount > 0 ? price - (price * discount / 100) : price;

    return (
        <div
            className="relative w-full h-[335px] group [perspective:2000px] mx-auto"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div
                className={cn(
                    "relative w-full h-full",
                    "[transform-style:preserve-3d]",
                    "transition-all duration-700",
                    isFlipped
                        ? "[transform:rotateY(180deg)]"
                        : "[transform:rotateY(0deg)]"
                )}
            >
                {/* Front Side - Product Image */}
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(0deg)]",
                        "overflow-hidden rounded-2xl",
                        "bg-white",
                        "border border-gray-200",
                        "shadow-sm",
                        "transition-all duration-900",
                        "group-hover:shadow-xl",
                        isFlipped ? "opacity-0" : "opacity-100"
                    )}
                >
                    <div className="relative w-full h-full">
                        {/* Product Image */}
                        <div className="relative w-full h-72 ">
                            {image ? (
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className="object-contain p-4"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300">
                                    <div className="text-center">
                                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-2" />
                                        <p className="text-sm">No Image</p>
                                    </div>
                                </div>
                            )}
                        
                            {/* Discount Badge */}
                            {typeof discount === 'number' && discount > 0 && (
                                <div className="absolute top-3 right-3">
                                    <Badge className="bg-red-500 text-white font-semibold px-2 py-1 shadow-lg">
                                        -{discount}%
                                    </Badge>
                                </div>
                            )}
                    </div>

                        {/* Title and Flip Icon */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white/95 to-transparent pt-0">
                        <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 leading-snug tracking-tight line-clamp-2 transition-all duration-500 group-hover:translate-y-[-4px]">
                                    {title}
                                </h3>
                                    {category && (
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                            {category}
                                </p>
                                    )}
                            </div>
                                <div className="relative group/icon flex-shrink-0">
                                <div
                                    className={cn(
                                        "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                                            "bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent"
                                    )}
                                />
                                    <Repeat2 className="relative z-10 w-5 h-5 text-amber-600 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side - Product Details */}
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                        "p-6 rounded-2xl",
                        "bg-white",
                        "border border-gray-200",
                        "shadow-sm",
                        "flex flex-col",
                        "transition-all duration-700",
                        "group-hover:shadow-xl",
                        !isFlipped ? "opacity-0" : "opacity-100"
                    )}
                >
                    <div className="flex-1 space-y-4">
                        {/* Title */}
                        {productUrl ? (
                            <Link href={productUrl} className="block">
                                <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight transition-all duration-500 group-hover:translate-y-[-2px] hover:text-amber-700">
                                    {title}
                                </h3>
                            </Link>
                        ) : (
                            <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight transition-all duration-500 group-hover:translate-y-[-2px]">
                                {title}
                            </h3>
                        )}

                        {/* Description */}
                        {description && (
                            <p className="text-sm text-gray-600 tracking-tight transition-all duration-500 group-hover:translate-y-[-2px] line-clamp-3">
                                {description}
                            </p>
                        )}

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold text-gray-700">{rating}</span>
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{reviewsCount} reviews</span>
                        </div>

                        {/* Price Section */}
                        <div className="pt-1 border-t border-gray-100">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{finalPrice.toFixed(2)}
                                </span>
                                {typeof discount === 'number' && discount > 0 && (
                                    <>
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{price.toFixed(2)}
                                        </span>
                                        <Badge variant="destructive" className="text-xs">
                                            {discount}% OFF
                                        </Badge>
                                    </>
                                )}
                            </div>
                            {stock <= 0 && (
                                <Badge variant="destructive" className="mt-1 text-xs">Out of Stock</Badge>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 mt-2 border-t border-gray-200 space-y-2">
                        <Button
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart?.();
                            }}
                            disabled={isLoading || stock <= 0}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleWishlist?.();
                                }}
                                disabled={isLoading}
                            >
                                <Heart
                                    className={cn(
                                        "w-4 h-4 transition-all duration-300",
                                        isInWishlist
                                            ? "fill-red-500 text-red-500"
                                            : "text-gray-600"
                                    )}
                                />
                            </Button>
                            {productUrl && (
                                <Link href={productUrl} className="flex-1">
                                    <Button
                                        variant="outline"
                                        className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                                    >
                                        View Details
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
