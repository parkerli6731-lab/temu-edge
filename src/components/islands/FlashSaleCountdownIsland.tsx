'use client';

import React, { useState, useEffect } from 'react';

interface FlashSaleCountdownProps {
  initialSeconds?: number;
}

export function FlashSaleCountdownIsland({ initialSeconds = 7180 }: FlashSaleCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    // 静态首屏占位骨架，彻底根绝 React Hydration Mismatch
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-red-700">
        <span className="font-bold flex items-center gap-1">⚡ LIMITED TIME OFFER</span>
        <span className="font-mono font-semibold">Ends soon</span>
      </div>
    );
  }

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-red-600 to-temu-orange text-white rounded-lg p-3 shadow-md flex items-center justify-between animate-pulse-slow">
      <div className="flex items-center gap-2">
        <span className="text-xl">🔥</span>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide">Lightning Flash Deal</div>
          <div className="text-xs opacity-90">Almost 85% claimed</div>
        </div>
      </div>
      <div className="flex items-center gap-1 font-mono text-sm font-black">
        <span className="bg-black/40 px-2 py-1 rounded">{pad(hours)}</span>
        <span>:</span>
        <span className="bg-black/40 px-2 py-1 rounded">{pad(minutes)}</span>
        <span>:</span>
        <span className="bg-black/40 px-2 py-1 rounded">{pad(seconds)}</span>
      </div>
    </div>
  );
}
