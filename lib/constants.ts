import { CanvaTemplate } from '@/types';

export const CATEGORY_STYLE: Record<string, { poll: string; pixabay: string }> = {
  '비즈니스/경제': { poll: 'modern corporate city skyline at night, blue indigo, glass buildings', pixabay: 'business finance city night' },
  '건강/웰빙':     { poll: 'serene nature landscape, soft green light, misty mountains, zen',      pixabay: 'nature wellness meditation yoga' },
  '기술/IT':       { poll: 'futuristic digital circuit, neon cyan purple, cyberpunk abstract',     pixabay: 'technology computer abstract digital' },
  '라이프스타일':  { poll: 'elegant minimal lifestyle, warm golden bokeh, pastel cozy',            pixabay: 'lifestyle minimal cozy aesthetic' },
  '교육/학습':     { poll: 'library interior, books golden light rays, warm amber',                pixabay: 'books library education study' },
  '마케팅/SNS':    { poll: 'vibrant social media aesthetic, pink coral magenta, bold shapes',      pixabay: 'social media marketing colorful' },
  '뉴스/시사':     { poll: 'dramatic editorial dark, navy charcoal, spotlight moody cinematic',    pixabay: 'newspaper journalism editorial' },
  '자기계발':      { poll: 'epic sunrise mountain peaks, golden hour, silhouette motivational',    pixabay: 'motivation sunrise mountain success' },
};

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
