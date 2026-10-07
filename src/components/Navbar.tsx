import React from 'react';
import Link from 'next/link';
import { RegionCurrencyIsland } from './islands/RegionCurrencyIsland';
import { CartNavbarButtonIsland } from './islands/CartNavbarButtonIsland';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-temu-dark text-white shadow-md">
      {/* 顶部免邮公告栏 */}
      <div className="bg-temu-darkOrange text-white text-xs py-1.5 px-4 font-semibold text-center flex items-center justify-between">
        <span className="hidden md:inline">🚚 Special Promo: Free Shipping On All Orders</span>
        <span className="mx-auto md:mx-0">🎉 Extra 20% Off Limited Flash Deals!</span>
        <div className="hidden md:block">
          <RegionCurrencyIsland />
        </div>
      </div>

      {/* 主导航条 */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="bg-temu-orange text-white font-black text-2xl px-2.5 py-0.5 rounded-lg tracking-tighter shadow-sm group-hover:bg-temu-darkOrange transition-colors">
            TEMU
          </span>
          <span className="text-xs font-bold text-yellow-400 tracking-wider uppercase ml-1 hidden sm:inline">
            EDGE
          </span>
        </Link>

        {/* 静态搜索框骨架 (零 JS 开销) */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search wireless earbuds, smart watch, home gadgets..."
              className="w-full bg-white text-gray-900 text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-temu-orange"
              readOnly
            />
            <button
              type="button"
              className="absolute right-1 px-3 py-1 bg-temu-orange hover:bg-temu-darkOrange text-white rounded-full text-xs font-bold transition-colors"
            >
              🔍
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-3 md:gap-4 text-xs font-semibold">
          <Link href="/#matrix" className="text-yellow-300 hover:text-white transition-colors bg-white/10 px-2 py-1 rounded">
            📊 18品类矩阵 (1800 SKU)
          </Link>
          <Link href="/" className="hover:text-yellow-400 transition-colors hidden sm:inline">
            🔥 Flash Deals
          </Link>
          <Link href="/category/electronics/" className="hover:text-yellow-400 transition-colors hidden md:inline">
            Electronics
          </Link>
          <Link href="/category/home-kitchen/" className="hover:text-yellow-400 transition-colors hidden lg:inline">
            Home
          </Link>
          <CartNavbarButtonIsland />
        </nav>
      </div>
    </header>
  );
};
