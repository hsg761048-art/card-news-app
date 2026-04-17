export type CardType = 'cover' | 'content' | 'end';
export type ImgSource = 'pollinations' | 'pixabay' | 'canva';
export type InputType = 'keyword' | 'text' | 'url' | 'file';
export type Step = 'input' | 'processing' | 'editor' | 'export';

export interface Card {
  id: string;
  type: CardType;
  title: string;
  subtitle: string;
  body: string;
}

export interface CardNews {
  id?: string;
  category: string;
  cards: Card[];
  cardImages: Record<string, string>;
  text: string;
  savedAt: number;
  uid?: string;
}

export interface InputData {
  type: InputType;
  data: string;
}

export interface ProcessedData {
  text: string;
  category: string;
  cards: Card[];
  cardImages: Record<string, string>;
}

export interface CanvaTemplate {
  name: string;
  bg: string;
  accent: string;
  shapes: CanvaShape[];
  textColor: string;
  subColor: string;
}

export interface CanvaShape {
  type: 'circle' | 'rect' | 'tri' | 'wave' | 'grid' | 'hex' | 'line-h';
  x?: number | string;
  y?: number | string;
  w?: number;
  h?: number;
  color: string;
  rotate?: number;
  blur?: number;
}
