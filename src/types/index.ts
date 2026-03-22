
export interface MenuItem {
  id: string;
  name: string;
  ingredients: string;
  prices: {
    t1: number;
    t2?: number;
    t3?: number;
  };
  category: string;
  subCategory?: string;
  image: string;
  popular?: boolean;
  isVeggie?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: 't1' | 't2' | 't3';
  quantity: number;
  customName?: string;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discount: number;
  active: boolean;
  type: 'percentage' | 'fixed';
}

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: CartItem[];
  total: number;
  status: 'new' | 'preparing' | 'delivering' | 'completed';
  timestamp: number;
}

export interface Category {
  id: string;
  label: string;
}
