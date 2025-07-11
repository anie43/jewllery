'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Heart, ArrowLeft, ShoppingBag, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import CheckoutForm from '@/components/checkout/CheckoutForm';

// Sample products data (in real app, this would come from context/state management)
const products = [
  {
    id: 1,
    name: "Rajwada Kundan Necklace",
    description: "Handcrafted Kundan necklace with Meenakari work",
    price: 45000,
    originalPrice: 55000,
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Necklaces",
    material: "Kundan"
  },
  {
    id: 2,
    name: "Peacock Meenakari Earrings",
    description: "Traditional peacock design earrings",
    price: 12000,
    originalPrice: 15000,
    image: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Earrings",
    material: "Meenakari"
  },
  {
    id: 3,
    name: "Maharani Gold Bangles",
    description: "Set of 6 traditional gold bangles",
    price: 85000,
    originalPrice: 95000,
    image: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Bangles",
    material: "Gold"
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('alankaarika-cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      // Convert cart IDs to full product objects with quantities
      const cartWithProducts = cartData.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
          ...product,
          quantity: item.quantity || 1
        };
      }).filter(Boolean);
      setCartItems(cartWithProducts);
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    const cartData = cartItems.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));
    localStorage.setItem('alankaarika-cart', JSON.stringify(cartData));
  }, [cartItems]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const applyCoupon = () => {
    const validCoupons = {
      'DIWALI25': { discount: 25, type: 'percentage' },
      'WEDDING15': { discount: 15, type: 'percentage' },
      'FIRST500': { discount: 500, type: 'fixed' }
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        ...validCoupons[couponCode.toUpperCase()]
      });
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  
  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percentage' 
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount;
  }

  const deliveryCharge = subtotal > 50000 ? 0 : 500;
  const total = subtotal - discount + deliveryCharge;

  if (showCheckout) {
    return (
      <CheckoutForm
        cartItems={cartItems}
        total={total}
        onBack={() => setShowCheckout(false)}
        onSuccess={() => {
          setCartItems([]);
          localStorage.removeItem('alankaarika-cart');
          window.location.href = '/payment-success';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-orange-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">अ</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                अलंकारिका
              </span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors">About अलंकारिका</Link>
              <Link href="/collections" className="text-gray-700 hover:text-orange-600 transition-colors">Collections</Link>
              <Link href="/shop" className="text-gray-700 hover:text-orange-600 transition-colors">Shop</Link>
              <Link href="/reviews" className="text-gray-700 hover:text-orange-600 transition-colors">Customer Reviews</Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact Us</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        {cartItems.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Discover our beautiful jewelry collections and add items to your cart.</p>
            <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge variant="outline">{item.material}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-600">₹{item.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                            <Badge className="bg-green-100 text-green-800">
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items):</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>You Save:</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon ({appliedCoupon.code}):</span>
                      <div className="flex items-center gap-2">
                        <span>-₹{discount.toLocaleString()}</span>
                        <Button variant="ghost" size="sm" onClick={removeCoupon}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Coupon Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Apply Coupon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button onClick={applyCoupon} variant="outline">
                      Apply
                    </Button>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p>Available coupons:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>DIWALI25 - 25% off</li>
                      <li>WEDDING15 - 15% off</li>
                      <li>FIRST500 - ₹500 off</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                onClick={() => setShowCheckout(true)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}