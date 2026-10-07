// Cloudflare Pages Functions Edge API
// Route: /api/checkout/create-session

interface CartItemPayload {
  skuId: string;
  unitPriceCents: number;
  quantity: number;
}

interface CreateSessionRequest {
  orderId?: string;
  currency?: string;
  amountTotalCents?: number;
  items?: CartItemPayload[];
  paymentRails?: 'apple_pay' | 'card' | 'paypal';
  customerEmail?: string;
}

export async function onRequestPost(context: { request: Request; env: Record<string, string> }) {
  const { request } = context;

  try {
    const body: CreateSessionRequest = await request.json();
    const sessionId = `cs_temu_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = request.headers.get('Idempotency-Key') || `idemp_${Date.now()}`;

    const responsePayload = {
      code: 200,
      success: true,
      message: 'Checkout session created successfully on Cloudflare Edge',
      data: {
        sessionId,
        orderId: body.orderId || `ORD-${Date.now()}`,
        status: 'requires_payment_method',
        currency: body.currency || 'USD',
        amountTotalCents: body.amountTotalCents || 0,
        itemsCount: body.items?.length || 0,
        paymentRails: body.paymentRails || 'apple_pay',
        clientSecret: `${sessionId}_secret_${Math.random().toString(36).substring(2, 10)}`,
        idempotencyKey,
        edgeNode: 'Cloudflare-Global-Edge-Anycast',
        createdAt: new Date().toISOString(),
        paymentUrls: {
          stripeHostedCheckout: `https://checkout.stripe.com/c/pay/${sessionId}`,
          applePayMerchantValidation: `/api/checkout/applepay-validate?session=${sessionId}`,
          paypalOrderApprove: `https://www.paypal.com/checkoutnow?token=${sessionId}`,
        },
      },
    };

    return new Response(JSON.stringify(responsePayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return new Response(
      JSON.stringify(
        {
          code: 400,
          success: false,
          error: error.message || 'Invalid JSON request payload',
        },
        null,
        2
      ),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function onRequestGet() {
  return new Response(
    JSON.stringify(
      {
        endpoint: '/api/checkout/create-session',
        method: 'POST',
        protocol: 'Cloudflare Pages Functions / Worker RPC',
        description: 'Initiate global edge payment session for Temu catalog checkout',
        samplePayload: {
          orderId: 'ORD-2026-TMP',
          currency: 'USD',
          amountTotalCents: 1499,
          paymentRails: 'apple_pay',
          items: [
            {
              skuId: 'sku-ergonomic-neck-pillow',
              unitPriceCents: 1499,
              quantity: 1,
            },
          ],
        },
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
    },
  });
}
