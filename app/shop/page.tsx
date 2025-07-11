'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { CartIcon } from '@/components/ui/CartIcon';

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
    rating: 4.8,
    reviews: 24,
    inStock: true
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
    rating: 4.7,
    reviews: 18,
    inStock: true
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
    rating: 4.9,
    reviews: 32,
    inStock: true
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
    rating: 4.6,
    reviews: 15,
    inStock: false
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
    rating: 4.8,
    reviews: 21,
    inStock: true
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
    rating: 4.5,
    reviews: 12,
    inStock: true
  }
];

const categories = ["All", "Necklaces", "Earrings", "Bangles", "Rings"];
const materials = ["All", "Gold", "Silver", "Kundan", "Meenakari"];
const occasions = ["All", "Bridal", "Festive", "Daily Wear"];

export default function ShopPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesMaterial = selectedMaterial === 'All' || product.material === selectedMaterial;
    const matchesOccasion = selectedOccasion === 'All' || product.occasion === selectedOccasion;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesMaterial && matchesOccasion && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
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
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Material</Label>
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
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Occasion</Label>
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
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={100000}
          min={0}
          step={1000}
          className="w-full"
        />
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setSelectedCategory('All');
          setSelectedMaterial('All');
          setSelectedOccasion('All');
          setPriceRange([0, 100000]);
          setSearchTerm('');
        }}
      >
        Clear Filters
      </Button>
    </div>
  );

  const ProductCard = ({ product }) => (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="outline" className="bg-white/90 hover:bg-white">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" className="bg-white/90 hover:bg-white">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
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
          <Button 
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            disabled={!product.inStock}
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

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
              <Link href="/shop" className="text-orange-600 font-semibold">Shop</Link>
              <Link href="/reviews" className="text-gray-700 hover:text-orange-600 transition-colors">Customer Reviews</Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact Us</Link>
            </nav>
            <CartIcon />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
              <FilterSidebar />
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search jewelry..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <div className="py-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <p className="text-gray-600">
                    {sortedProducts.length} products found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedMaterial('All');
                    setSelectedOccasion('All');
                    setPriceRange([0, 100000]);
                    setSearchTerm('');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}