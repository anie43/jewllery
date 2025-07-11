'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function PaymentSuccess() {
  useEffect(() => {
    // Confetti animation or celebration effect can be added here
    console.log('Payment successful!');
  }, []);

  const openWhatsApp = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
    const message = encodeURIComponent("Hi! I just completed my payment. Can you provide me with the order tracking details?");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600">
              Thank you for your purchase from अलंकारिका
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">ALN-2025-001</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold">Online Payment</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="font-semibold text-green-600">₹45,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Order Confirmation</h3>
                      <p className="text-sm text-gray-600">You'll receive an email confirmation shortly with your order details.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Processing & Crafting</h3>
                      <p className="text-sm text-gray-600">Our artisans will carefully prepare your jewelry. This may take 2-3 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Shipping & Delivery</h3>
                      <p className="text-sm text-gray-600">Your order will be shipped with tracking information. Delivery within 5-7 business days.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Button
              onClick={openWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Track via WhatsApp
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-8 p-6 bg-amber-50 rounded-lg"
          >
            <h3 className="font-semibold text-amber-800 mb-2">Share Your Experience!</h3>
            <p className="text-sm text-amber-700 mb-4">
              We'd love to see how our jewelry looks on you. Share your photos with us on social media and get featured on our website!
            </p>
            <div className="flex justify-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <span className="text-white text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors">
                <span className="text-white text-sm">i</span>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                <span className="text-white text-sm">p</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}