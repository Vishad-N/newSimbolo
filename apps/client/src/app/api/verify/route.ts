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

    const verifyRes = await fetch(`${apiUrl}/payments/verify`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!verifyRes.ok) {
      const errorText = await verifyRes.text();
      console.error("Payment verification failed:", errorText);
      return NextResponse.json({ success: false, message: 'Verification failed' }, { status: verifyRes.status });
    }
    
    const verifyData = await verifyRes.json();
    return NextResponse.json(verifyData);
  } catch (error) {
    console.error("Verify proxy error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
