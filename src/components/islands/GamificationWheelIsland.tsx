'use client';

import React, { useState } from 'react';

export function GamificationWheelIsland() {
  const [isOpen, setIsOpen] = useState(false);
  const [discountClaimed, setDiscountClaimed] = useState(false);

  return (
    <>
      {/* 悬浮轻量徽标 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-yellow-400 to-temu-orange text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-110 transition-transform active:scale-95 animate-bounce"
        aria-label="Claim Mystery Coupon"
      >
        <span className="text-2xl">🎁</span>
        <span className="font-extrabold text-xs pr-1 hidden sm:inline">CLAIM $100 COUPON</span>
      </button>

      {/* 模态框 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-yellow-400 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="text-2xl font-black text-temu-darkOrange mb-1">
              EXCLUSIVE REWARD!
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              You qualify for an instant factory rebate on your first order.
            </p>

            {discountClaimed ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-800 font-bold mb-4">
                ✓ CODE: <span className="font-mono text-lg text-emerald-900">EDGE2026</span> ACTIVATED
                <div className="text-xs font-normal text-emerald-600 mt-1">20% extra discount applied at checkout</div>
              </div>
            ) : (
              <button
                onClick={() => setDiscountClaimed(true)}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-temu-orange text-white font-black rounded-full text-base shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                SPIN TO CLAIM REWARD
              </button>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-400 underline hover:text-gray-600"
            >
              Continue shopping without coupon
            </button>
          </div>
        </div>
      )}
    </>
  );
}
