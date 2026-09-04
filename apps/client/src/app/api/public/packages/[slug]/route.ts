import { NextResponse } from 'next/server';

// See ../route.ts — same reasoning, for the single-package lookup checkout uses.
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://simbolobackend-production.up.railway.app/api/v1';
    const res = await fetch(`${apiUrl}/packages/${encodeURIComponent(slug)}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Public package-by-slug proxy error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
