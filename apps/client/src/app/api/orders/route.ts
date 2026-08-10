import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simbolobackend-production.up.railway.app/api/v1';

    // 1. Fetch client profile to get the clientId
    const profileRes = await fetch(`${apiUrl}/profiles/client`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!profileRes.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch client profile' }, { status: profileRes.status });
    }

    const profileData = await profileRes.json();
    const clientId = profileData.id;

    if (!clientId) {
      return NextResponse.json({ success: true, data: [], meta: { total: 0 } });
    }

    // 2. Fetch orders using the clientId
    const ordersRes = await fetch(`${apiUrl}/orders?clientId=${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!ordersRes.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: ordersRes.status });
    }

    const ordersData = await ordersRes.json();
    return NextResponse.json(ordersData);
  } catch (error) {
    console.error("Orders API Error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
