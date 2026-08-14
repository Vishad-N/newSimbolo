import { NextResponse } from 'next/server';

const getSafeDestination = (value: string | null) => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/dashboard';
  return value;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const accessToken = requestUrl.searchParams.get('accessToken');
  const refreshToken = requestUrl.searchParams.get('refreshToken');

  if (!accessToken || !refreshToken) {
    const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || (
      process.env.NODE_ENV === 'production' ? 'https://simbolo.ai' : 'http://localhost:3000'
    );
    const loginUrl = new URL('/', landingUrl);
    loginUrl.searchParams.set('auth', 'login');
    loginUrl.searchParams.set('error', 'missing-authentication');
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

  return response;
}
