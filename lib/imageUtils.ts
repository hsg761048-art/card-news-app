import { Card } from '@/types';
import { CANVA_TEMPLATES, CATEGORY_STYLE } from './constants';

export const imgLoadedCache = new Set<string>();

export function getCanvaTemplate(index: number) {
  return CANVA_TEMPLATES[index % CANVA_TEMPLATES.length];
}

export function buildPollinationsUrl(card: Card, category: string, format: string, index: number, sessionSeed: number): string {
  const style = (CATEGORY_STYLE[category] || CATEGORY_STYLE['라이프스타일']).poll;
  const prompt = `${style}, no text, cinematic, dark, 4k`;
  const w = format === '9:16' ? 360 : 400;
  const h = format === '9:16' ? 640 : 400;
  // sessionSeed는 생성할 때마다 랜덤 → 같은 카테고리여도 매번 다른 이미지
  const seed = (sessionSeed + index * 100) % 999999;
  const params = new URLSearchParams({ width: String(w), height: String(h), model: 'turbo', seed: String(seed), nologo: 'true' });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
}

export function generateCardImageUrls(cards: Card[], category: string, format: string): Record<string, string> {
  const map: Record<string, string> = {};
  // 매 생성마다 랜덤 seed
  const sessionSeed = Math.floor(Math.random() * 900000);
  cards.forEach((card, i) => {
    if (card.type !== 'end') map[card.id] = buildPollinationsUrl(card, category, format, i, sessionSeed);
  });
  return map;
}

export function generateCanvaTemplateMap(cards: Card[]): Record<string, string> {
  const map: Record<string, string> = {};
  // 매 생성마다 시작 템플릿을 랜덤하게 섞기
  const offset = Math.floor(Math.random() * CANVA_TEMPLATES.length);
  cards.forEach((card, i) => {
    if (card.type !== 'end') map[card.id] = `canva:${(i + offset) % CANVA_TEMPLATES.length}`;
  });
  return map;
}

export async function generatePixabayImageUrls(
  cards: Card[],
  category: string,
  format: string,
  pixabayKey: string,
  onProgress: (i: number, total: number, title?: string) => void
): Promise<Record<string, string>> {
  const keyword = (CATEGORY_STYLE[category] || CATEGORY_STYLE['라이프스타일']).pixabay;
  const orient = format === '9:16' ? 'vertical' : 'horizontal';
  const targets = cards.filter(c => c.type !== 'end');

  onProgress(0, targets.length, 'Pixabay 이미지 검색 중...');

  const perPage = Math.min(targets.length + 3, 20);
  // 매 생성마다 랜덤 페이지 (1~5) → 다른 사진 세트
  const randomPage = String(Math.floor(Math.random() * 5) + 1);
  // 서버 API route 경유 (CORS 문제 없음)
  const params = new URLSearchParams({
    q: keyword,
    orientation: orient,
    per_page: String(perPage),
    page: randomPage,
    key: pixabayKey.trim(),
  });
  const apiUrl = `/api/pixabay?${params}`;

  const res = await fetch(apiUrl);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.message || `Pixabay API 오류 (${res.status})`);
  }
  const data = await res.json() as { hits: Array<{ webformatURL: string }> };
  if (!data.hits || data.hits.length === 0) throw new Error('Pixabay 검색 결과 없음');

  const map: Record<string, string> = {};
  targets.forEach((card, i) => {
    const hit = data.hits[i % data.hits.length];
    const imgUrl = hit.webformatURL;
    map[card.id] = imgUrl;
    imgLoadedCache.add(imgUrl);
    onProgress(i + 1, targets.length, card.title);
  });

  return map;
}
