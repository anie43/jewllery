'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, Search, Menu, X, Phone, Mail, MapPin, MessageCircle, Sparkles, Camera, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { CartIcon } from '@/components/ui/CartIcon';

// Sample product data
const products = [
  {
    id: 1,
    name: "Rajwada Kundan Necklace",
    description: "Handcrafted Kundan necklace with Meenakari work, perfect for bridal wear",
    price: 45000,
    originalPrice: 55000,
    category: "Necklaces",
    material: "Kundan",
    occasion: "Bridal",
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.8,
    reviews: 24,
    story: "Inspired by the royal palaces of Rajasthan, this exquisite piece carries the legacy of Maharajas."
  },
  {
    id: 2,
    name: "Peacock Meenakari Earrings",
    description: "Traditional peacock design earrings with intricate Meenakari work",
    price: 12000,
    originalPrice: 15000,
    category: "Earrings",
    material: "Meenakari",
    occasion: "Festive",
    image: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.7,
    reviews: 18,
    story: "The peacock, a symbol of grace and beauty, inspired this timeless design from the courts of Mughal emperors."
  },
  {
    id: 3,
    name: "Maharani Gold Bangles",
    description: "Set of 6 traditional gold bangles with intricate carved patterns",
    price: 85000,
    originalPrice: 95000,
    category: "Bangles",
    material: "Gold",
    occasion: "Bridal",
    image: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.9,
    reviews: 32,
    story: "Worn by queens and princesses, these bangles echo the grandeur of India's golden heritage."
  },
  {
    id: 4,
    name: "Silver Temple Necklace",
    description: "Oxidized silver temple jewelry with goddess motifs",
    price: 8500,
    originalPrice: 12000,
    category: "Necklaces",
    material: "Silver",
    occasion: "Daily Wear",
    image: "https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.6,
    reviews: 15,
    story: "Sacred motifs from ancient temples, bringing divine blessings to everyday wear."
  },
  {
    id: 5,
    name: "Polki Diamond Ring",
    description: "Exquisite Polki diamond ring with rose gold setting",
    price: 35000,
    originalPrice: 42000,
    category: "Rings",
    material: "Gold",
    occasion: "Festive",
    image: "https://images.pexels.com/photos/1721933/pexels-photo-1721933.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.8,
    reviews: 21,
    story: "Polki diamonds, uncut and raw, represent the natural beauty of India's precious stones."
  },
  {
    id: 6,
    name: "Antique Jhumka Earrings",
    description: "Classic antique finish jhumka earrings with pearl drops",
    price: 6500,
    originalPrice: 8500,
    category: "Earrings",
    material: "Silver",
    occasion: "Daily Wear",
    image: "https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.5,
    reviews: 12,
    story: "Jhumkas that have adorned Indian women for centuries, a symbol of femininity and grace."
  }
];

const categories = ["All", "Necklaces", "Earrings", "Bangles", "Rings"];
const materials = ["All", "Gold", "Silver", "Kundan", "Meenakari"];
const occasions = ["All", "Bridal", "Festive", "Daily Wear"];

const customerReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    comment: "Absolutely stunning! The craftsmanship is beyond expectations. I wore this for my wedding and received countless compliments.",
    product: "Rajwada Kundan Necklace",
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-10"
  },
  {
    id: 2,
    name: "Anita Patel",
    rating: 5,
    comment: "Perfect for festivals! The colors are vibrant and the quality is excellent. Highly recommended!",
    product: "Peacock Meenakari Earrings",
    image: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-08"
  },
  {
    id: 3,
    name: "Sushma Reddy",
    rating: 5,
    comment: "These bangles are a treasure! The gold work is intricate and beautiful. Worth every penny.",
    product: "Maharani Gold Bangles",
    image: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-05"
  }
];

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [festiveMode, setFestiveMode] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isVirtualTryOnOpen, setIsVirtualTryOnOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
  const carouselRef = useRef(null);
  
  const { addToCart } = useCart();

  // Jewelry carousel images
  const carouselImages = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Rajwada Kundan Collection",
      subtitle: "Royal Heritage Jewelry"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Meenakari Masterpieces",
      subtitle: "Colorful Traditional Art"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Gold Bangles Collection",
      subtitle: "Timeless Elegance"
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Temple Jewelry",
      subtitle: "Sacred Designs"
    },
    {
      id: 5,
      image: "https://images.pexels.com/photos/1721933/pexels-photo-1721933.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Diamond Collection",
      subtitle: "Sparkling Brilliance"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesMaterial = selectedMaterial === "All" || product.material === selectedMaterial;
    const matchesOccasion = selectedOccasion === "All" || product.occasion === selectedOccasion;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesMaterial && matchesOccasion && matchesPrice && matchesSearch;
  });

  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCurrentCarouselSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(carouselTimer);
  }, []);

  const nextCarouselSlide = () => {
    setCurrentCarouselSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevCarouselSlide = () => {
    setCurrentCarouselSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: Show a toast notification
    alert(`${product.name} added to cart!`);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const openWhatsApp = (message = "Hello! I'm interested in your jewelry collection.") => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter signup logic here
    console.log("Newsletter signup:", newsletterEmail);
    setNewsletterEmail("");
    alert("Thank you for subscribing to our newsletter!");
  };

  const ProductCard = ({ product }) => (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
          />
          <motion.img
            src={product.hoverImage}
            alt={product.name}
            className="w-full h-64 object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="outline"
              className="bg-white/90 hover:bg-white"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-white/90 hover:bg-white"
              onClick={() => {
                setSelectedProduct(product);
                setIsVirtualTryOnOpen(true);
              }}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          {festiveMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 festive-sparkle" />
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-green-600">₹{product.price.toLocaleString()}</span>
            <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          </div>
          <div className="flex gap-2 mb-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => openWhatsApp(`Hi! I'm interested in ${product.name}. Can you provide more details?`)}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 italic">{product.story}</div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FilterSidebar = ({ isOpen, onClose }) => (
    <div className={`bg-white border-r h-full ${isOpen ? 'block' : 'hidden'} lg:block`}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between lg:justify-center">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Material</label>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {materials.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Occasion</label>
            <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {occasions.map(occasion => (
                  <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={100000}
              min={0}
              step={1000}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="festive-mode"
              checked={festiveMode}
              onCheckedChange={setFestiveMode}
            />
            <Label htmlFor="festive-mode" className="text-sm font-medium text-gray-700">
              Festive Mode
            </Label>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setSelectedCategory("All");
            setSelectedMaterial("All");
            setSelectedOccasion("All");
            setPriceRange([0, 100000]);
            setSearchTerm("");
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${festiveMode ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 festive-mode' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}>
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-orange-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <FilterSidebar isOpen={true} onClose={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
              
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">अ</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  अलंकारिका
                </span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors">About अलंकारिका</Link>
              <Link href="/collections" className="text-gray-700 hover:text-orange-600 transition-colors">Collections</Link>
              <Link href="/shop" className="text-gray-700 hover:text-orange-600 transition-colors">Shop</Link>
              <Link href="/reviews" className="text-gray-700 hover:text-orange-600 transition-colors">Customer Reviews</Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact Us</Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jewelry..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <CartIcon />
              {festiveMode && (
                <Button
                  variant="outline"
                  size="icon"
                  className="relative overflow-hidden"
                  onClick={() => setFestiveMode(!festiveMode)}
                >
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 animate-pulse" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/80 to-orange-900/80 z-10" />
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={carouselImages[currentSlide].image}
              alt="Hero"
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4 font-playfair"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              अलंकारिका
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Where Tradition Meets Elegance
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                Explore Collection
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-gray-900"
                onClick={() => openWhatsApp("Hello! I'd like to know more about your jewelry collections.")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Jewelry Carousel Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">Featured Collections</h2>
            <p className="text-xl text-gray-600">Discover our most exquisite jewelry pieces</p>
          </motion.div>
          
          <div className="relative">
            <div 
              ref={carouselRef}
              className="overflow-hidden rounded-2xl shadow-2xl"
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentCarouselSlide * 100}%)` }}
              >
                {carouselImages.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0 relative">
                    <div className="relative h-96 md:h-[500px]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                      <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4">
                          <div className="max-w-2xl text-white">
                            <motion.h3 
                              className="text-4xl md:text-5xl font-bold mb-4 font-playfair"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {item.title}
                            </motion.h3>
                            <motion.p 
                              className="text-xl md:text-2xl mb-8"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              {item.subtitle}
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                            >
                              <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                                Explore Collection
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <button
              onClick={prevCarouselSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextCarouselSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCarouselSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentCarouselSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jewels of India - Storytelling Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">Jewels of India</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each piece in our collection tells a story of India's rich cultural heritage, 
              passed down through generations of master craftsmen.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="relative mb-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                  </div>
                </div>
                <p className="text-gray-600 italic">{product.story}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar isOpen={true} onClose={() => {}} />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Our Collection</h2>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from our jewelry family</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerReviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.customerPhoto}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <div className="flex items-center gap-2">
                  <img
                    src={review.image}
                    alt={review.product}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.product}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Try-On Dialog */}
      <Dialog open={isVirtualTryOnOpen} onOpenChange={setIsVirtualTryOnOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Virtual Try-On</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-gray-500">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p>Virtual Try-On feature coming soon!</p>
                  <p className="text-sm">Upload your photo to see how jewelry looks on you</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                Upload Photo
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Want to see this jewelry in person? 
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-amber-600"
                  onClick={() => openWhatsApp(`Hi! I'd like to try ${selectedProduct?.name}. Can we schedule a visit?`)}
                >
                  Schedule a visit
                </Button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg"
          onClick={() => openWhatsApp()}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">अलंकारिका</h3>
              <p className="text-gray-400 mb-4">Where Tradition Meets Elegance</p>
              <div className="flex gap-4">
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
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About अलंकारिका</Link></li>
                <li><Link href="/collections" className="hover:text-white transition-colors">Collections</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
                <li><Link href="/reviews" className="hover:text-white transition-colors">Customer Reviews</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to get updates on new collections and festive offers</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600">
                  Subscribe
                </Button>
              </form>
              <div className="mt-4 space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@alankaarika.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="text-center text-gray-400">
            <p>&copy; 2025 अलंकारिका. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}