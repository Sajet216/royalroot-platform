export type Product = {
  id: string;
  created_at: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dimensions: string;
  images: string[];
  is_available: boolean;
};

export type Order = {
  id: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: any;
  contact_email: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
};

export type JournalEntry = {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  image: string;
  is_featured: boolean;
  published_at: string;
};
