import { CanvaTemplate } from '@/types';

// 카테고리별 다양한 스타일 목록 (매 생성마다 랜덤 선택 → 완전히 다른 이미지)
export const CATEGORY_STYLES: Record<string, { poll: string[]; pixabay: string[] }> = {
  '비즈니스/경제': {
    poll: [
      'modern corporate city skyline at night, blue indigo, glass buildings, dramatic',
      'stock market trading floor, dynamic energy, warm amber light, bokeh',
      'sleek minimalist office, sunlight streaming, white marble, professional',
      'aerial view of financial district, golden hour, skyscrapers, cinematic',
      'boardroom with panoramic city view, dark navy, spotlight, moody',
    ],
    pixabay: ['business finance city night', 'office corporate professional', 'skyscraper aerial architecture', 'stock market financial', 'meeting boardroom corporate'],
  },
  '건강/웰빙': {
    poll: [
      'serene misty mountain lake at sunrise, soft green light, reflections, zen',
      'lush tropical rainforest, dappled golden sunlight, vibrant green, peaceful',
      'calm ocean beach at dusk, soft pink sky, waves, meditative',
      'blooming cherry blossom path, soft pink petals, spring light, tranquil',
      'yoga retreat garden, white flowers, morning mist, serenity, soft tones',
    ],
    pixabay: ['nature wellness meditation yoga', 'forest green peaceful', 'ocean beach sunset calm', 'cherry blossom spring', 'garden flowers tranquil'],
  },
  '기술/IT': {
    poll: [
      'futuristic digital circuit board, neon cyan purple, cyberpunk abstract glow',
      'glowing holographic data network, deep blue, wireframe nodes, dark',
      'AI neural network visualization, electric blue purple, abstract tech',
      'quantum computer chip close-up, microscopic, metallic blue, dramatic light',
      'server room corridor, electric blue light, reflective floor, cinematic dark',
    ],
    pixabay: ['technology computer abstract digital', 'circuit board electronic', 'data network blue', 'artificial intelligence tech', 'server datacenter'],
  },
  '라이프스타일': {
    poll: [
      'elegant minimal lifestyle flat lay, warm golden bokeh, pastel cozy morning',
      'cozy cafe corner, warm espresso tones, soft bokeh, lifestyle aesthetic',
      'luxury apartment interior, golden hour light, modern minimal, warm',
      'rooftop garden at sunset, urban lifestyle, warm tones, atmospheric',
      'artisan coffee workshop, warm brown tones, steam, craftsman aesthetic',
    ],
    pixabay: ['lifestyle minimal cozy aesthetic', 'cafe coffee lifestyle', 'interior design home', 'rooftop urban lifestyle', 'food artisan minimal'],
  },
  '교육/학습': {
    poll: [
      'grand library interior, towering bookshelves, golden light rays, warm amber',
      'university lecture hall, dramatic perspective, architectural, soft light',
      'open book with glowing pages, magical knowledge concept, dark background',
      'chalkboard with equations, vintage school aesthetic, warm light, nostalgic',
      'ancient library with floating books, fantasy study, amber glow, ethereal',
    ],
    pixabay: ['books library education study', 'university lecture hall', 'reading knowledge learning', 'classroom school education', 'books knowledge concept'],
  },
  '마케팅/SNS': {
    poll: [
      'vibrant social media aesthetic, pink coral magenta, bold geometric shapes',
      'colorful gradient studio backdrop, trendy neon colors, dynamic composition',
      'influencer lifestyle flat lay, vibrant colors, modern design, bold',
      'abstract pop art background, bright yellow pink, bold graphic design',
      'neon sign city night, vibrant colors, urban street style, trendy',
    ],
    pixabay: ['social media marketing colorful', 'influencer content creator', 'colorful gradient design', 'neon urban street', 'bold graphic design'],
  },
  '뉴스/시사': {
    poll: [
      'dramatic editorial dark studio, navy charcoal, spotlight moody cinematic',
      'newspaper printing press, vintage industrial, warm sepia tones, dramatic',
      'breaking news desk, cinematic blue cold light, professional broadcast',
      'global map with light connections, dark world, geopolitical concept',
      'protest rally silhouettes, dramatic sky, high contrast, photojournalism',
    ],
    pixabay: ['newspaper journalism editorial', 'press media news broadcast', 'world map global news', 'politics government news', 'documentary photojournalism'],
  },
  '자기계발': {
    poll: [
      'epic sunrise mountain peaks, golden hour, lone silhouette, motivational',
      'winding road to bright horizon, inspirational journey, warm dawn colors',
      'hot air balloon over misty valley, adventure freedom, golden light',
      'staircase ascending into clouds, achievement concept, heavenly light',
      'lone figure on cliff overlooking vast ocean, success perspective, dramatic',
    ],
    pixabay: ['motivation sunrise mountain success', 'road journey horizon inspire', 'hot air balloon adventure', 'achievement goal success', 'leadership vision perspective'],
  },
};

