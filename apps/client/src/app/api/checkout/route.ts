import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token' }, { status: 401 });
    }

    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simbolobackend-production.up.railway.app/api/v1';

    // 1. Create Internal Order
    const orderRes = await fetch(`${apiUrl}/orders/checkout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ packageId: body.packageId })
    });
    
    if (!orderRes.ok) {
      const errorText = await orderRes.text();
      console.error("Order creation failed:", errorText);
      return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: orderRes.status });
    }
    const orderData = await orderRes.json();
    const internalOrderId = orderData.data?.id || orderData.id;

    // 2. Create Gateway Order
    const paymentOrderRes = await fetch(`${apiUrl}/payments/create-order`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ orderId: internalOrderId })
    });

    if (!paymentOrderRes.ok) {
      const errorText = await paymentOrderRes.text();
      console.error("Payment order creation failed:", errorText);
      return NextResponse.json({ success: false, message: 'Failed to create payment order' }, { status: paymentOrderRes.status });
    }
    
    const paymentOrderData = await paymentOrderRes.json();
    return NextResponse.json(paymentOrderData);
  } catch (error) {
    console.error("Checkout proxy error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
