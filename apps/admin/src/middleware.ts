import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  // We check for basic auth credentials in the environment variables
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  // If no credentials are set in the environment, we can either allow access or block.
  // For security, if they aren't set, we bypass auth during development, 
  // but if they ARE set, we enforce them.
  if (adminUser && adminPass) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === adminUser && pwd === adminPass) {
        return NextResponse.next();
      }
    }
    
    // If auth fails or is missing, prompt for credentials
    url.pathname = '/api/auth';
    return new NextResponse('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

// Apply the middleware to all routes except API, static files, and Next.js internals
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
