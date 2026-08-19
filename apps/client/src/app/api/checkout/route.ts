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
    // The optional sales-employee code is only attributed at payment-order time.
    const employeeCode = typeof body.employeeCode === 'string' ? body.employeeCode.trim() : '';
    const paymentOrderPayload: { orderId: string; employeeCode?: string } = { orderId: internalOrderId };
    if (employeeCode) {
      paymentOrderPayload.employeeCode = employeeCode;
    }

    const paymentOrderRes = await fetch(`${apiUrl}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(paymentOrderPayload)
    });

    if (!paymentOrderRes.ok) {
      const errorText = await paymentOrderRes.text();
      console.error("Payment order creation failed:", errorText);

      // Surface the backend's validation message (e.g. "Invalid or inactive employee code")
      // so the checkout UI can show why the payment could not be started.
      let message = 'Failed to create payment order';
      try {
        const parsed = JSON.parse(errorText) as { message?: string | string[] };
        if (parsed?.message) {
          message = Array.isArray(parsed.message) ? parsed.message[0] : parsed.message;
        }
      } catch {
        // Non-JSON error body: keep the generic message.
      }

      return NextResponse.json({ success: false, message }, { status: paymentOrderRes.status });
    }

    const paymentOrderData = await paymentOrderRes.json();
    return NextResponse.json(paymentOrderData);
  } catch (error) {
    console.error("Checkout proxy error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
