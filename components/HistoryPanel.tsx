'use client';

import { useEffect, useState } from 'react';
import { CardNews } from '@/types';
import { loadCardNewsList, deleteCardNews } from '@/lib/firestore';
import { getLocalSaves, deleteLocalSave } from '@/lib/localSaves';
import { useAuth } from '@/lib/AuthContext';
import CardRenderer from './CardRenderer';

interface HistoryPanelProps {
  onClose: () => void;
  onLoad: (data: CardNews) => void;
}

export default function HistoryPanel({ onClose, onLoad }: HistoryPanelProps) {
  const { user } = useAuth();
  const [cloudList, setCloudList] = useState<CardNews[]>([]);
  const [localList, setLocalList] = useState<CardNews[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [tab, setTab]             = useState<'local' | 'cloud'>('local');

  // Load local saves immediately
  useEffect(() => {
    setLocalList(getLocalSaves());
  }, []);

  // Load cloud saves when user is logged in
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    loadCardNewsList(user.uid)
      .then(setCloudList)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  // Switch to cloud tab if user is logged in and there's no local saves
  useEffect(() => {
    if (user && localList.length === 0 && cloudList.length > 0) {
      setTab('cloud');
    }
  }, [user, localList.length, cloudList.length]);

  const handleDeleteLocal = (id: string) => {
    deleteLocalSave(id);
    setLocalList(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteCloud = async (id: string) => {
    if (!confirm('이 카드뉴스를 삭제할까요?')) return;
    try {
      await deleteCardNews(id);
      setCloudList(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert(`삭제 실패: ${e.message}`);
    }
  };

  const tabStyle = (active: boolean) => ({
    flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400,
    background: active ? 'rgba(108,99,255,0.2)' : 'transparent',
    color: active ? '#a78bfa' : 'rgba(255,255,255,0.45)',
    border: active ? '1px solid rgba(108,99,255,0.35)' : '1px solid transparent',
    cursor: 'pointer', transition: 'all .15s',
  });

  const currentList = tab === 'local' ? localList : cloudList;

  const renderItem = (item: CardNews, isCloud: boolean) => {
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
          {!isCloud && (
            <div style={{ fontSize: 11, color: 'rgba(108,99,255,0.6)', marginTop: 2 }}>📱 내 기기 저장</div>
          )}
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary" onClick={() => { onLoad(item); onClose(); }} style={{ fontSize: 13, padding: '6px 14px' }}>
            불러오기
          </button>
          <button
            onClick={() => isCloud ? handleDeleteCloud(item.id!) : handleDeleteLocal(item.id!)}
            style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#ef4444', cursor: 'pointer',
            }}
          >
            삭제
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>📚 내 보관함</h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '6px 12px' }}>✕</button>
        </div>

        {/* Tab toggle */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10 }}>
          <button style={tabStyle(tab === 'local') as React.CSSProperties} onClick={() => setTab('local')}>
            💾 로컬 보관함 {localList.length > 0 && `(${localList.length})`}
          </button>
          <button style={tabStyle(tab === 'cloud') as React.CSSProperties} onClick={() => setTab('cloud')}>
            ☁️ 클라우드 {!user ? '(로그인 필요)' : cloudList.length > 0 ? `(${cloudList.length})` : ''}
          </button>
        </div>

        {/* Cloud tab - not logged in */}
        {tab === 'cloud' && !user && (
          <div style={{
            textAlign: 'center', padding: '32px 20px',
            background: 'rgba(108,99,255,0.06)', borderRadius: 12,
            border: '1px solid rgba(108,99,255,0.15)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>☁️</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Google 로그인이 필요해요</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
              로그인하면 여러 기기에서 카드뉴스를 불러올 수 있어요
            </div>
          </div>
        )}

        {/* Loading spinner */}
        {tab === 'cloud' && user && loading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner" style={{ margin: '0 auto', width: 28, height: 28 }} />
          </div>
        )}

        {/* Error */}
        {error && <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>}

        {/* Empty state */}
        {!loading && currentList.length === 0 && (tab === 'local' || user) && (
          <div style={{ textAlign: 'center', padding: '32px 20px', color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
            {tab === 'local'
              ? '로컬에 저장된 카드뉴스가 없어요\n내보내기 화면에서 "보관함에 저장"을 눌러보세요'
              : '클라우드에 저장된 카드뉴스가 없습니다'}
          </div>
        )}

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentList.map(item => renderItem(item, tab === 'cloud'))}
        </div>
      </div>
    </div>
  );
}
