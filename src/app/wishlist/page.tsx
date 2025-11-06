'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setWishlistItems, removeFromWishlist } from '@/redux/features/wishlist/wishlistSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const query = `
        query GetWishlist {
          myWishlist {
            productId
            productName
            productImage
            price
            discount
            stock
          }
        }
      `;
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.errors) {
          toast.error(json.errors[0]?.message || 'Failed to load wishlist');
        } else {
          const items = (json.data?.myWishlist || []).map((w: any) => ({
            productId: String(w.productId),
            productName: w.productName,
            productImage: w.productImage ?? undefined,
            price: Number(w.price) || 0,
            discount: Number(w.discount) || 0,
            stock: Number(w.stock) || 0,
          }));
          dispatch(setWishlistItems(items));
        }
      } else {
        toast.error('Failed to load wishlist');
      }
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number | string) => {
    try {
      const mutation = `mutation RemoveFromWishlist($productId: ID!) {
        removeFromWishlist(productId: $productId)
      }`;

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          query: mutation,
          variables: { productId: String(productId) },
        }),
      });

      if (res.ok) {
        dispatch(removeFromWishlist(productId));
        toast.success('Removed from wishlist');
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = async (productId:  string) => {
    try {
      const mutation = `mutation AddToCart($productId: ID!, $quantity: Int!) {
        addToCart(productId: $productId, quantity: $quantity) { productId quantity }
      }`;

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          query: mutation,
          variables: { productId: String(productId), quantity: 1 },
        }),
      });

      if (res.ok) {
        toast.success('Added to cart!');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (!user) return null;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <Navbar showLogo={true} />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          {wishlistItems.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Start adding products to your wishlist</p>
              <Link href="/shop">
                <Button>Browse Products</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => {
                const finalPrice = item.discount
                  ? item.price - (item.price * item.discount / 100)
                  : item.price;

                return (
                  <Card key={item.productId} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Link href={`/shop/${item.productId}`}>
                      <div className="relative w-full h-64 ">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </Link>

                    <CardContent className="p-4">
                      <Link href={`/shop/${item.productId}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-amber-700">
                          {item.productName}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold">
                          ₹{finalPrice.toFixed(2)}
                        </span>
                        {item.discount && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddToCart(item.productId)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemove(item.productId)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}



