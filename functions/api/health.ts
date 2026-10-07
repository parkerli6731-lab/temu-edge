export async function onRequestGet() {
  return new Response(
    JSON.stringify(
      {
        status: 'UP',
        service: 'temu-edge-payment-gateway',
        edgeRuntime: 'Cloudflare Pages Functions (V8 Worker)',
        timestamp: new Date().toISOString(),
        regions: ['Anycast-Global-330-PoPs'],
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
