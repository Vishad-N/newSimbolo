import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path);
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path);
}

export async function PUT(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path);
}

async function handleProxy(request: Request, pathArray: string[]) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
    let token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No token found' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simbolobackend-production.up.railway.app/api/v1';
    
    // Construct the backend URL
    const targetPath = pathArray.join('/');
    const url = new URL(request.url);
    const searchParams = url.search; // keep existing query parameters

    const targetUrl = `${apiUrl}/${targetPath}${searchParams}`;

    // Read body if it's not a GET or HEAD. Uses arrayBuffer (not text) so binary
    // bodies — e.g. multipart/form-data file uploads — aren't corrupted by a
    // text decode/encode round trip; this is a safe superset of text bodies too.
    let body: ArrayBuffer | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        body = await request.arrayBuffer();
      } catch (e) {
        // Ignore body parsing errors
      }
    }

    // Forward the request to the backend
    let res = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': request.headers.get('content-type') || 'application/json',
        'Accept': request.headers.get('accept') || 'application/json',
      },
      body: body || undefined,
    });

    let newTokens: { accessToken: string, refreshToken: string } | null = null;

    // Handle Token Expiration
    if (res.status === 401) {
      const refreshMatch = cookieHeader.match(/refreshToken=([^;]+)/);
      const refreshToken = refreshMatch ? refreshMatch[1] : null;
      
      if (refreshToken) {
        const refreshRes = await fetch(`${apiUrl}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshPayload = await refreshRes.json();
          const refreshData = refreshPayload.data || refreshPayload;
          if (refreshData.accessToken && refreshData.refreshToken) {
            newTokens = { accessToken: refreshData.accessToken, refreshToken: refreshData.refreshToken };
            token = newTokens.accessToken;
            
            // Retry the original request
            res = await fetch(targetUrl, {
              method: request.method,
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': request.headers.get('content-type') || 'application/json',
                'Accept': request.headers.get('accept') || 'application/json',
              },
              body: body || undefined,
            });
          }
        }
      }
    }

    const data = await res.text();
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }

    const response = NextResponse.json(parsedData, { status: res.status });

    if (newTokens) {
      const secure = process.env.NODE_ENV === 'production';
      response.cookies.set('accessToken', newTokens.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure,
        path: '/',
        maxAge: 86400,
      });
      response.cookies.set('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure,
        path: '/',
        maxAge: 604800,
      });
    }

    return response;
  } catch (error) {
    console.error("Proxy API Error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
