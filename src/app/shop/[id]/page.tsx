'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const params = useParams();
  // MongoDB ObjectIds are strings, not integers
  const productId = params.id as string;
  const { user } = useAuth();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // When product changes, reset active image so a refresh shows the original image
  useEffect(() => {
    setActiveImage(null);
  }, [product]);

  const fetchProduct = async () => {
    if (!productId) return;
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
        } else {
          toast.error('Product not found');
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to load product');
      }
    } catch (error) {
      console.error('Product fetch error:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    setAdding(true);
    try {
      // Use GraphQL mutation instead of REST API
      const mutation = `mutation AddToCart($productId: ID!, $quantity: Int) {
        addToCart(productId: $productId, quantity: $quantity) {
          productId
          quantity
        }
      }`;
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          query: mutation,
          variables: { productId: productId, quantity },
        }),
      });

      const data = await res.json();
      if (data.errors) {
        toast.error(data.errors[0]?.message || 'Failed to add to cart');
      } else if (data.data?.addToCart) {
        toast.success('Added to cart!');
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Cart error:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    // Compare using string IDs (MongoDB ObjectIds)
    const isInWishlist = wishlist.some(item => 
      String(item.productId) === String(productId) || String(item.productId) === String(product?.id)
    );

    try {
      // Use GraphQL mutation instead of REST API
      const mutation = isInWishlist
        ? `mutation RemoveFromWishlist($productId: ID!) {
            removeFromWishlist(productId: $productId)
          }`
        : `mutation AddToWishlist($productId: ID!) {
            addToWishlist(productId: $productId)
          }`;
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          query: mutation,
          variables: { productId: productId },
        }),
      });

      const data = await res.json();
      if (data.errors) {
        toast.error(data.errors[0]?.message || 'Failed to update wishlist');
      } else {
        toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const finalPrice = product.discount
    ? product.price - (product.price * product.discount / 100)
    : product.price;
  const isInWishlist = wishlist.some(item => 
    String(item.productId) === String(product.id) || item.productId === product.id
  );
  const images = product.images && Array.isArray(product.images) ? product.images : [];
  const mainImage = product.featureImage || (images.length > 0 ? images[0] : null);
  const displayImage = activeImage ?? mainImage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <Navbar showLogo={true} />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="relative w-full h-96 bg-white rounded-lg mb-4">
                {displayImage ? (
                  <Image
                    key={displayImage}
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
                {product.discount > 0 && (
                  <Badge className="absolute top-4 right-4 bg-red-500">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img: string, idx: number) => {
                    const isActive = (activeImage ?? '') === img;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(img)}
                        className={`relative w-full h-20 bg-white rounded focus:outline-none ${isActive ? 'ring-2 ring-amber-600' : ''}`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain rounded" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{finalPrice.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium">4.5</span>
                <span className="text-gray-500">({product.totalRatings || 0} reviews)</span>
              </div>

              {product.description && (
                <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
              )}

              <div className="space-y-4 mb-6">
                {product.material && (
                  <div>
                    <span className="font-semibold">Material:</span> {product.material}
                  </div>
                )}
                {product.color && (
                  <div>
                    <span className="font-semibold">Color:</span> {product.color}
                  </div>
                )}
                {product.style && (
                  <div>
                    <span className="font-semibold">Style:</span> {product.style}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Stock:</span>{' '}
                  {product.stock > 0 ? (
                    <span className="text-green-600">{product.stock} available</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center gap-2 border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={adding || product.stock <= 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}



