'use client';

import React, { useState } from 'react';

interface AddToCartProps {
  skuId: string;
  promotionalPriceCents: number;
  currency: string;
  stockCount: number;
}

export function AddToCartIsland({
  skuId,
  promotionalPriceCents,
  currency,
  stockCount,
}: AddToCartProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const totalPriceCents = quantity * promotionalPriceCents;
  const formattedTotal = (totalPriceCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency,
  });

  const handleAddToCart = () => {
    setIsAdding(true);
    // 模拟通过 Cloudflare Worker 安全代理向核心交易服务发起 RPC 写入
    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="space-y-4 bg-orange-50/60 p-4 rounded-xl border border-orange-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Quantity</span>
        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1 font-mono font-bold text-gray-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Stock Availability:</span>
        <span className="font-semibold text-emerald-700">{stockCount} items left</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-orange-200">
        <span className="text-sm font-medium text-gray-600">Subtotal:</span>
        <span className="text-2xl font-black text-temu-darkOrange font-mono">{formattedTotal}</span>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full py-3.5 px-6 rounded-full font-extrabold text-white text-base shadow-lg transition-all duration-200 transform active:scale-95 ${
          addedSuccess
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : 'bg-temu-orange hover:bg-temu-darkOrange'
        }`}
      >
        {isAdding ? 'Adding to Cart...' : addedSuccess ? '✓ Added to Cart!' : '⚡ ADD TO CART'}
      </button>

      <p className="text-xs text-center text-gray-500">
        🔒 Encrypted 256-bit checkout • Free shipping & 90-day returns
      </p>
    </div>
  );
}
