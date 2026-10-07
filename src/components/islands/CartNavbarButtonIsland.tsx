'use client';

import React, { useState, useEffect } from 'react';
import { getCartItems, openCartDrawer, CART_EVENT, CartItem } from '@/lib/cart-store';

export function CartNavbarButtonIsland() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setMounted(true);
    setItems(getCartItems());

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<CartItem[]>;
      if (custom.detail) {
        setItems(custom.detail);
      } else {
        setItems(getCartItems());
      }
    };

    window.addEventListener(CART_EVENT, handleUpdate);
    return () => window.removeEventListener(CART_EVENT, handleUpdate);
  }, []);

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button
      type="button"
      onClick={openCartDrawer}
      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 px-3 py-1.5 rounded-full transition-all cursor-pointer group"
      aria-label="Open Shopping Cart"
    >
      <span className="text-base group-hover:scale-110 transition-transform">🛒</span>
      <span className="text-xs font-semibold text-gray-200">Cart</span>
      <span className="font-mono bg-temu-orange text-white text-[11px] font-black px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow">
        {mounted ? totalCount : 0}
      </span>
    </button>
  );
}
