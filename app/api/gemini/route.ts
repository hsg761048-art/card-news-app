import { NextRequest, NextResponse } from 'next/server';

const GEMINI_CANDIDATES = [
  { version: 'v1beta', model: 'gemini-3.1-flash-lite-preview' },
  { version: 'v1beta', model: 'gemini-2.0-flash'              },
  { version: 'v1beta', model: 'gemini-2.0-flash-lite'         },
  { version: 'v1beta', model: 'gemini-1.5-flash'              },
  { version: 'v1beta', model: 'gemini-1.5-flash-8b'           },
];

async function tryGemini(apiKey: string, version: string, model: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg = (errBody as any)?.error?.message || `HTTP ${res.status}`;
    throw new Error(`[${version}/${model}] ${msg}`);
  }

  const data = await res.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) throw new Error(`[${version}/${model}] 응답 텍스트 없음`);
  return { text, model };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.' }, { status: 500 });
  }

  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '요청 본문을 파싱할 수 없습니다.' }, { status: 400 });
  }

  const prompt = body.prompt;
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: 'prompt 필드가 필요합니다.' }, { status: 400 });
  }

  let lastError = '';
  for (const { version, model } of GEMINI_CANDIDATES) {
    try {
      const result = await tryGemini(apiKey, version, model, prompt);
      return NextResponse.json(result);
    } catch (e: any) {
      lastError = e.message;
      // API 키 자체가 잘못된 경우에만 즉시 중단
      const isInvalidKey =
        /HTTP 401/.test(e.message) ||
        /API_KEY_INVALID|api key not valid|invalid api key/i.test(e.message);
      if (isInvalidKey) {
        return NextResponse.json(
          { error: `API 키 오류: ${e.message}` },
          { status: 401 },
        );
      }
      // 403(접근 제한), 404(모델 없음), 429(rate limit) → 다음 모델 시도
    }
  }

  return NextResponse.json(
    { error: `모든 모델 연결 실패. 마지막 오류: ${lastError}` },
    { status: 503 },
  );
}
