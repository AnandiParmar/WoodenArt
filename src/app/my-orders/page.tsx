'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector } from '@/redux/store';
import Cookies from 'js-cookie';

interface OrderItemDto {
  id:  string;
  productId:  string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}

interface OrderDto {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: OrderItemDto[];
  createdAt: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const persistedUser = useAppSelector((s) => s.user);
  const router = useRouter();

  // Check authentication status from multiple sources
  const isAuthenticated = () => {
    // Check user from AuthContext
    if (user && user.role) return true;
    
    // Check persisted user from Redux
    if (persistedUser && persistedUser.role) return true;
    
    // Check cookies
    if (typeof window !== 'undefined') {
      const cookieAuth = Cookies.get('isAuthenticated') === 'true';
      const storageAuth = localStorage.getItem('isAuthenticated') === 'true';
      if (cookieAuth || storageAuth) return true;
    }
    
    return false;
  };

  // Fetch orders - only redirect if API call fails with Unauthorized
  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) {
      return;
    }

    const fetchOrders = async () => {
      // Don't redirect immediately - try to fetch first
      // The API will tell us if we're really unauthorized
      try {
        const res = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Include cookies in the request
          body: JSON.stringify({ query: `query{ myOrders{ id orderNumber status totalAmount createdAt items{ id productId productName productImage quantity price } } }` }),
        });
        const json = await res.json();
        
        if (json.errors) {
          // If there's an auth error, redirect to login
          if (json.errors.some((e: any) => e.message?.includes('Unauthorized'))) {
            setRedirecting(true);
            router.push(`/login?redirect=${encodeURIComponent('/my-orders')}`);
            return;
          }
        }
        
        if (json.data?.myOrders) {
          setOrders(json.data.myOrders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // Only redirect on network errors if we're definitely not authenticated
        if (!isAuthenticated()) {
          setRedirecting(true);
          router.push(`/login?redirect=${encodeURIComponent('/my-orders')}`);
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [router, authLoading]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
        <Navbar showLogo={true} />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render content if redirecting
  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
        <Navbar showLogo={true} />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-gray-500">Redirecting to login...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <Navbar showLogo={true} />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-600">You have no orders yet.</div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-4 flex items-center justify-between border-b border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500">Order</div>
                      <div className="font-semibold">{order.orderNumber}</div>
                    </div>
                    <div className="text-sm">
                      <span className={`px-3 py-1 rounded-full border transition-all duration-300 ${
                        order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        order.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        order.status === 'PROCESSING' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        order.status === 'SHIPPED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                        order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</div>
                  </div>
                  <div className="p-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          {item.productImage ? (
                            <Image src={item.productImage} alt={item.productName} fill className="object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-gray-900 font-medium">₹{item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}


