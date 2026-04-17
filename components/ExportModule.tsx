'use client';

import { useRef, useState } from 'react';
import { Card } from '@/types';
import CardRenderer from './CardRenderer';
import { addLocalSave } from '@/lib/localSaves';

interface ExportModuleProps {
  cards: Card[];
  cardImages: Record<string, string>;
  category: string;
  format: string;
  text: string;
  onBack: () => void;
  onNewProject: () => void;
  onSaveToCloud?: () => void;
  isSaving?: boolean;
  saveMsg?: string;
  isLoggedIn?: boolean;
}

export default function ExportModule({
  cards, cardImages, category, format, text,
  onBack, onNewProject,
  onSaveToCloud, isSaving, saveMsg, isLoggedIn,
}: ExportModuleProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [localSaveMsg, setLocalSaveMsg] = useState('');

  const isPortrait = format === '9:16';
  const previewW   = isPortrait ? 300 : 420;

  function handleLocalSave() {
    try {
      addLocalSave({ category, cards, cardImages, text, savedAt: Date.now() });
      setLocalSaveMsg('💾 보관함에 저장됨');
      setTimeout(() => setLocalSaveMsg(''), 2500);
    } catch {
      setLocalSaveMsg('❌ 저장 실패');
      setTimeout(() => setLocalSaveMsg(''), 2500);
    }
  }

  async function downloadAll() {
    setDownloading(true);
    setExportStatus('html2canvas 로딩 중...');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const JSZip       = (await import('jszip')).default;
      const zip = new JSZip();
      const folder = zip.folder('cards')!;

      for (let i = 0; i < cards.length; i++) {
        const el = document.getElementById(`export-card-${i}`);
        if (!el) continue;
        setExportStatus(`${i + 1}/${cards.length} 캡처 중...`);
        const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: null });
        const blob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), 'image/png'));
        const fname = `card_${String(i + 1).padStart(2, '0')}_${cards[i].type}.png`;
        folder.file(fname, blob);
      }

      setExportStatus('ZIP 압축 중...');
      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `카드뉴스_${category}_${Date.now()}.zip`;
      a.click();
      setExportStatus('✅ 다운로드 완료');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (e: any) {
      setExportStatus(`❌ 오류: ${e.message}`);
    } finally {
      setDownloading(false);
    }
  }

  async function downloadCurrent() {
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = document.getElementById(`export-card-${currentIdx}`);
      if (!el) return;
      const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: null });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `card_${String(currentIdx + 1).padStart(2, '0')}.png`;
      a.click();
    } catch (e: any) {
      alert(`오류: ${e.message}`);
    } finally {
      setDownloading(false);
    }
  }

  const cardW = isPortrait ? 220 : 280;

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <button className="btn-ghost" onClick={onBack}>← 편집으로</button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn-ghost" onClick={onNewProject}>🆕 새 프로젝트</button>
          <button className="btn-ghost" onClick={downloadCurrent} disabled={downloading}>
            📥 현재 카드 저장
          </button>
          <button className="btn-primary" onClick={downloadAll} disabled={downloading}>
            {downloading ? (
              <><span className="spinner" style={{ width: 14, height: 14, verticalAlign: 'middle', marginRight: 6 }} />처리 중...</>
            ) : '📦 전체 ZIP 다운로드'}
          </button>
        </div>
      </div>

      {/* Save to library banner */}
      <div style={{
        background: 'rgba(108,99,255,0.07)',
        border: '1px solid rgba(108,99,255,0.18)',
        borderRadius: 12,
        padding: '14px 18px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>📚</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>나중에 다시 보고 싶다면 저장하세요</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {isLoggedIn ? '로컬 보관함 또는 클라우드에 저장할 수 있어요' : '로컬 보관함에 저장 · 로그인하면 클라우드도 사용 가능'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {(localSaveMsg || saveMsg) && (
            <span style={{ fontSize: 13, color: '#10b981' }}>{localSaveMsg || saveMsg}</span>
          )}
          <button
            onClick={handleLocalSave}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.35)',
              color: '#a78bfa', cursor: 'pointer', transition: 'all .15s',
            }}
          >
            💾 보관함에 저장
          </button>
          {isLoggedIn && onSaveToCloud && (
            <button
              onClick={onSaveToCloud}
              disabled={isSaving}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                color: '#10b981', cursor: isSaving ? 'not-allowed' : 'pointer', transition: 'all .15s',
              }}
            >
              {isSaving ? '저장 중...' : '☁️ 클라우드 저장'}
            </button>
          )}
        </div>
      </div>

      {exportStatus && (
        <div style={{
          background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: 8, padding: '8px 14px', fontSize: 13,
          marginBottom: 16, color: '#a78bfa',
        }}>
          {exportStatus}
        </div>
      )}

      {/* Main preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div id={`export-preview`}>
            <CardRenderer
              card={cards[currentIdx]}
              imageUrl={cardImages[cards[currentIdx].id]}
              category={category}
              format={format}
              width={previewW}
              id={`export-card-${currentIdx}`}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn-ghost"
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              style={{ padding: '6px 14px' }}
            >‹</button>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              {currentIdx + 1} / {cards.length}
            </span>
            <button
              className="btn-ghost"
              onClick={() => setCurrentIdx(i => Math.min(cards.length - 1, i + 1))}
              disabled={currentIdx === cards.length - 1}
              style={{ padding: '6px 14px' }}
            >›</button>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 560, overflowY: 'auto' }}>
          {cards.map((card, i) => (
            <div
              key={card.id}
              onClick={() => setCurrentIdx(i)}
              style={{
                cursor: 'pointer', borderRadius: 8, overflow: 'hidden',
                border: `2px solid ${currentIdx === i ? '#6c63ff' : 'rgba(255,255,255,0.08)'}`,
                transition: 'border-color .15s',
                opacity: currentIdx === i ? 1 : 0.7,
              }}
            >
              <CardRenderer
                card={card}
                imageUrl={cardImages[card.id]}
                category={category}
                format={format}
                width={cardW}
                id={`export-card-${i}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
