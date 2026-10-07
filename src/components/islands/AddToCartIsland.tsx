'use client';

import React, { useState } from 'react';
import { addToCart } from '@/lib/cart-store';

export interface SkuVariantProp {
  skuId: string;
  name: string;
  priceCents: number;
  originalPriceCents: number;
  stock: number;
}

interface AddToCartProps {
  spuId: string;
  skuId: string;
  title: string;
  promotionalPriceCents: number;
  currency: string;
  stockCount: number;
  heroImageBaseName: string;
  skuVariants?: readonly SkuVariantProp[];
}

export function AddToCartIsland({
  spuId,
  skuId,
  title,
  promotionalPriceCents,
  currency,
  stockCount,
  heroImageBaseName,
  skuVariants,
}: AddToCartProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const activeVariant = skuVariants && skuVariants.length > 0 ? skuVariants[selectedVariantIdx] : null;
  const currentPriceCents = activeVariant ? activeVariant.priceCents : promotionalPriceCents;
  const currentSkuId = activeVariant ? activeVariant.skuId : skuId;
  const currentStock = activeVariant ? activeVariant.stock : stockCount;
  const currentTitle = activeVariant ? `${title} (${activeVariant.name})` : title;

  const totalPriceCents = quantity * currentPriceCents;
  const formattedTotal = (totalPriceCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency,
  });

  const handleAddToCart = () => {
    setIsAdding(true);
    // 写入客户端购物车并联动开启抽屉
    setTimeout(() => {
      addToCart(
        {
          spuId,
          skuId: currentSkuId,
          title: currentTitle,
          promotionalPriceCents: currentPriceCents,
          currency,
          heroImageBaseName,
        },
        quantity
      );
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }, 250);
  };

  return (
    <div className="space-y-4 bg-orange-50/60 p-4 rounded-xl border border-orange-200">
      {/* 多 SKU 变体选择器 */}
      {skuVariants && skuVariants.length > 0 && (
        <div className="space-y-2 pb-3 border-b border-orange-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800">
              Select Variant / SKU ({skuVariants.length} Options):
            </span>
            <span className="font-mono text-temu-darkOrange font-bold">
              ${(currentPriceCents / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white/70 rounded-lg border border-orange-100">
            {skuVariants.map((v, i) => (
              <button
                key={v.skuId}
                type="button"
                onClick={() => setSelectedVariantIdx(i)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all border text-left cursor-pointer ${
                  selectedVariantIdx === i
                    ? 'bg-temu-dark text-white border-temu-dark shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                <span>{v.name}</span>
                <span className="ml-1 opacity-80 font-mono text-[11px]">
                  ${(v.priceCents / 100).toFixed(2)}
                </span>
              </button>
            ))}
          </div>
          <div className="text-[11px] text-gray-500 font-mono">
            Active SKU: <span className="font-bold text-gray-800">{currentSkuId}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Quantity</span>
        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors cursor-pointer"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1 font-mono font-bold text-gray-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Stock Availability:</span>
        <span className="font-semibold text-emerald-700">{currentStock} items left</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-orange-200">
        <span className="text-sm font-medium text-gray-600">Subtotal:</span>
        <span className="text-2xl font-black text-temu-darkOrange font-mono">{formattedTotal}</span>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full py-3.5 px-6 rounded-full font-extrabold text-white text-base shadow-lg transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
          addedSuccess
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : 'bg-temu-orange hover:bg-temu-darkOrange'
        }`}
      >
        <span>🛒</span>
        <span>
          {isAdding
            ? 'Adding to Cart...'
            : addedSuccess
            ? '✓ Added to Cart! (Drawer Opened)'
            : '⚡ ADD TO CART'}
        </span>
      </button>

      {/* 快捷查看购物车与支付 API 接口 */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('temu-cart-toggle', { detail: { open: true } }));
            }
          }}
          className="py-2 px-3 rounded-lg font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 text-xs transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
        >
          <span>🛒</span>
          <span>Open Cart</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('temu-checkout-toggle', { detail: { open: true } }));
            }
          }}
          className="py-2 px-3 rounded-lg font-bold text-temu-darkOrange bg-orange-100 hover:bg-orange-200 text-xs transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
        >
          <span>💳</span>
          <span>Payment API</span>
        </button>
      </div>

      <p className="text-xs text-center text-gray-500">
        🔒 Encrypted 256-bit checkout • Free shipping & 90-day returns
      </p>
    </div>
  );
}