// 하위 호환성 유지 (기존 코드 참조용)
export const CATEGORY_STYLE: Record<string, { poll: string; pixabay: string }> = Object.fromEntries(
  Object.entries(CATEGORY_STYLES).map(([k, v]) => [k, { poll: v.poll[0], pixabay: v.pixabay[0] }])
);

export const CATEGORY_EMOJI: Record<string, string> = {
  '비즈니스/경제':'💼','건강/웰빙':'🧘','기술/IT':'💻','라이프스타일':'✨',
  '교육/학습':'📚','마케팅/SNS':'📱','뉴스/시사':'📰','자기계발':'🚀',
};

export const CATEGORY_COLOR: Record<string, string> = {
  '비즈니스/경제':'#6366f1','건강/웰빙':'#10b981','기술/IT':'#8b5cf6',
  '라이프스타일':'#ec4899','교육/학습':'#f59e0b','마케팅/SNS':'#f43f5e',
  '뉴스/시사':'#ef4444','자기계발':'#6366f1',
};

export const VALID_CATEGORIES = [
  '비즈니스/경제','건강/웰빙','기술/IT','라이프스타일',
  '교육/학습','마케팅/SNS','뉴스/시사','자기계발',
];

export const CANVA_TEMPLATES: CanvaTemplate[] = [
  {
    name: 'Midnight Blue',
    bg: 'linear-gradient(145deg,#0a0e27 0%,#1a1f4e 50%,#0d1535 100%)',
    accent: '#4f8ef7',
    shapes: [
      { type:'circle', w:320, h:320, x:-80, y:-80, color:'rgba(79,142,247,0.12)' },
      { type:'circle', w:200, h:200, x:'70%', y:'60%', color:'rgba(100,120,255,0.1)' },
      { type:'rect', w:180, h:180, x:'60%', y:-40, color:'rgba(255,255,255,0.03)', rotate:45 },
    ],
    textColor: '#ffffff', subColor: 'rgba(255,255,255,0.6)',
  },
  {
    name: 'Sunset Coral',
    bg: 'linear-gradient(135deg,#1a0533 0%,#6b1a3a 40%,#c4462a 100%)',
    accent: '#ff8c5a',
    shapes: [
      { type:'circle', w:400, h:400, x:'50%', y:-100, color:'rgba(255,140,90,0.15)' },
      { type:'circle', w:150, h:150, x:-30, y:'60%', color:'rgba(255,70,100,0.12)' },
      { type:'line-h', x:0, y:'75%', color:'rgba(255,255,255,0.06)' },
    ],
    textColor: '#ffffff', subColor: 'rgba(255,220,200,0.7)',
  },
  {
    name: 'Forest Deep',
    bg: 'linear-gradient(160deg,#071a0e 0%,#0d3320 50%,#1a5c35 100%)',
    accent: '#4ecb71',
    shapes: [
      { type:'tri', x:'80%', y:'-10%', color:'rgba(78,203,113,0.1)' },
      { type:'tri', x:'10%', y:'70%', color:'rgba(78,203,113,0.07)' },
      { type:'circle', w:250, h:250, x:'30%', y:'30%', color:'rgba(20,180,80,0.08)' },
    ],
    textColor: '#ffffff', subColor: 'rgba(160,255,190,0.65)',
  },
  {
    name: 'Rose Gold',
    bg: 'linear-gradient(135deg,#1a0a10 0%,#3d1525 50%,#6b2340 100%)',
    accent: '#e8a87c',
    shapes: [
      { type:'circle', w:350, h:350, x:'60%', y:-60, color:'rgba(232,168,124,0.12)' },
      { type:'rect', w:100, h:100, x:'15%', y:'75%', color:'rgba(255,200,160,0.07)', rotate:30 },
      { type:'rect', w:60, h:60, x:'80%', y:'65%', color:'rgba(255,200,160,0.08)', rotate:15 },
    ],
    textColor: '#ffffff', subColor: 'rgba(255,210,180,0.65)',
  },
  {
    name: 'Ocean Depth',
    bg: 'linear-gradient(160deg,#020d1a 0%,#073a5a 50%,#0a6680 100%)',
    accent: '#00d4ff',
    shapes: [
      { type:'wave', y:'60%', color:'rgba(0,212,255,0.07)' },
      { type:'wave', y:'80%', color:'rgba(0,212,255,0.05)' },
      { type:'circle', w:280, h:280, x:'70%', y:-50, color:'rgba(0,180,255,0.1)' },
    ],
    textColor: '#ffffff', subColor: 'rgba(150,230,255,0.65)',
  },
  {
    name: 'Neon Purple',
    bg: 'linear-gradient(145deg,#06000f 0%,#1a0535 50%,#2d0a55 100%)',
    accent: '#b44fff',
    shapes: [
      { type:'circle', w:300, h:300, x:-60, y:-60, color:'rgba(180,79,255,0.15)' },
      { type:'circle', w:200, h:200, x:'65%', y:'55%', color:'rgba(100,0,255,0.12)' },
      { type:'grid', color:'rgba(180,79,255,0.05)' },
    ],
    textColor: '#ffffff', subColor: 'rgba(220,170,255,0.7)',
  },
  {
    name: 'Golden Hour',
    bg: 'linear-gradient(150deg,#12080a 0%,#3d1a00 50%,#7a3d00 100%)',
    accent: '#ffc442',
    shapes: [
      { type:'circle', w:400, h:400, x:'40%', y:-100, color:'rgba(255,196,66,0.12)' },
      { type:'circle', w:150, h:150, x:-20, y:'50%', color:'rgba(255,150,0,0.1)' },
      { type:'rect', w:200, h:2, x:0, y:'72%', color:'rgba(255,196,66,0.15)', rotate:0 },
    ],
    textColor: '#ffffff', subColor: 'rgba(255,220,150,0.7)',
  },
  {
    name: 'Arctic Mint',
    bg: 'linear-gradient(135deg,#020f14 0%,#062630 50%,#0c4040 100%)',
    accent: '#50e3c2',
    shapes: [
      { type:'hex', x:'75%', y:'10%', color:'rgba(80,227,194,0.1)' },
      { type:'hex', x:'10%', y:'65%', color:'rgba(80,227,194,0.07)' },
      { type:'circle', w:220, h:220, x:'55%', y:'50%', color:'rgba(0,200,180,0.09)' },
    ],
    textColor: '#ffffff', subColor: 'rgba(160,255,230,0.65)',
  },
];

