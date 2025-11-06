'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setOrders } from '@/redux/features/orders/orderSlice';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      // Scroll to order if orderId is provided
      setTimeout(() => {
        const element = document.getElementById(`order-${orderId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [searchParams]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        dispatch(setOrders(data.orders));
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-500';
      case 'SHIPPED':
        return 'bg-blue-500';
      case 'PROCESSING':
        return 'bg-yellow-500';
      case 'CONFIRMED':
        return 'bg-purple-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500';
      case 'FAILED':
        return 'bg-red-500';
      case 'REFUNDED':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <Button onClick={() => router.push('/shop')}>Browse Products</Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} id={`order-${order.id}`} className={searchParams.get('orderId') === order.id.toString() ? 'ring-2 ring-amber-500' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Items:</h3>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.productName} x {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-1 text-sm">
                        <p><strong>Shipping Address:</strong></p>
                        <p className="text-gray-600">
                          {order.shippingAddress}, {order.shippingCity}, {order.shippingState} - {order.shippingZipCode}
                        </p>
                        <p className="text-gray-600">Phone: {order.shippingPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}



