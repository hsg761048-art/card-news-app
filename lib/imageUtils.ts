import { Card } from '@/types';
import { CANVA_TEMPLATES, CATEGORY_STYLE, CATEGORY_STYLES } from './constants';

export const imgLoadedCache = new Set<string>();

export function getCanvaTemplate(index: number) {
  return CANVA_TEMPLATES[index % CANVA_TEMPLATES.length];
}

// 배열을 Fisher-Yates 방식으로 완전히 섞기
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildPollinationsUrl(
  category: string, format: string,
  index: number, sessionSeed: number
): string {
  const styles = (CATEGORY_STYLES[category] || CATEGORY_STYLES['라이프스타일']).poll;
  const w = format === '9:16' ? 360 : 400;
  const h = format === '9:16' ? 640 : 400;

  // 카드마다 완전히 다른 스타일 프롬프트 랜덤 선택 → 시각적으로 완전히 다른 이미지
  const styleIdx = (sessionSeed + index * 3) % styles.length;
  const style = styles[styleIdx];

  // seed도 다르게
  const seed = (sessionSeed * 17 + index * 7919) % 999983;

  // 프롬프트 텍스트 자체가 매번 다름 → 서버 캐시 완전 우회
  const prompt = `${style}, no text, no watermark, ultra realistic, 8k`;

  const params = new URLSearchParams({
    width: String(w), height: String(h),
    model: 'turbo', seed: String(seed), nologo: 'true',
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
}

export function generateCardImageUrls(cards: Card[], category: string, format: string): Record<string, string> {
  const map: Record<string, string> = {};
  // 타임스탬프 + 랜덤 → 같은 키워드를 연속으로 입력해도 완전히 다른 seed
  const sessionSeed = (Date.now() + Math.floor(Math.random() * 999983)) % 999983;
  cards.forEach((card, i) => {
    if (card.type !== 'end') map[card.id] = buildPollinationsUrl(category, format, i, sessionSeed);
  });
  return map;
}

export function generateCanvaTemplateMap(cards: Card[]): Record<string, string> {
  const map: Record<string, string> = {};
  const targets = cards.filter(c => c.type !== 'end');

  // 전체 템플릿 인덱스를 섞어서 순서대로 할당 → 매번 완전히 다른 조합
  const indices = Array.from({ length: CANVA_TEMPLATES.length }, (_, i) => i);
  const shuffled = shuffleArray(indices);

  targets.forEach((card, i) => {
    map[card.id] = `canva:${shuffled[i % shuffled.length]}`;
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
  const keywords = (CATEGORY_STYLES[category] || CATEGORY_STYLES['라이프스타일']).pixabay;
  // 매번 다른 키워드 선택
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const orient = format === '9:16' ? 'vertical' : 'horizontal';
  const targets = cards.filter(c => c.type !== 'end');

  onProgress(0, targets.length, 'Pixabay 이미지 검색 중...');

  const perPage = 20; // 최대 가져와서 섞기
  // 1~10 사이 랜덤 페이지 → 매번 다른 사진 풀
  const randomPage = String(Math.floor(Math.random() * 10) + 1);

  const params = new URLSearchParams({
    q: keyword,
    orientation: orient,
    per_page: String(perPage),
    page: randomPage,
    order: 'latest',
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

  // ★ 핵심: 결과를 섞어서 할당 → 매번 다른 이미지 조합
  const shuffledHits = shuffleArray(data.hits);

  const map: Record<string, string> = {};
  targets.forEach((card, i) => {
    const imgUrl = shuffledHits[i % shuffledHits.length].webformatURL;
    map[card.id] = imgUrl;
    imgLoadedCache.add(imgUrl);
    onProgress(i + 1, targets.length, card.title);
  });

  return map;
}
