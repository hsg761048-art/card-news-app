'use client';

import { useState, useCallback } from 'react';
import { Card, ImgSource } from '@/types';
import CardRenderer from './CardRenderer';

interface CardEditorProps {
  cards: Card[];
  cardImages: Record<string, string>;
  category: string;
  format: string;
  imgSource: ImgSource;
  onCardsChange: (cards: Card[]) => void;
  onFormatChange: (fmt: string) => void;
  onNext: () => void;
  onBack: () => void;
  isSaving?: boolean;
  onSaveToCloud?: () => void;
  saveMsg?: string;
}

export default function CardEditor({
  cards, cardImages, category, format, imgSource,
  onCardsChange, onFormatChange, onNext, onBack,
  isSaving, onSaveToCloud, saveMsg,
}: CardEditorProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const selected = cards[selectedIdx];
  const previewCard = cards[currentPage] ?? cards[0];
  const isPortrait = format === '9:16';
  const previewW = isPortrait ? 280 : 380;

  const updateCard = useCallback((idx: number, patch: Partial<Card>) => {
    onCardsChange(cards.map((c, i) => i === idx ? { ...c, ...patch } : c));
  }, [cards, onCardsChange]);

  const deleteCard = (idx: number) => {
    if (cards.length <= 2) return;
    const arr = cards.filter((_, i) => i !== idx);
    onCardsChange(arr);
    setSelectedIdx(Math.min(idx, arr.length - 1));
    setCurrentPage(Math.min(currentPage, arr.length - 1));
  };

  const addCard = () => {
    const newCard: Card = { id: `content-${Date.now()}`, type: 'content', title: '새 슬라이드', subtitle: '', body: '내용을 입력하세요' };
    const insertAt = Math.max(0, cards.length - 1);
    const arr = [...cards.slice(0, insertAt), newCard, ...cards.slice(insertAt)];
    onCardsChange(arr);
    setSelectedIdx(insertAt);
    setCurrentPage(insertAt);
  };

  const formatBtn = (fmt: string, icon: string, label: string) => (
    <button onClick={() => onFormatChange(fmt)} style={{
      flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      background: format === fmt ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.04)',
      color: format === fmt ? '#a78bfa' : 'rgba(255,255,255,0.5)',
      border: format === fmt ? '1px solid rgba(108,99,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
      cursor: 'pointer', transition: 'all .15s',
    }}>
      <span>{icon}</span><span>{label}</span>
    </button>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, minHeight: 600 }}>
      {/* LEFT: slide list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Category + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#a78bfa' }}>
            🚀 {category}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{cards.length}장</div>
        </div>

        {/* Format toggle */}
        <div style={{ display: 'flex', gap: 6 }}>
          {formatBtn('1:1', '■', '1:1 정사각형')}
          {formatBtn('9:16', '▬', '9:16 세로형')}
        </div>

        {/* Slide list */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>슬라이드 목록</span>
            <button onClick={addCard} style={{ fontSize: 12, color: '#6c63ff', background: 'transparent', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>+ 추가</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 420, overflowY: 'auto' }}>
            {cards.map((card, i) => (
              <div key={card.id} onClick={() => { setSelectedIdx(i); setCurrentPage(i); }} style={{
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                background: selectedIdx === i ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedIdx === i ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                position: 'relative', transition: 'all .15s',
              }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>
                  {card.type === 'cover' ? '표지' : card.type === 'end' ? '마무리' : `슬라이드 ${i}`}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {card.title}
                </div>
                {card.type === 'content' && (
                  <button onClick={e => { e.stopPropagation(); deleteCard(i); }} style={{
                    position: 'absolute', top: 6, right: 6,
                    background: 'transparent', color: 'rgba(239,68,68,0.5)', fontSize: 13,
                    border: 'none', cursor: 'pointer', padding: '0 4px',
                  }}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Edit fields for selected */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: 600 }}>
            ✏️ 슬라이드 {selectedIdx + 1} 편집
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="text" value={selected.title} onChange={e => updateCard(selectedIdx, { title: e.target.value })}
              placeholder="제목" style={{ fontSize: 13, padding: '8px 10px' }} />
            {selected.type !== 'cover' && (
              <textarea value={selected.body} onChange={e => updateCard(selectedIdx, { body: e.target.value })}
                rows={3} placeholder="본문" style={{ fontSize: 12, padding: '8px 10px', resize: 'none' }} />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: preview */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Top bar */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {saveMsg && <span style={{ fontSize: 13, color: '#10b981' }}>{saveMsg}</span>}
            {onSaveToCloud && (
              <button className="btn-ghost" onClick={onSaveToCloud} disabled={isSaving} style={{ fontSize: 13 }}>
                {isSaving ? '저장 중...' : '☁️ 저장'}
              </button>
            )}
          </div>
          <button className="btn-primary" onClick={onNext} style={{ padding: '9px 22px' }}>
            🚀 내보내기
          </button>
        </div>

        {/* Page nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', minWidth: 50, textAlign: 'center' }}>
            {currentPage + 1} / {cards.length}
          </span>
          <button onClick={() => setCurrentPage(p => Math.min(cards.length - 1, p + 1))} disabled={currentPage === cards.length - 1}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>

        {/* Card preview */}
        <CardRenderer card={previewCard} imageUrl={cardImages[previewCard.id]} category={category} format={format} width={previewW} />

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 6 }}>
          {cards.map((_, i) => (
            <div key={i} onClick={() => setCurrentPage(i)} style={{
              width: currentPage === i ? 20 : 7, height: 7, borderRadius: 99,
              background: currentPage === i ? '#6c63ff' : 'rgba(255,255,255,0.15)',
              cursor: 'pointer', transition: 'all .2s',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
