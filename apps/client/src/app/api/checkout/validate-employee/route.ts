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
    const employeeCode = typeof body?.employeeCode === 'string' ? body.employeeCode.trim() : '';

    if (!employeeCode) {
      return NextResponse.json({ valid: false, message: 'Employee code is required' }, { status: 200 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simbolobackend-production.up.railway.app/api/v1';

    const validateRes = await fetch(`${apiUrl}/checkout/affiliate/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ employeeCode }),
    });

    const raw = await validateRes.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { valid: false, message: 'Invalid or inactive employee code' };
    }

    if (!validateRes.ok) {
      const message =
        (parsed as { message?: string | string[] })?.message ?? 'Invalid or inactive employee code';
      return NextResponse.json(
        { valid: false, message: Array.isArray(message) ? message[0] : message },
        { status: 200 },
      );
    }

    // Unwrap the standard { data: ... } envelope when the backend uses one.
    const payload = (parsed as { data?: unknown })?.data ?? parsed;
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Employee code validation proxy error:', error);
    return NextResponse.json({ valid: false, message: 'Server Error' }, { status: 500 });
  }
}
