import { Product, ProductConfiguration } from './product';

export interface CartItem {
  id: string; // unique cart item id
  product: Product;
  configuration: ProductConfiguration;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, configuration: ProductConfiguration) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}
