export interface Category {
  id: number;
  name: string;
  image?: string;
}

export interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
  image?: string;
}

export interface Product {
  id: number;
  subcategoryId: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  product: Product;
}

export interface Order {
  items: OrderItem[];
  customerId?: number;
  customer?: Customer;
  total: number;
  estimatedPickupTime?: Date;
  customerName?: string;
}
