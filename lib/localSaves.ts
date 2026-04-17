import { CardNews } from '@/types';

const LS_KEY = 'cardnews_library';
const MAX_SAVES = 10;

export function getLocalSaves(): CardNews[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addLocalSave(data: Omit<CardNews, 'id' | 'uid'>): string {
  const saves = getLocalSaves();
  const id = `local_${Date.now()}`;
  const newSave: CardNews = { ...data, id, savedAt: Date.now() };
  const updated = [newSave, ...saves].slice(0, MAX_SAVES);
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
  return id;
}

export function deleteLocalSave(id: string): void {
  const saves = getLocalSaves().filter(s => s.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(saves));
}
