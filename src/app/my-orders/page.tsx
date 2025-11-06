'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getSocket } from '@/lib/socketClient';

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `query{ myOrders{ id orderNumber status totalAmount createdAt items{ id productId productName productImage quantity price } } }` }),
        });
        const json = await res.json();
        if (json.data?.myOrders) setOrders(json.data.myOrders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    socket.emit('join', `user:${user.id}`);
    const onStatus = (payload: { id: string; status: string }) => {
      setOrders((prev) => prev.map((o) => (String(o.id) === String(payload.id) ? { ...o, status: payload.status } : o)));
    };
    const onCreated = (payload: any) => {
      setOrders((prev) => [{
        id: payload.id,
        orderNumber: payload.orderNumber,
        status: payload.status,
        totalAmount: payload.totalAmount,
        items: [],
        createdAt: payload.createdAt,
      }, ...prev]);
    };
    socket.on('order_status_updated', onStatus);
    socket.on('order_created', onCreated);
    return () => {
      socket.off('order_status_updated', onStatus);
      socket.off('order_created', onCreated);
    };
  }, [user]);

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
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
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


