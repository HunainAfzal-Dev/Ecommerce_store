// ===== TypeScript Interfaces =====

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at?: string;
  categories?: Category;
}

export interface CartItem {
  id: string;
  quantity: number;
  product_id?: string;
  products: Product;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: Pick<Product, 'id' | 'name' | 'image_url'>;
}

export interface TrackingStep {
  key: string;
  label: string;
  state?: 'complete' | 'current' | 'upcoming';
}

export interface Order {
  id: string;
  total_amount: number;
  shipping_address: string;
  city: string;
  phone: string;
  status: string;
  tracking_code?: string | null;
  status_label?: string;
  estimated_delivery_days?: number | null;
  estimated_delivery_date?: string | null;
  timeline?: TrackingStep[];
  payment_method?: string;
  created_at?: string;
  order_items?: OrderItem[];
  users?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface PublicTrackedOrder {
  tracking_code: string;
  status: string;
  status_label: string;
  estimated_delivery_days: number | null;
  estimated_delivery_date: string | null;
  timeline: TrackingStep[];
  payment_method: string;
  total_amount: number;
  shipping_address: string;
  city: string;
  phone: string;
  created_at?: string;
  order_items?: OrderItem[];
}

// ===== API Response Types =====

export interface ApiResponse<T> {
  status: string;
  message?: string;
  count?: number;
  data: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UsersResponse {
  users: User[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CartResponse {
  cart_items: CartItem[];
}

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}

