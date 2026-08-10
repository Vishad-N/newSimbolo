import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path);
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
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
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No token found' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simbolobackend-production.up.railway.app/api/v1';
    
    // Construct the backend URL
    const targetPath = pathArray.join('/');
    const url = new URL(request.url);
    const searchParams = url.search; // keep existing query parameters

    const targetUrl = `${apiUrl}/${targetPath}${searchParams}`;

    // Read body if it's not a GET or HEAD
    let body;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        body = await request.text();
      } catch (e) {
        // Ignore body parsing errors
      }
    }

    // Forward the request to the backend
    const res = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': request.headers.get('content-type') || 'application/json',
        'Accept': request.headers.get('accept') || 'application/json',
      },
      body: body || undefined,
    });

    const data = await res.text();
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }

    return NextResponse.json(parsedData, { status: res.status });
  } catch (error) {
    console.error("Proxy API Error:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
