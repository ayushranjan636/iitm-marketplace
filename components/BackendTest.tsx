'use client';

import { useState } from 'react';
import { productAPI, bidAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BackendTest() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form state for creating products
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    seller_contact: '',
    location: '',
    is_coupon: false,
    mess_name: '',
    meal_type: '',
    quantity: ''
  });

  // Form state for bidding
  const [bidForm, setBidForm] = useState({
    product_id: '',
    bidder_name: '',
    bidder_contact: '',
    bid_price: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAll();
      setProducts(data);
      setMessage(`Fetched ${data.length} products successfully!`);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async () => {
    setLoading(true);
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        quantity: productForm.quantity ? parseInt(productForm.quantity) : undefined,
        is_coupon: productForm.is_coupon
      };

      const newProduct = await productAPI.create(productData);
      setMessage(`Product created successfully! ID: ${newProduct.id}`);
      
      // Reset form
      setProductForm({
        title: '',
        description: '',
        category: '',
        price: '',
        seller_contact: '',
        location: '',
        is_coupon: false,
        mess_name: '',
        meal_type: '',
        quantity: ''
      });
      
      // Refresh products list
      fetchProducts();
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const submitBid = async () => {
    setLoading(true);
    try {
      const bidData = {
        ...bidForm,
        bid_price: parseFloat(bidForm.bid_price)
      };

      const newBid = await bidAPI.create(bidData);
      setMessage(`Bid submitted successfully! ID: ${newBid.id}`);
      
      // Reset form
      setBidForm({
        product_id: '',
        bidder_name: '',
        bidder_contact: '',
        bid_price: ''
      });
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Backend API Test</h1>
      
      {message && (
        <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fetch Products */}
        <Card>
          <CardHeader>
            <CardTitle>Fetch Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchProducts} disabled={loading}>
              {loading ? 'Loading...' : 'Get All Products'}
            </Button>
            {products.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Products ({products.length}):</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product.id} className="p-2 border rounded text-sm">
                      <div className="font-medium">{product.title}</div>
                      <div className="text-gray-600">₹{product.price} - {product.location}</div>
                      <div className="text-xs text-gray-500">ID: {product.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Product */}
        <Card>
          <CardHeader>
            <CardTitle>Create Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={productForm.title}
                onChange={(e) => setProductForm({...productForm, title: e.target.value})}
                placeholder="Product title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="cycles">Cycles</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="coupons">Coupons</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seller_contact">Contact (WhatsApp)</Label>
                <Input
                  id="seller_contact"
                  value={productForm.seller_contact}
                  onChange={(e) => setProductForm({...productForm, seller_contact: e.target.value})}
                  placeholder="919876543210"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={productForm.location} onValueChange={(value) => setProductForm({...productForm, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Hostel 1">Hostel 1</SelectItem>
                    <SelectItem value="Hostel 2">Hostel 2</SelectItem>
                    <SelectItem value="Hostel 3">Hostel 3</SelectItem>
                    <SelectItem value="Hostel 4">Hostel 4</SelectItem>
                    <SelectItem value="Hostel 5">Hostel 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={createProduct} disabled={loading || !productForm.title || !productForm.category || !productForm.price || !productForm.seller_contact || !productForm.location}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </CardContent>
        </Card>

        {/* Submit Bid */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Bid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bid_product_id">Product ID</Label>
              <Input
                id="bid_product_id"
                value={bidForm.product_id}
                onChange={(e) => setBidForm({...bidForm, product_id: e.target.value})}
                placeholder="Enter product ID from above"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bidder_name">Your Name</Label>
                <Input
                  id="bidder_name"
                  value={bidForm.bidder_name}
                  onChange={(e) => setBidForm({...bidForm, bidder_name: e.target.value})}
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="bidder_contact">Your Contact</Label>
                <Input
                  id="bidder_contact"
                  value={bidForm.bidder_contact}
                  onChange={(e) => setBidForm({...bidForm, bidder_contact: e.target.value})}
                  placeholder="919876543210"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bid_price">Bid Amount (₹)</Label>
              <Input
                id="bid_price"
                type="number"
                value={bidForm.bid_price}
                onChange={(e) => setBidForm({...bidForm, bid_price: e.target.value})}
                placeholder="0"
              />
            </div>

            <Button onClick={submitBid} disabled={loading || !bidForm.product_id || !bidForm.bidder_name || !bidForm.bidder_contact || !bidForm.bid_price}>
              {loading ? 'Submitting...' : 'Submit Bid'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 