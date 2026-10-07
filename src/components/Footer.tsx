import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-16 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Customer Service</h4>
          <ul className="space-y-2">
            <li>Return and Refund Policy (90 Days)</li>
            <li>Purchase Protection Program</li>
            <li>Shipping Information & Tracking</li>
            <li>Help Center & Live Chat</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Shop With Us</h4>
          <ul className="space-y-2">
            <li>Lightning Flash Deals</li>
            <li>Factory Direct Wholesale</li>
            <li>Lowest Price Guarantee</li>
            <li>Affiliate & Creator Program</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Architecture & Tech</h4>
          <ul className="space-y-2">
            <li>⚡ Powered by Cloudflare Pages & Workers</li>
            <li>🚀 100% Edge Pre-rendered SSG</li>
            <li>🛡️ Bot Defense via Cloudflare Turnstile</li>
            <li>🌱 Zero-Bill Build-Time WebP Pipeline</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Security & Trust</h4>
          <div className="space-y-2">
            <p>🔒 PCI-DSS Certified 256-bit SSL Gateway</p>
            <p>💳 Visa, Mastercard, Apple Pay, PayPal</p>
            <p className="text-slate-500 text-[10px] mt-4">
              © 2026 Temu Edge Catalog Showcase. Developed with AI-Native Engineering (Codex / Claude Code / Cloudflare SOP).
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
