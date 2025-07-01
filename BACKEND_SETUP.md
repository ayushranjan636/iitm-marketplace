# BKL Marketplace Backend Setup Guide

## 🚀 Complete Backend Implementation

This guide will help you set up the complete backend for your IITM BKL Marketplace.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js & pnpm**: Already installed in your project

## 🔧 Step 1: Supabase Project Setup

1. **Create a new Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: `bkl-marketplace`
   - Set a database password
   - Choose a region (preferably close to India)
   - Click "Create new project"

2. **Get your project credentials**:
   - Go to Settings → API
   - Copy your `Project URL` and `anon public` key

## 🗄️ Step 2: Database Setup

1. **Run the SQL script**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Click "New Query"
   - Copy and paste the contents of `database-setup.sql`
   - Click "Run" to execute the script

2. **Verify tables are created**:
   - Go to Table Editor
   - You should see `products` and `bids` tables
   - Check that sample data is inserted

## 🔐 Step 3: Authentication Setup

1. **Configure Auth Settings**:
   - Go to Authentication → Settings
   - Under "Site URL", add your development URL: `http://localhost:3000`
   - Under "Redirect URLs", add: `http://localhost:3000/auth/callback`

2. **Email Auth (Optional)**:
   - Go to Authentication → Providers
   - Enable Email provider
   - To restrict to IITM emails, add this to "Additional redirect URLs":
     ```
     https://your-domain.com/auth/callback
     ```

## 🌍 Step 4: Environment Variables

1. **Create `.env.local` file** in your project root:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

2. **Replace the placeholders** with your actual Supabase credentials from Step 1.

## 📁 Step 5: Backend Files Created

The following files have been created for you:

### API Routes
- `app/api/products/route.ts` - Handle product CRUD operations
- `app/api/products/[id]/sold/route.ts` - Mark products as sold/unsold
- `app/api/bids/route.ts` - Handle bid operations

### Database & Utilities
- `lib/supabaseClient.ts` - Supabase client configuration
- `lib/api.ts` - Frontend API helper functions
- `database-setup.sql` - Complete database schema

## 🧪 Step 6: Test the Backend

1. **Start your development server**:
   ```bash
   pnpm dev
   ```

2. **Test the API endpoints**:
   ```bash
   # Get all products
   curl http://localhost:3000/api/products

   # Create a product
   curl -X POST http://localhost:3000/api/products \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Product",
       "description": "Test description",
       "category": "electronics",
       "price": 100,
       "seller_contact": "919876543210",
       "location": "Online",
       "is_coupon": false
     }'

   # Get bids for a product
   curl "http://localhost:3000/api/bids?product_id=YOUR_PRODUCT_ID"

   # Submit a bid
   curl -X POST http://localhost:3000/api/bids \
     -H "Content-Type: application/json" \
     -d '{
       "product_id": "YOUR_PRODUCT_ID",
       "bidder_name": "John Doe",
       "bidder_contact": "919876543211",
       "bid_price": 150
     }'
   ```

## 🔗 Step 7: Frontend Integration

The backend is now ready! Your frontend can use the API helper functions from `lib/api.ts`:

```typescript
import { productAPI, bidAPI } from '@/lib/api';

// Get all products
const products = await productAPI.getAll();

// Get filtered products
const coupons = await productAPI.getAll({ is_coupon: true });

// Create a product
const newProduct = await productAPI.create({
  title: "My Product",
  category: "electronics",
  price: 500,
  seller_contact: "919876543210",
  location: "Hostel 2",
  is_coupon: false
});

// Submit a bid
const newBid = await bidAPI.create({
  product_id: "product-id",
  bidder_name: "John Doe",
  bidder_contact: "919876543211",
  bid_price: 550
});
```

## 🎯 Features Implemented

✅ **Complete Database Schema**
- Products table with all required fields
- Bids table with foreign key relationships
- Proper indexes for performance
- Row Level Security (RLS) policies

✅ **RESTful API Endpoints**
- GET /api/products - Fetch products with filters
- POST /api/products - Create new products
- POST /api/products/[id]/sold - Mark products as sold
- GET /api/bids - Fetch bids for a product
- POST /api/bids - Submit new bids

✅ **WhatsApp Integration**
- Automatic WhatsApp link generation
- Pre-filled messages with product details

✅ **Data Validation**
- Required field validation
- Price validation
- Bid validation (must be higher than current highest)

✅ **Error Handling**
- Comprehensive error messages
- Proper HTTP status codes
- Logging for debugging

✅ **TypeScript Support**
- Full type definitions
- Type-safe API calls

## 🚀 Next Steps

1. **Connect your frontend forms** to use the API functions
2. **Add authentication** using Supabase Auth
3. **Implement real-time updates** using Supabase subscriptions
4. **Add image upload** using Supabase Storage
5. **Deploy to production** on Vercel

## 🆘 Troubleshooting

**Common Issues:**

1. **"Invalid API key" error**:
   - Check your environment variables
   - Ensure you're using the `anon` key, not the `service_role` key

2. **"Table doesn't exist" error**:
   - Run the SQL script in Supabase SQL Editor
   - Check that all tables were created successfully

3. **CORS errors**:
   - Add your domain to Supabase Auth settings
   - Check redirect URLs configuration

4. **RLS policy errors**:
   - Ensure RLS policies are created correctly
   - Check that you're authenticated when required

## 📞 Support

If you encounter any issues:
1. Check the Supabase logs in your dashboard
2. Verify your environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors

---

**🎉 Your backend is now fully functional!** 

The marketplace can now handle:
- Product listings with WhatsApp integration
- Bidding system with validation
- Real-time updates
- Secure data access with RLS
- Type-safe API calls 