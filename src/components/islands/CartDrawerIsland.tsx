'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getCartItems,
  updateCartQuantity,
  removeCartItem,
  closeCartDrawer,
  CART_EVENT,
  CART_TOGGLE_EVENT,
  CartItem,
} from '@/lib/cart-store';

export function CartDrawerIsland() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('EDGE2026');
  const [promoApplied, setPromoApplied] = useState(true);

  // 支付 API 联调抽屉状态
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'paypal'>('apple_pay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [activeTab, setActiveTab] = useState<'checkout' | 'api_docs'>('checkout');

  useEffect(() => {
    setItems(getCartItems());

    const handleCartUpdate = (e: Event) => {
      const custom = e as CustomEvent<CartItem[]>;
      if (custom.detail) {
        setItems(custom.detail);
      } else {
        setItems(getCartItems());
      }
    };

    const handleToggle = (e: Event) => {
      const custom = e as CustomEvent<{ open: boolean }>;
      if (custom.detail) {
        setIsOpen(custom.detail.open);
      }
    };

    window.addEventListener(CART_EVENT, handleCartUpdate);
    window.addEventListener(CART_TOGGLE_EVENT, handleToggle);

    return () => {
      window.removeEventListener(CART_EVENT, handleCartUpdate);
      window.removeEventListener(CART_TOGGLE_EVENT, handleToggle);
    };
  }, []);

  const totalRawCents = items.reduce(
    (acc, item) => acc + item.promotionalPriceCents * item.quantity,
    0
  );
  const discountCents = promoApplied ? Math.round(totalRawCents * 0.2) : 0;
  const finalTotalCents = Math.max(0, totalRawCents - discountCents);

  const formatMoney = (cents: number) =>
    (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const handleTestPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      const generatedId = `TEMU-CF-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      // 清空购物车
      localStorage.removeItem('temu_edge_cart_v1');
      setItems([]);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          setIsOpen(false);
          closeCartDrawer();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform ease-in-out duration-300">
          {/* 购物车头部 */}
          <div className="p-4 bg-temu-dark text-white flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <h2 className="text-base font-black tracking-tight">
                Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                closeCartDrawer();
              }}
              className="text-gray-400 hover:text-white p-1 rounded-full text-lg font-bold"
              aria-label="Close cart drawer"
            >
              ✕
            </button>
          </div>

          {/* 免邮通知横幅 */}
          <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
            <span className="font-semibold flex items-center gap-1">
              <span>🚚</span> Free Express Delivery Unlocked!
            </span>
            <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
              Qualified
            </span>
          </div>

          {/* 购物车商品列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <div className="text-5xl mb-3">🛒</div>
                <p className="text-sm font-semibold">Your cart is currently empty</p>
                <p className="text-xs text-gray-400 mt-1">Discover thousands of lightning deals now!</p>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 inline-block bg-temu-orange hover:bg-temu-darkOrange text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
                >
                  Explore Flash Deals
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.skuId}
                  className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-gray-200"
                >
                  <img
                    src={`/images/optimized/${item.heroImageBaseName}-384w.webp`}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">SKU: {item.skuId}</div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60">
                      <span className="text-sm font-black text-temu-darkOrange font-mono">
                        {formatMoney(item.promotionalPriceCents)}
                      </span>

                      {/* 数量调整 */}
                      <div className="flex items-center border border-gray-300 rounded-md bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.skuId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.skuId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* 删除 */}
                      <button
                        onClick={() => removeCartItem(item.skuId)}
                        className="text-gray-400 hover:text-red-600 text-xs p-1"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 优惠码输入栏 */}
          {items.length > 0 && (
            <div className="px-4 py-2.5 bg-orange-50/50 border-t border-orange-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">Promo Code:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-24 px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs uppercase"
                />
                <button
                  onClick={() => setPromoApplied(!promoApplied)}
                  className="px-2.5 py-1 bg-temu-dark text-white rounded text-[11px] font-bold hover:bg-black"
                >
                  {promoApplied ? 'Applied ✓' : 'Apply'}
                </button>
              </div>
            </div>
          )}

          {/* 费用汇总结算区 */}
          {items.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-gray-800">{formatMoney(totalRawCents)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>Coupon Discount (20% OFF):</span>
                  <span className="font-mono font-bold">-{formatMoney(discountCents)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-600">
                <span>Shipping:</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                <span>Estimated Total:</span>
                <span className="text-xl font-mono text-temu-darkOrange">
                  {formatMoney(finalTotalCents)}
                </span>
              </div>

              {/* 核心结算按钮 -> 唤起支付与 API 接入透视台 */}
              <button
                type="button"
                onClick={() => setShowCheckoutModal(true)}
                className="w-full mt-2 py-3.5 bg-temu-orange hover:bg-temu-darkOrange active:scale-98 text-white font-black rounded-full text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>🔒</span>
                <span>PROCEED TO CHECKOUT ({formatMoney(finalTotalCents)})</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 pt-1">
                <span>💳 Visa / MC</span>
                <span> Apple Pay</span>
                <span>🅿️ PayPal</span>
                <span>🛡️ 256-bit SSL</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 支付接入与 API 联调模态框 (Payment API Inspector Modal) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            {/* 模态框头部 */}
            <div className="bg-gradient-to-r from-temu-dark to-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💳</span>
                <div>
                  <h3 className="font-black text-sm md:text-base">
                    Cloudflare Edge Payment Gateway & Checkout API
                  </h3>
                  <p className="text-[11px] text-gray-300">
                    边缘化支付结算沙箱与底层 REST / Worker RPC API 透视台
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* 选项卡切换: 交互结算 vs API 报文透视 */}
            <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
              <button
                onClick={() => setActiveTab('checkout')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                  activeTab === 'checkout'
                    ? 'border-temu-orange text-temu-darkOrange bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                1. 交互支付渠道 (Payment Rails)
              </button>
              <button
                onClick={() => setActiveTab('api_docs')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                  activeTab === 'api_docs'
                    ? 'border-temu-orange text-temu-darkOrange bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                2. 底层接入 API 报文透视 (Cloudflare Worker RPC)
              </button>
            </div>

            {/* 选项卡内容区 */}
            <div className="p-6 overflow-y-auto flex-1 text-xs">
              {activeTab === 'checkout' ? (
                paymentSuccess ? (
                  /* 支付成功回执 */
                  <div className="py-8 text-center space-y-3">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                      ✓
                    </div>
                    <h4 className="text-xl font-black text-gray-900">Payment Authorized & Confirmed!</h4>
                    <p className="text-gray-600">
                      Order Reference:{' '}
                      <span className="font-mono font-bold text-temu-darkOrange">{orderId}</span>
                    </p>
                    <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-4 rounded-xl text-left font-mono text-[11px] space-y-1 text-slate-700">
                      <div>Status: <span className="text-emerald-700 font-bold">200 OK (Paid)</span></div>
                      <div>Gateway: Cloudflare Smart Placement -&gt; Stripe / Adyen</div>
                      <div>Amount Charged: {formatMoney(finalTotalCents)}</div>
                      <div>Tracking ETA: 3-5 Business Days (Air Express)</div>
                    </div>
                    <button
                      onClick={() => {
                        setShowCheckoutModal(false);
                        setPaymentSuccess(false);
                        setIsOpen(false);
                      }}
                      className="mt-4 px-6 py-2.5 bg-temu-orange text-white font-bold rounded-full text-xs hover:bg-temu-darkOrange"
                    >
                      Done / Return to Shop
                    </button>
                  </div>
                ) : (
                  /* 渠道选择与支付操作 */
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-orange-950">
                      <span className="font-bold">Total Order Amount: </span>
                      <span className="text-base font-black font-mono text-temu-darkOrange">
                        {formatMoney(finalTotalCents)}
                      </span>{' '}
                      (Includes all customs duties & express shipping)
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-2">Select Payment Rail:</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('apple_pay')}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            paymentMethod === 'apple_pay'
                              ? 'border-temu-orange bg-orange-50/50 shadow-sm ring-2 ring-temu-orange/30'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-xl mb-1"></div>
                          <div className="font-bold">Apple Pay</div>
                          <div className="text-[10px] text-gray-400">1-Click Fast</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            paymentMethod === 'card'
                              ? 'border-temu-orange bg-orange-50/50 shadow-sm ring-2 ring-temu-orange/30'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-xl mb-1">💳</div>
                          <div className="font-bold">Credit Card</div>
                          <div className="text-[10px] text-gray-400">Visa, MC, Amex</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('paypal')}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            paymentMethod === 'paypal'
                              ? 'border-temu-orange bg-orange-50/50 shadow-sm ring-2 ring-temu-orange/30'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-xl mb-1">🅿️</div>
                          <div className="font-bold">PayPal</div>
                          <div className="text-[10px] text-gray-400">Buyer Protection</div>
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          placeholder="Card Number: 4242 •••• •••• 4242"
                          className="w-full p-2 bg-white border border-gray-300 rounded font-mono text-xs"
                          defaultValue="4242 4242 4242 4242"
                          readOnly
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            defaultValue="12/28"
                            className="p-2 bg-white border border-gray-300 rounded font-mono text-xs"
                            readOnly
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            defaultValue="888"
                            className="p-2 bg-white border border-gray-300 rounded font-mono text-xs"
                            readOnly
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={handleTestPayment}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-full text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <>
                          <span className="animate-spin text-base">⏳</span>
                          <span>Routing to Cloudflare Payment Edge Worker...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡</span>
                          <span>TEST MOCK PAYMENT ({formatMoney(finalTotalCents)})</span>
                        </>
                      )}
                    </button>
                  </div>
                )
              ) : (
                /* API 报文透视与代码范例 */
                <div className="space-y-4 font-mono text-[11px]">
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto shadow-inner">
                    <div className="text-emerald-400 font-bold mb-2">
                      # 1. 边缘端发起的创建结算会话 (Create Checkout Session)
                    </div>
                    <div className="text-yellow-300">POST https://temu-edge.pages.dev/api/checkout/create-session</div>
                    <div className="text-gray-400 mt-1">Headers:</div>
                    <div className="text-blue-300">
                      Authorization: Bearer cf-sec_98471...<br />
                      Idempotency-Key: idemp_{Math.floor(Date.now() / 1000)}_temu<br />
                      Content-Type: application/json<br />
                      CF-Ray: a46ee3343dd8ebb9-YYZ
                    </div>
                    <div className="text-gray-400 mt-2">Payload (JSON):</div>
                    <pre className="text-purple-300 mt-1 whitespace-pre-wrap">
{JSON.stringify(
  {
    orderId: "ORD-2026-TMP",
    currency: "USD",
    amountTotalCents: finalTotalCents,
    items: items.map((i) => ({
      skuId: i.skuId,
      unitPriceCents: i.promotionalPriceCents,
      quantity: i.quantity,
    })),
    shippingAddress: {
      country: "US",
      postalCode: "94105",
      method: "AIR_EXPRESS_FREE",
    },
    paymentRails: paymentMethod,
    metadata: {
      clientPoP: "Cloudflare-Anycast-YYZ",
      riskScore: 0.02,
    },
  },
  null,
  2
)}
                    </pre>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto shadow-inner">
                    <div className="text-emerald-400 font-bold mb-2">
                      # 2. 支付成功异步 Webhook 监听网关 (Payment Webhook Gateway)
                    </div>
                    <div className="text-yellow-300">POST https://temu-edge.pages.dev/api/webhooks/payment-succeeded</div>
                    <div className="text-gray-400 mt-1">Worker RPC 处理流程:</div>
                    <pre className="text-emerald-300 mt-1 whitespace-pre-wrap">
{`// src/edge-worker.ts (Cloudflare Worker 代理处理)
export async function handlePaymentWebhook(req: Request, env: Env) {
  const sig = req.headers.get("Stripe-Signature");
  // 1. 边缘验证签名防伪造
  const event = verifyWebhookSignature(await req.text(), sig, env.STRIPE_SECRET);

  if (event.type === "payment_intent.succeeded") {
    // 2. 毫秒级写入 Cloudflare D1 / Durable Objects 锁定订单状态
    await env.DB.prepare(
      "UPDATE orders SET status = 'PAID', paid_at = datetime('now') WHERE id = ?"
    ).bind(event.data.object.metadata.orderId).run();

    // 3. 异步向拼多多主仓调度履约出库 RPC
    await env.SUPPLY_CHAIN_QUEUE.send({ orderId: event.data.object.metadata.orderId });
  }
  return new Response("OK", { status: 200 });
}`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
