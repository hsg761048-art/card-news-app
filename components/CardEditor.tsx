'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, ImgSource } from '@/types';
import CardRenderer from './CardRenderer';

interface CardEditorProps {
  cards: Card[];
  cardImages: Record<string, string>;
  category: string;
  format: string;
  imgSource: ImgSource;
  onCardsChange: (cards: Card[]) => void;
  onNext: () => void;
  onBack: () => void;
  isSaving?: boolean;
  onSaveToCloud?: () => void;
  saveMsg?: string;
}

export default function CardEditor({
  cards, cardImages, category, format, imgSource,
  onCardsChange, onNext, onBack,
  isSaving, onSaveToCloud, saveMsg,
}: CardEditorProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [editingField, setEditingField] = useState<'title' | 'subtitle' | 'body' | null>(null);

  const selected = cards[selectedIdx];

  const updateCard = useCallback((idx: number, patch: Partial<Card>) => {
    const updated = cards.map((c, i) => i === idx ? { ...c, ...patch } : c);
    onCardsChange(updated);
  }, [cards, onCardsChange]);

  const moveCard = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= cards.length) return;
    const arr = [...cards];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    onCardsChange(arr);
    setSelectedIdx(next);
  };

  const deleteCard = (idx: number) => {
    if (cards.length <= 2) return;
    const arr = cards.filter((_, i) => i !== idx);
    onCardsChange(arr);
    setSelectedIdx(Math.min(idx, arr.length - 1));
  };

  const addCard = () => {
    const newCard: Card = {
      id: `content-${Date.now()}`,
      type: 'content',
      title: '새 슬라이드',
      subtitle: '',
      body: '내용을 입력하세요',
    };
    const insertAt = Math.max(0, cards.length - 1);
    const arr = [...cards.slice(0, insertAt), newCard, ...cards.slice(insertAt)];
    onCardsChange(arr);
    setSelectedIdx(insertAt);
  };

  const cardW = 260;
  const cardH = format === '9:16' ? Math.round(cardW * 16 / 9) : cardW;

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <button className="btn-ghost" onClick={onBack}>← 다시 생성</button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saveMsg && <span style={{ fontSize: 13, color: '#10b981' }}>{saveMsg}</span>}
          {onSaveToCloud && (
            <button className="btn-ghost" onClick={onSaveToCloud} disabled={isSaving} style={{ fontSize: 13 }}>
              {isSaving ? <><span className="spinner" style={{ width: 14, height: 14, marginRight: 6, verticalAlign: 'middle' }} />저장 중...</> : '☁️ 클라우드 저장'}
            </button>
          )}
          <button className="btn-primary" onClick={onNext}>내보내기 →</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Thumbnail strip + selected preview */}
        <div>
          {/* Thumbnail list */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            maxHeight: 480, overflowY: 'auto', paddingRight: 4,
          }}>
            {cards.map((card, i) => (
              <div
                key={card.id}
                onClick={() => setSelectedIdx(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                  background: selectedIdx === i ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedIdx === i ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all .15s',
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <CardRenderer card={card} imageUrl={cardImages[card.id]} category={category} format={format} width={72} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
                    {i + 1}. {card.type === 'cover' ? '표지' : card.type === 'end' ? '마무리' : '내용'}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {card.title}
                  </div>
                </div>
                {/* Controls */}
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  <button onClick={e => { e.stopPropagation(); moveCard(i, -1); }}
                    style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 14, padding: '2px 4px', borderRadius: 4 }}>↑</button>
                  <button onClick={e => { e.stopPropagation(); moveCard(i, 1); }}
                    style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 14, padding: '2px 4px', borderRadius: 4 }}>↓</button>
                  <button onClick={e => { e.stopPropagation(); deleteCard(i); }}
                    style={{ background: 'transparent', color: 'rgba(239,68,68,0.6)', fontSize: 14, padding: '2px 4px', borderRadius: 4 }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-ghost"
            onClick={addCard}
            style={{ width: '100%', marginTop: 10, fontSize: 13 }}
          >
            + 슬라이드 추가
          </button>
        </div>

        {/* Edit panel */}
        <div>
          {/* Preview */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <CardRenderer
              card={selected}
              imageUrl={cardImages[selected.id]}
              category={category}
              format={format}
              width={cardW}
            />
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>제목</label>
              <input
                type="text"
                value={selected.title}
                onChange={e => updateCard(selectedIdx, { title: e.target.value })}
                onFocus={() => setEditingField('title')}
                onBlur={() => setEditingField(null)}
              />
            </div>
            {selected.type !== 'content' && (
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>부제목</label>
                <input
                  type="text"
                  value={selected.subtitle}
                  onChange={e => updateCard(selectedIdx, { subtitle: e.target.value })}
                />
              </div>
            )}
            {selected.type !== 'cover' && (
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>본문</label>
                <textarea
                  value={selected.body}
                  onChange={e => updateCard(selectedIdx, { body: e.target.value })}
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
