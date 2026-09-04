import { NextResponse } from 'next/server';

// Packages are public data (GET /packages is @Public() on the backend), but a
// browser fetching the backend origin directly depends on backend CORS being
// configured for the client app's origin and skips the app's own caching/error
// handling. Proxy it server-to-server instead, same as every other data fetch
// in this app, so it's consistent and doesn't depend on cross-origin CORS.
export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simbolobackend-production.up.railway.app/api/v1';
    const res = await fetch(`${apiUrl}/packages`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Public packages proxy error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
