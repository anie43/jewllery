'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Package, Users, DollarSign, TrendingUp, Search, Filter, Download, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

// Sample data for admin dashboard
const dashboardStats = {
  totalProducts: 156,
  totalOrders: 2847,
  totalRevenue: 1250000,
  monthlyGrowth: 12.5
};

const recentOrders = [
  { id: 'ORD-001', customer: 'Priya Sharma', product: 'Rajwada Kundan Necklace', amount: 45000, status: 'Completed', date: '2025-01-15' },
  { id: 'ORD-002', customer: 'Anita Patel', product: 'Peacock Meenakari Earrings', amount: 12000, status: 'Processing', date: '2025-01-14' },
  { id: 'ORD-003', customer: 'Sushma Reddy', product: 'Maharani Gold Bangles', amount: 85000, status: 'Shipped', date: '2025-01-13' },
  { id: 'ORD-004', customer: 'Kavita Singh', product: 'Silver Temple Necklace', amount: 8500, status: 'Pending', date: '2025-01-12' },
  { id: 'ORD-005', customer: 'Meera Jain', product: 'Polki Diamond Ring', amount: 35000, status: 'Completed', date: '2025-01-11' }
];

const sampleProducts = [
  {
    id: 1,
    name: "Rajwada Kundan Necklace",
    category: "Necklaces",
    material: "Kundan",
    price: 45000,
    stock: 12,
    status: "Active",
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=200",
    rating: 4.8,
    reviews: 24
  },
  {
    id: 2,
    name: "Peacock Meenakari Earrings",
    category: "Earrings",
    material: "Meenakari",
    price: 12000,
    stock: 25,
    status: "Active",
    image: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=200",
    rating: 4.7,
    reviews: 18
  },
  {
    id: 3,
    name: "Maharani Gold Bangles",
    category: "Bangles",
    material: "Gold",
    price: 85000,
    stock: 8,
    status: "Active",
    image: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=200",
    rating: 4.9,
    reviews: 32
  },
  {
    id: 4,
    name: "Silver Temple Necklace",
    category: "Necklaces",
    material: "Silver",
    price: 8500,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=200",
    rating: 4.6,
    reviews: 15
  }
];

const customerReviews = [
  {
    id: 1,
    customer: "Priya Sharma",
    product: "Rajwada Kundan Necklace",
    rating: 5,
    comment: "Absolutely beautiful! The craftsmanship is excellent and it arrived well-packaged.",
    date: "2025-01-10",
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=100",
    approved: true
  },
  {
    id: 2,
    customer: "Anita Patel",
    product: "Peacock Meenakari Earrings",
    rating: 4,
    comment: "Good quality but delivery was slightly delayed. Overall satisfied with the purchase.",
    date: "2025-01-08",
    image: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=100",
    approved: false
  }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [festiveMode, setFestiveMode] = useState(false);

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-amber-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +{trend}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  const ProductForm = ({ product, onClose }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" defaultValue={product?.name || ''} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select defaultValue={product?.category || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Necklaces">Necklaces</SelectItem>
              <SelectItem value="Earrings">Earrings</SelectItem>
              <SelectItem value="Bangles">Bangles</SelectItem>
              <SelectItem value="Rings">Rings</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="material">Material</Label>
          <Select defaultValue={product?.material || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
              <SelectItem value="Kundan">Kundan</SelectItem>
              <SelectItem value="Meenakari">Meenakari</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" type="number" defaultValue={product?.price || ''} />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Product description..." />
      </div>
      <div>
        <Label htmlFor="stock">Stock Quantity</Label>
        <Input id="stock" type="number" defaultValue={product?.stock || ''} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
          {product ? 'Update' : 'Add'} Product
        </Button>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your अलंकारिका jewelry store</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="festive-mode">Festive Mode</Label>
                <Switch
                  id="festive-mode"
                  checked={festiveMode}
                  onCheckedChange={setFestiveMode}
                />
              </div>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Products"
                value={dashboardStats.totalProducts}
                icon={Package}
              />
              <StatCard
                title="Total Orders"
                value={dashboardStats.totalOrders.toLocaleString()}
                icon={Users}
              />
              <StatCard
                title="Total Revenue"
                value={`₹${dashboardStats.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
                trend={dashboardStats.monthlyGrowth}
              />
              <StatCard
                title="Monthly Growth"
                value={`${dashboardStats.monthlyGrowth}%`}
                icon={TrendingUp}
                trend={dashboardStats.monthlyGrowth}
              />
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{order.customer}</div>
                        <div className="text-sm text-gray-600">{order.product}</div>
                        <div className="text-sm text-gray-500">{order.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">₹{order.amount.toLocaleString()}</div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <ProductForm onClose={() => setIsProductDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.material}</TableCell>
                        <TableCell className="font-semibold">₹{product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                            {product.stock > 0 ? product.stock : 'Out of Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                            <span className="text-gray-500">({product.reviews})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Orders
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell className="font-semibold">₹{order.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter Reviews
              </Button>
            </div>

            <div className="space-y-4">
              {customerReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.image}
                        alt={review.product}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{review.customer}</h3>
                            <p className="text-sm text-gray-600">{review.product}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={review.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {review.approved ? 'Approved' : 'Pending'}
                          </Badge>
                          {!review.approved && (
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder - Sales data visualization</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Necklaces</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-3/4 h-2 bg-amber-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Earrings</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-3/5 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bangles</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-2/5 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">40%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rings</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/4 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}