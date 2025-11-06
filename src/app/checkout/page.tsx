'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setCartItems, clearCart } from '@/redux/features/cart/cartSlice';
import { addOrder } from '@/redux/features/orders/orderSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingPhone: '',
    paymentMethod: 'COD',
    notes: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        dispatch(setCartItems(data.items));
        
        if (data.items.length === 0) {
          router.push('/cart');
        }
      }
    } catch (error) {
      toast.error('Failed to load cart');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shippingAddress || !formData.shippingCity || !formData.shippingState || !formData.shippingZipCode || !formData.shippingPhone) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(addOrder(data.order));
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        router.push(`/orders?orderId=${data.order.id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <Navbar showLogo={true} />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-semibold">Shipping Information</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.shippingCity}
                          onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.shippingState}
                          onChange={(e) => setFormData({ ...formData, shippingState: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">Zip Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.shippingZipCode}
                          onChange={(e) => setFormData({ ...formData, shippingZipCode: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={formData.shippingPhone}
                          onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-semibold">Payment Method</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={formData.paymentMethod === 'COD'}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="mr-2"
                        />
                        Cash on Delivery (COD)
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-semibold">Additional Notes</h2>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any special instructions..."
                      rows={4}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="p-6 sticky top-32">
                  <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-6">
                    {cartItems.map((item) => {
                      const finalPrice = item.discount
                        ? item.price - (item.price * item.discount / 100)
                        : item.price;
                      return (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span>{item.productName} x {item.quantity}</span>
                          <span>₹{(finalPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}



