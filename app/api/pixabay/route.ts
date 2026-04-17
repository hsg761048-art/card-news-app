import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword  = searchParams.get('q') || '';
  const orient   = searchParams.get('orientation') || 'horizontal';
  const perPage  = searchParams.get('per_page') || '10';
  // 클라이언트가 직접 키를 보낼 수도 있고, 서버 환경변수를 쓸 수도 있음
  const apiKey   = process.env.PIXABAY_API_KEY || searchParams.get('key') || '';

  if (!apiKey) {
    return NextResponse.json({ error: 'Pixabay API 키가 없습니다.' }, { status: 400 });
  }

  const url = `https://pixabay.com/api/?key=${apiKey}`
    + `&q=${encodeURIComponent(keyword)}`
    + `&image_type=photo&orientation=${orient}`
    + `&per_page=${perPage}&safesearch=true&min_width=400`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: (err as any)?.message || `Pixabay 오류 (${res.status})` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
