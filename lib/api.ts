import { Product, Bid } from './supabaseClient';

// API base URL
const API_BASE = '/api';

// Generic API call helper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Product API functions
export const productAPI = {
  // Get all products with optional filters
  getAll: (filters?: {
    category?: string;
    is_coupon?: boolean;
    mess_name?: string;
    meal_type?: string;
    location?: string;
    is_sold?: boolean;
    search?: string;
  }): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    return apiCall<Product[]>(`/products${queryString ? `?${queryString}` : ''}`);
  },

  // Create a new product
  create: (product: Omit<Product, 'id' | 'whatsapp_link' | 'created_at' | 'is_sold'>): Promise<Product> => {
    return apiCall<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  // Mark product as sold/unsold
  toggleSold: (id: string, isSold: boolean): Promise<Product> => {
    return apiCall<Product>(`/products/${id}/sold`, {
      method: 'POST',
      body: JSON.stringify({ is_sold: isSold }),
    });
  },
};

// Bid API functions
export const bidAPI = {
  // Get bids for a specific product
  getForProduct: (productId: string): Promise<Bid[]> => {
    return apiCall<Bid[]>(`/bids?product_id=${productId}`);
  },

  // Submit a new bid
  create: (bid: Omit<Bid, 'id' | 'created_at'>): Promise<Bid> => {
    return apiCall<Bid>('/bids', {
      method: 'POST',
      body: JSON.stringify(bid),
    });
  },
};

// WhatsApp helper
export const generateWhatsAppLink = (phone: string, productName: string): string => {
  const message = `Hey I'm contacting you to talk about your ${productName}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

// Format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}; 