export const BG_THEMES: Record<string, Array<{bg:string;overlay:string}>> = {
  '비즈니스/경제': [
    {bg:'linear-gradient(135deg,#0c0c1d,#1a1a3e,#2d1b69)',overlay:'radial-gradient(ellipse at 30% 20%,rgba(108,92,231,0.3),transparent 60%)'},
    {bg:'linear-gradient(160deg,#0d1117,#161b22,#1f2937)',overlay:'radial-gradient(circle at 70% 80%,rgba(56,189,248,0.2),transparent 50%)'},
  ],
  '건강/웰빙': [
    {bg:'linear-gradient(135deg,#0a1628,#0d2137,#134e4a)',overlay:'radial-gradient(ellipse at 40% 30%,rgba(16,185,129,0.3),transparent 60%)'},
  ],
  '기술/IT': [
    {bg:'linear-gradient(135deg,#0a0a1a,#1e1b4b,#312e81)',overlay:'radial-gradient(ellipse at 50% 50%,rgba(139,92,246,0.25),transparent 60%)'},
  ],
  '라이프스타일': [
    {bg:'linear-gradient(135deg,#1a1320,#2d1f3d,#4a2c6e)',overlay:'radial-gradient(ellipse at 40% 40%,rgba(236,72,153,0.25),transparent 60%)'},
  ],
  '교육/학습': [
    {bg:'linear-gradient(135deg,#0c1220,#1e293b,#334155)',overlay:'radial-gradient(ellipse at 50% 30%,rgba(251,191,36,0.2),transparent 60%)'},
  ],
  '마케팅/SNS': [
    {bg:'linear-gradient(135deg,#1a0a14,#4a1942,#7c2d6e)',overlay:'radial-gradient(ellipse at 60% 40%,rgba(244,114,182,0.3),transparent 60%)'},
  ],
  '뉴스/시사': [
    {bg:'linear-gradient(135deg,#111827,#1f2937,#374151)',overlay:'radial-gradient(ellipse at 50% 40%,rgba(239,68,68,0.2),transparent 60%)'},
  ],
  '자기계발': [
    {bg:'linear-gradient(135deg,#0c0a1d,#1e1545,#312e81)',overlay:'radial-gradient(ellipse at 50% 50%,rgba(251,191,36,0.2),transparent 60%)'},
  ],
};
