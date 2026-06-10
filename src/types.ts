/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Topping {
  id: string;
  name: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
}

export interface RemoveIngredient {
  id: string;
  name: string;
  removed: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  category: string;
  image: string;
  rating: number;
  prepTime: string; // e.g., "15-25 min"
  isBestSeller?: boolean;
  isFeatured?: boolean;
  ingredients: string[]; // for potential removals
  availableToppings: { name: string; price: number; max?: number }[];
}

export interface CartItem {
  cartId: string; // unique ID for this specific cart item with its customization
  product: Product;
  quantity: number;
  addedToppings: Topping[];
  removedIngredients: string[];
  specialInstructions: string;
  customizationSummary: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  isActive: boolean;
  description: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface AddressInfo {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  customer: CustomerInfo;
  deliveryAddress?: AddressInfo; // empty if pickup
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: PaymentMethod;
  changeNeededFor?: number; // only if paymentMethod is 'cash' and prompt is yes
  subtotal: number;
  deliveryFee: number;
  couponApplied?: Coupon;
  discount: number;
  total: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'canceled';
}

export interface RestaurantConfig {
  name: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  freeShippingThresh?: number; // free shipping after R$ X
  isOpen: boolean;
  whatsappNumber: string; // e.g., "5511999999999"
}
