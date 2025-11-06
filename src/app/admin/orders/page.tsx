'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socketClient';

type Status = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function AdminOrdersPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
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
  }, [isAdmin, router]);

  useEffect(() => {
    const socket = getSocket();
    const onStatus = (payload: { id: string; status: string }) => {
      setOrders((prev) => prev.map((o) => (String(o.id) === String(payload.id) ? { ...o, status: payload.status } : o)));
    };
    socket.on('order_status_updated', onStatus);
    return () => {
      socket.off('order_status_updated', onStatus);
    };
  }, []);

  const updateStatus = async (orderId: string | null , status: Status) => {
    setUpdatingId(orderId);
    try {
        const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `mutation($id:ID!,$s:String!){ updateOrderStatus(orderId:$id,status:$s){ id status } }`, variables: { id: String(orderId), s: status } }),
      });
      const json = await res.json();
      if (!json.errors) setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order Management</h1>
      {loading ? (
        <div>Loading...</div>
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

 