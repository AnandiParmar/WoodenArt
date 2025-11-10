'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setCartItems, updateCartItemQuantity, removeFromCart } from '@/redux/features/cart/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Cookies from 'js-cookie';

export default function CartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading before checking user status
    if (authLoading) {
      return;
    }

    // Check if user is authenticated - check both from context and cookies/localStorage as fallback
    const isAuthenticated = Cookies.get('isAuthenticated') === 'true' || localStorage.getItem('isAuthenticated') === 'true';
    const isUserAuthenticated = user || isAuthenticated;

    if (!isUserAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [user, authLoading, router]);

  const fetchCart = async () => {
    try {
      const query = `query {
        myCart {
          productId
          productName
          productImage
          price
          discount
          quantity
          stock
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
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (data.errors) {
        toast.error(data.errors[0]?.message || 'Failed to load cart');
      } else if (data.data?.myCart) {
        dispatch(setCartItems(data.data.myCart));
      }
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string , newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const mutation = `mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
        updateCartItem(productId: $productId, quantity: $quantity) {
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
          variables: { productId: String(productId), quantity: newQuantity },
        }),
      });

      const data = await res.json();
      if (data.errors) {
        toast.error(data.errors[0]?.message || 'Failed to update quantity');
      } else if (data.data?.updateCartItem) {
        dispatch(updateCartItemQuantity({ productId: String(productId), quantity: data.data.updateCartItem.quantity }));
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (productId: string ) => {
    try {
      const mutation = `mutation RemoveFromCart($productId: ID!) {
        removeFromCart(productId: $productId)
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
          variables: { productId: String(productId) },
        }),
      });

      const data = await res.json();
      if (data.errors) {
        toast.error(data.errors[0]?.message || 'Failed to remove item');
      } else if (data.data?.removeFromCart) {
        dispatch(removeFromCart(String(productId)));
        toast.success('Removed from cart');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price;
      const discount = item.discount || 0;
      const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
      return total + finalPrice * item.quantity;
    }, 0);
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  // Don't render if not authenticated (redirect is happening)
  const isAuthenticated = Cookies.get('isAuthenticated') === 'true' || localStorage.getItem('isAuthenticated') === 'true';
  if (!user && !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <Navbar showLogo={true} />
      
      <div className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
              <Link href="/shop">
                <Button>Browse Products</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => {
                  const finalPrice = item.discount
                    ? item.price - (item.price * item.discount / 100)
                    : item.price;
                  const productId = String(item.productId);

                  return (
                    <Card key={productId}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Link href={`/shop/${productId}`}>
                            <div className="relative w-24 h-24 bg-gray-100 rounded-lg">
                              {item.productImage ? (
                                <Image
                                  src={item.productImage}
                                  alt={item.productName}
                                  fill
                                  className="object-contain rounded-lg"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                          </Link>
                          
                          <div className="flex-1">
                            <Link href={`/shop/${productId}`}>
                              <h3 className="font-semibold text-lg mb-2 hover:text-amber-700">
                                {item.productName}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-xl font-bold">₹{(finalPrice * item.quantity).toFixed(2)}</span>
                              {item.discount && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUpdateQuantity(productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-12 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUpdateQuantity(productId, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(productId)}
                              >
                                <Trash2 className="w-5 h-5 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div>
                <Card className="p-6 sticky top-32">
                  <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => router.push('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}



