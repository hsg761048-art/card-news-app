import { Card } from '@/types';
import { VALID_CATEGORIES } from './constants';

export let activeModel = '';

export async function callGemini(prompt: string): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || `HTTP ${res.status}`);
  }

  const data = await res.json() as { text: string; model?: string };
  if (data.model) activeModel = data.model;
  return data.text;
}

function parseJSON(text: string) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

export async function geminiExpandText(inputType: string, inputData: string): Promise<string> {
  let prompt = '';
  if (inputType === 'keyword') {
    prompt = `당신은 SNS 카드뉴스 전문 카피라이터입니다.
아래 키워드/주제로 카드뉴스에 사용할 본문을 작성해 주세요.
핵심 포인트 4~6개를 포함하고, 각 포인트마다 2~3문장의 설명을 붙여 자연스러운 문단 형식으로 작성하세요.
마크다운 기호 없이 순수 텍스트로만 작성해 주세요.

키워드: ${inputData}`;
  } else if (inputType === 'url') {
    prompt = `당신은 콘텐츠 큐레이터입니다.
아래 URL의 예상 주제로 카드뉴스 원고를 작성해 주세요.
마크다운 기호 없이 순수 텍스트로만 작성해 주세요.

URL: ${inputData}`;
  } else {
    prompt = `아래 텍스트에서 불필요한 특수문자, 광고 문구를 제거하고 카드뉴스에 적합한 핵심 본문만 정제해서 반환해 주세요.
마크다운 기호 없이 순수 텍스트로만 작성해 주세요.

원문:\n${inputData.substring(0, 3000)}`;
  }
  return callGemini(prompt);
}

export async function geminiDetectCategory(text: string): Promise<string> {
  const prompt = `아래 텍스트의 카테고리를 다음 중 하나로만 답해 주세요. 카테고리 이름만 정확히 반환하세요:
비즈니스/경제, 건강/웰빙, 기술/IT, 라이프스타일, 교육/학습, 마케팅/SNS, 뉴스/시사, 자기계발

텍스트:\n${text.substring(0, 500)}`;
  const result = await callGemini(prompt);
  const found = VALID_CATEGORIES.find(c => result.includes(c));
  return found || '라이프스타일';
}

export async function geminiGenerateCards(text: string, category: string, format: string): Promise<Card[]> {
  const lineLimit = format === '1:1' ? '3~4줄 이내 (최대 80자)' : '4~6줄 이내 (최대 130자)';
  const prompt = `당신은 인스타그램 카드뉴스 전문 에디터입니다.
아래 텍스트를 카드뉴스 슬라이드로 변환해 주세요.

규칙:
- 총 6~8장 구성 (표지 1장 + 내용 4~6장 + 마무리 1장)
- 각 슬라이드 body는 ${lineLimit}로 핵심만 작성
- 제목은 간결하고 임팩트 있게 (15자 이내)
- 카테고리: ${category}
- 마크다운 없이 순수 텍스트만 사용

반드시 아래 JSON 형식으로만 응답하세요:
{
  "cards": [
    {"type":"cover","title":"메인 제목","subtitle":"${category}","body":""},
    {"type":"content","title":"포인트 제목","subtitle":"","body":"본문 내용"},
    {"type":"end","title":"저장 & 공유","subtitle":"도움이 되셨다면 저장해 주세요","body":"팔로우하면 더 많은 정보를 받을 수 있어요"}
  ]
}

텍스트:\n${text.substring(0, 2000)}`;

  const result = await callGemini(prompt);
  const parsed = parseJSON(result);
  if (!parsed.cards || !Array.isArray(parsed.cards)) throw new Error('카드 데이터 형식 오류');
  return parsed.cards.map((c: any, i: number) => ({
    ...c,
    id: c.type === 'content' ? `content-${i}` : c.type,
  }));
}

// Demo mode fallbacks (no API)
export function demoDetectCategory(text: string): string {
  const kws: Record<string, string[]> = {
    '비즈니스/경제':['투자','주식','경제','매출','기업'],
    '건강/웰빙':['건강','운동','다이어트','수면','번아웃'],
    '기술/IT':['AI','인공지능','개발','코딩','소프트웨어'],
    '라이프스타일':['패션','여행','카페','취미','일상'],
    '교육/학습':['공부','학습','시험','자격증','독서'],
    '마케팅/SNS':['마케팅','광고','인스타','유튜브','콘텐츠'],
    '뉴스/시사':['뉴스','정치','사회','정책','선거'],
    '자기계발':['자기계발','성공','목표','습관','동기'],
  };
  const scores = Object.fromEntries(Object.entries(kws).map(([k,v])=>[k,v.filter(w=>text.includes(w)).length]));
  const max = Math.max(...Object.values(scores));
  return max === 0 ? '라이프스타일' : Object.entries(scores).find(([,v])=>v===max)![0];
}

export function demoGenerateCards(text: string, category: string): Card[] {
  const sentences = text.replace(/\n+/g,'\n').split(/[.\n]/).map(s=>s.trim()).filter(s=>s.length>5);
  const cards: Card[] = [{ id:'cover', type:'cover', title: sentences[0]?.substring(0,25)||'카드뉴스', subtitle: category, body:'' }];
  for (let i=0; i<Math.min(5,sentences.length); i+=2) {
    const body = sentences.slice(i,i+2).join('. ');
    cards.push({ id:`content-${i}`, type:'content', title:`Point ${Math.floor(i/2)+1}`, subtitle:'', body: body.length>120 ? body.substring(0,117)+'...' : body });
  }
  cards.push({ id:'end', type:'end', title:'저장 & 공유', subtitle:'도움이 되셨다면 저장해 주세요', body:'팔로우하면 더 많은 정보를 받을 수 있어요' });
  return cards;
}
