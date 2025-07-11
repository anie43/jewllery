'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Banknote, Shield, Truck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { processPayment, createRazorpayOrder } from '@/lib/razorpay';

interface CheckoutFormProps {
  cartItems: any[];
  total: number;
  onBack: () => void;
  onSuccess: () => void;
}

export default function CheckoutForm({ cartItems, total, onBack, onSuccess }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    specialInstructions: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        await handleCODOrder();
      } else {
        // Handle Online Payment
        await handleOnlinePayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    // Simulate order creation for COD
    console.log('COD Order:', { formData, cartItems, total });
    
    // Here you would typically save the order to your database
    // For now, we'll just show a success message
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const handleOnlinePayment = async () => {
    try {
      // Create Razorpay order
      const orderData = await createRazorpayOrder(total);
      
      // Process payment
      await processPayment(orderData, {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      });
      
      onSuccess();
    } catch (error) {
      console.error('Online payment error:', error);
      throw error;
    }
  };

  const deliveryCharge = total > 50000 ? 0 : 500;
  const finalTotal = total + deliveryCharge;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                      <Textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        placeholder="Any special delivery instructions..."
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Payment Method</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                            <CreditCard className="w-5 h-5" />
                            Online Payment
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                            <Banknote className="w-5 h-5" />
                            Cash on Delivery
                          </Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === 'online' && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">Accepted Payment Methods:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">UPI</Badge>
                            <Badge variant="secondary">Credit Cards</Badge>
                            <Badge variant="secondary">Debit Cards</Badge>
                            <Badge variant="secondary">Net Banking</Badge>
                            <Badge variant="secondary">Wallets</Badge>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'cod' && (
                        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-5 h-5 text-orange-600" />
                            <span className="font-medium">Cash on Delivery</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Pay when your order is delivered. Additional charges may apply.
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Secure Checkout</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}