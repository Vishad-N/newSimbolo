import { NextResponse } from 'next/server';

const getSafeDestination = (value: string | null) => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/dashboard';
  return value;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || (
    process.env.NODE_ENV === 'production' ? 'https://simbolo.ai' : 'http://localhost:3000'
  );
  const loginUrl = new URL('/', landingUrl);
  loginUrl.searchParams.set('auth', 'login');
  loginUrl.searchParams.set('error', 'missing-authentication');

  if (!code) {
    return NextResponse.redirect(loginUrl);
  }

  // The redirect that got us here carries only a short-lived, single-use code —
  // never the raw tokens, which would otherwise land in browser history, server
  // access logs, and a possible Referer header. Exchange it server-to-server so
  // the tokens only ever travel in a request body, never a URL.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simbolobackend-production.up.railway.app/api/v1';
  let accessToken: string | undefined;
  let refreshToken: string | undefined;
  let role: string | undefined;

  try {
    const exchangeRes = await fetch(`${apiUrl}/auth/handoff/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!exchangeRes.ok) {
      return NextResponse.redirect(loginUrl);
    }
    const payload = await exchangeRes.json();
    const data = payload?.data || payload;
    accessToken = data?.accessToken;
    refreshToken = data?.refreshToken;
    role = data?.role;
  } catch {
    return NextResponse.redirect(loginUrl);
  }

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  const destination = getSafeDestination(requestUrl.searchParams.get('next'));
  const response = NextResponse.redirect(new URL(destination, requestUrl.origin));
  const secure = process.env.NODE_ENV === 'production';

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  // Readable by client components (Sidebar, SubscriptionGuard) to isolate the
  // affiliate self-service portal from the client dashboard within this same app.
  if (role === 'AFFILIATE' || role === 'CLIENT') {
    response.cookies.set('userRole', role, {
      httpOnly: false,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}
