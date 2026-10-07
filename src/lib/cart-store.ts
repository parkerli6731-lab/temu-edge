/**
 * Client-Side Cart Store & Event Bus
 * 纯客户端微岛屿购物车状态管理 (通过 CustomEvent + localStorage 同步)
 */

export interface CartItem {
  readonly spuId: string;
  readonly skuId: string;
  readonly title: string;
  readonly promotionalPriceCents: number;
  readonly currency: string;
  readonly heroImageBaseName: string;
  quantity: number;
}

const CART_STORAGE_KEY = 'temu_edge_cart_v1';
const CART_EVENT = 'temu-cart-update';
const CART_TOGGLE_EVENT = 'temu-cart-toggle';
const CHECKOUT_TOGGLE_EVENT = 'temu-checkout-toggle';

export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
  } catch (err) {
    console.error('Failed to save cart:', err);
  }
}

export function addToCart(item: Omit<CartItem, 'quantity'>, qty: number = 1): CartItem[] {
  const current = getCartItems();
  const existingIdx = current.findIndex((i) => i.skuId === item.skuId);

  let updated: CartItem[];
  if (existingIdx >= 0) {
    updated = current.map((ci, idx) =>
      idx === existingIdx ? { ...ci, quantity: ci.quantity + qty } : ci
    );
  } else {
    updated = [...current, { ...item, quantity: qty }];
  }

  saveCartItems(updated);
  openCartDrawer();
  return updated;
}

export function updateCartQuantity(skuId: string, quantity: number): CartItem[] {
  const current = getCartItems();
  const updated = quantity <= 0
    ? current.filter((i) => i.skuId !== skuId)
    : current.map((i) => (i.skuId === skuId ? { ...i, quantity } : i));

  saveCartItems(updated);
  return updated;
}

export function removeCartItem(skuId: string): CartItem[] {
  return updateCartQuantity(skuId, 0);
}

export function openCartDrawer(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_TOGGLE_EVENT, { detail: { open: true } }));
  }
}

export function closeCartDrawer(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_TOGGLE_EVENT, { detail: { open: false } }));
  }
}

export function openCheckoutModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CHECKOUT_TOGGLE_EVENT, { detail: { open: true } }));
  }
}

export function closeCheckoutModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CHECKOUT_TOGGLE_EVENT, { detail: { open: false } }));
  }
}

export { CART_EVENT, CART_TOGGLE_EVENT, CHECKOUT_TOGGLE_EVENT };
