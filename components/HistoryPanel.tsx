'use client';

import { useEffect, useState } from 'react';
import { CardNews } from '@/types';
import { loadCardNewsList, deleteCardNews } from '@/lib/firestore';
import { useAuth } from '@/lib/AuthContext';
import CardRenderer from './CardRenderer';

interface HistoryPanelProps {
  onClose: () => void;
  onLoad: (data: CardNews) => void;
}

export default function HistoryPanel({ onClose, onLoad }: HistoryPanelProps) {
  const { user } = useAuth();
  const [list, setList]     = useState<CardNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    loadCardNewsList(user.uid)
      .then(setList)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('이 카드뉴스를 삭제할까요?')) return;
    try {
      await deleteCardNews(id);
      setList(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert(`삭제 실패: ${e.message}`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>📋 카드뉴스 히스토리</h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '6px 12px' }}>✕</button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner" style={{ margin: '0 auto', width: 28, height: 28 }} />
          </div>
        )}
        {error && <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>}
        {!loading && list.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', padding: 40 }}>
            저장된 카드뉴스가 없습니다
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(item => {
            const cover = item.cards[0];
            return (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                {/* Thumbnail */}
                <div style={{ flexShrink: 0, borderRadius: 6, overflow: 'hidden' }}>
                  <CardRenderer
                    card={cover}
                    imageUrl={item.cardImages[cover.id]}
                    category={item.category}
                    format="1:1"
                    width={72}
                  />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cover.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                    {item.category} · {item.cards.length}장 ·{' '}
                    {new Date(item.savedAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-primary" onClick={() => { onLoad(item); onClose(); }} style={{ fontSize: 13, padding: '6px 14px' }}>
                    불러오기
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(item.id!)} style={{ fontSize: 13 }}>
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
