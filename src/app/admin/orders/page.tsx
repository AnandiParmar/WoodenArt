'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import socket from '@/Sokcet';
import Cookies from 'js-cookie';

type Status = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function AdminOrdersPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading before checking admin status
    if (authLoading) {
      return;
    }

    // Check if user is admin - check both from context and cookies/localStorage as fallback
    const isAuthenticated = Cookies.get('isAuthenticated') === 'true' || localStorage.getItem('isAuthenticated') === 'true';
    const role = Cookies.get('role') || localStorage.getItem('role');
    const isUserAdmin = isAdmin || (user?.role === 'ADMIN') || (isAuthenticated && role === 'ADMIN');

    if (!isUserAdmin) {
      router.push('/');
      return;
    }

    const fetchOrders = async () => {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `query{ allOrders{ id orderNumber status totalAmount createdAt } }` }),
      });
      const json = await res.json();
      setOrders(json.data?.allOrders || []);
      setLoading(false);
    };
    fetchOrders();
    
    // Handle new order placement via socket
    const handleOrderPlaced = (data: any) => {
      console.log('New order placed:', data);
      // Ensure createdAt is present, use current time as fallback
      const newOrder = {
        ...data,
        createdAt: data.createdAt || new Date().toISOString()
      };
      setOrders((prev) => {
        // Check if order already exists to avoid duplicates
        const exists = prev.some((o) => o.id === newOrder.id);
        if (exists) return prev;
        return [...prev, newOrder];
      });
    };
    
    // Handle order status updates via socket
    const handleOrderStatusUpdate = (data: any) => {
      setOrders((prev) => prev.map((o) => (o.id === data.orderId ? { ...o, status: data.status } : o)));
    };
    
    // Set up socket listeners
    socket.on('orderPlaced', handleOrderPlaced);
    socket.on('orderStatusUpdated', handleOrderStatusUpdate);
    
    // Cleanup: remove all socket listeners
    return () => {
      socket.off('orderPlaced', handleOrderPlaced);
      socket.off('orderStatusUpdated', handleOrderStatusUpdate);
    };
  }, [isAdmin, user, authLoading, router]);

  const updateStatus = async (orderId: string | null , status: Status) => {
    setUpdatingId(orderId);
    try {
        const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation($id:ID!,$s:String!){ updateOrderStatus(orderId:$id,status:$s){ id status } }`, variables: { id: String(orderId), s: status } }),
      });
      const json = await res.json();
      
      socket.emit('orderStatusUpdated', { orderId, status });
      // console.log('Order status updated:', { orderId, status });
      if (!json.errors) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  // Don't render if not admin (redirect is happening)
  if (!isAdmin && (!user || user.role !== 'ADMIN')) {
    const isAuthenticated = Cookies.get('isAuthenticated') === 'true' || localStorage.getItem('isAuthenticated') === 'true';
    const role = Cookies.get('role') || localStorage.getItem('role');
    if (!(isAuthenticated && role === 'ADMIN')) {
      return null;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order Management</h1>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs">{o.status}</span>
                  </td>
                  <td className="px-4 py-3">₹{o.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      className="border rounded-md px-2 py-1 text-sm"
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value as Status)}
                      disabled={updatingId === o.id}
                    >
                      {['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

 