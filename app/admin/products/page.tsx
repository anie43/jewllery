'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Filter, Upload, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { adminDb } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    original_price: '',
    category: '',
    material: '',
    occasion: '',
    stock_quantity: '',
    sku: '',
    weight: '',
    is_featured: false,
    is_active: true,
    seo_title: '',
    seo_description: '',
    tags: []
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadProducts();
  }, []);

  const checkAuthAndLoadProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/admin/login');
      return;
    }

    loadProducts();
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters = {
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined,
        is_active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined
      };

      const { data, error } = await adminDb.getProducts(filters);
      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, categoryFilter, statusFilter]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        stock_quantity: parseInt(formData.stock_quantity),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        images: [], // Will be handled separately
        specifications: {},
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };

      if (selectedProduct) {
        await adminDb.updateProduct(selectedProduct.id, productData);
      } else {
        await adminDb.createProduct(productData);
      }

      setIsProductDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      price: '',
      original_price: '',
      category: '',
      material: '',
      occasion: '',
      stock_quantity: '',
      sku: '',
      weight: '',
      is_featured: false,
      is_active: true,
      seo_title: '',
      seo_description: '',
      tags: []
    });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      category: product.category || '',
      material: product.material || '',
      occasion: product.occasion || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      sku: product.sku || '',
      weight: product.weight?.toString() || '',
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || '',
      tags: product.tags || []
    });
    setIsProductDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminDb.deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const toggleProductStatus = async (product) => {
    try {
      await adminDb.updateProduct(product.id, {
        is_active: !product.is_active
      });
      loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const ProductForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            placeholder="Unique product code"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="short_description">Short Description</Label>
        <Input
          id="short_description"
          value={formData.short_description}
          onChange={(e) => handleInputChange('short_description', e.target.value)}
          placeholder="Brief product description"
        />
      </div>

      <div>
        <Label htmlFor="description">Full Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Detailed product description"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Necklaces">Necklaces</SelectItem>
              <SelectItem value="Earrings">Earrings</SelectItem>
              <SelectItem value="Bangles">Bangles</SelectItem>
              <SelectItem value="Rings">Rings</SelectItem>
              <SelectItem value="Bracelets">Bracelets</SelectItem>
              <SelectItem value="Anklets">Anklets</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="material">Material *</Label>
          <Select value={formData.material} onValueChange={(value) => handleInputChange('material', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
              <SelectItem value="Kundan">Kundan</SelectItem>
              <SelectItem value="Meenakari">Meenakari</SelectItem>
              <SelectItem value="Polki">Polki</SelectItem>
              <SelectItem value="Diamond">Diamond</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="occasion">Occasion *</Label>
          <Select value={formData.occasion} onValueChange={(value) => handleInputChange('occasion', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bridal">Bridal</SelectItem>
              <SelectItem value="Festive">Festive</SelectItem>
              <SelectItem value="Daily Wear">Daily Wear</SelectItem>
              <SelectItem value="Party">Party</SelectItem>
              <SelectItem value="Traditional">Traditional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="original_price">Original Price (₹) *</Label>
          <Input
            id="original_price"
            type="number"
            value={formData.original_price}
            onChange={(e) => handleInputChange('original_price', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="stock_quantity">Stock Quantity *</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="weight">Weight (grams)</Label>
        <Input
          id="weight"
          type="number"
          step="0.01"
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          placeholder="Product weight in grams"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">SEO Settings</h3>
        <div>
          <Label htmlFor="seo_title">SEO Title</Label>
          <Input
            id="seo_title"
            value={formData.seo_title}
            onChange={(e) => handleInputChange('seo_title', e.target.value)}
            placeholder="SEO optimized title"
          />
        </div>
        <div>
          <Label htmlFor="seo_description">SEO Description</Label>
          <Textarea
            id="seo_description"
            value={formData.seo_description}
            onChange={(e) => handleInputChange('seo_description', e.target.value)}
            placeholder="SEO meta description"
          />
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
            />
            <Label htmlFor="is_featured">Featured Product</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-amber-600 to-orange-600">
          <Save className="w-4 h-4 mr-2" />
          {selectedProduct ? 'Update' : 'Create'} Product
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600">Manage your jewelry catalog</p>
            </div>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-amber-600 to-orange-600"
                  onClick={() => {
                    setSelectedProduct(null);
                    resetForm();
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <ProductForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Necklaces">Necklaces</SelectItem>
                  <SelectItem value="Earrings">Earrings</SelectItem>
                  <SelectItem value="Bangles">Bangles</SelectItem>
                  <SelectItem value="Rings">Rings</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.material}</TableCell>
                      <TableCell className="font-semibold">₹{parseFloat(product.price).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={product.stock_quantity > 10 ? 'default' : product.stock_quantity > 0 ? 'secondary' : 'destructive'}>
                          {product.stock_quantity > 0 ? product.stock_quantity : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.is_active}
                            onCheckedChange={() => toggleProductStatus(product)}
                          />
                          <Badge className={product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}