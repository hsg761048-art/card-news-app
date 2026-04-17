'use client';

import { useState, useRef } from 'react';
import { InputType, ImgSource, CardNews } from '@/types';

interface InputModuleProps {
  onSubmit: (type: InputType, data: string) => void;
  imgSource: ImgSource;
  setImgSource: (src: ImgSource) => void;
  pixabayKey: string;
  setPixabayKey: (k: string) => void;
  savedSession: CardNews | null;
  onLoadSession: () => void;
  onDeleteSession: () => void;
}

export default function InputModule({
  onSubmit, imgSource, setImgSource, pixabayKey, setPixabayKey,
  savedSession, onLoadSession, onDeleteSession,
}: InputModuleProps) {
  const [inputType, setInputType] = useState<InputType>('keyword');
  const [inputData, setInputData] = useState('');
  const [fileName, setFileName]   = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setInputData(ev.target?.result as string ?? '');
    reader.readAsText(file, 'UTF-8');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim()) return;
    onSubmit(inputType, inputData.trim());
  };

  const tabs: { key: InputType; icon: string; label: string }[] = [
    { key: 'keyword', icon: '🔑', label: '키워드' },
    { key: 'text',    icon: '📝', label: '텍스트' },
    { key: 'url',     icon: '🔗', label: 'URL' },
    { key: 'file',    icon: '📄', label: '파일' },
  ];

  const tabStyle = (active: boolean) => ({
    flex: 1,
    padding: '10px 0',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    background: active ? 'rgba(108,99,255,0.2)' : 'transparent',
    color: active ? '#a78bfa' : 'rgba(255,255,255,0.45)',
    border: active ? '1px solid rgba(108,99,255,0.35)' : '1px solid transparent',
    cursor: 'pointer',
    transition: 'all .15s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  });

  const isDisabled = !inputData.trim() || (imgSource === 'pixabay' && !pixabayKey.trim());

  return (
    <div>
      {/* Page header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10,
          background: 'linear-gradient(135deg,#fff 30%,#a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          카드뉴스를 만들어 보세요
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>
          어떤 주제든 Gemini AI가 분석하고 감각적인 카드뉴스로 자동 변환합니다
        </p>
      </div>

      {/* Resume banner */}
      {savedSession && (
        <div style={{
          background: 'rgba(30,30,60,0.8)',
          border: '1px solid rgba(108,99,255,0.2)',
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
            <span style={{ fontSize: 20 }}>💾</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>이전에 만든 카드뉴스가 있어요</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                🚀 {savedSession.category} · {savedSession.cards.length}장 ·{' '}
                {new Date(savedSession.savedAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 저장
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={onDeleteSession} style={{ padding: '7px 14px', fontSize: 13 }}>
              🗑️ 삭제
            </button>
            <button className="btn-primary" onClick={onLoadSession} style={{ padding: '7px 16px', fontSize: 13 }}>
              이어서 편집 →
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 24 }}>
        {/* Input type tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {tabs.map(t => (
            <button key={t.key} style={tabStyle(inputType === t.key) as React.CSSProperties}
              onClick={() => { setInputType(t.key); setInputData(''); setFileName(''); }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {inputType === 'keyword' && (
            <div style={{ marginBottom: 16 }}>
              <input type="text" value={inputData} onChange={e => setInputData(e.target.value)}
                placeholder="아이디어/주제를 짧게 입력하면 AI가 내용을 만들어 드려요"
                style={{ marginBottom: 10 }} />
              {/* 추천 키워드 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['번아웃 극복법','AI 트렌드 2026','인스타 성장 전략','건강한 아침 루틴','주식 투자 입문','생산성 높이는 방법','마음챙김 명상','디지털 디톡스'].map(kw => (
                  <button key={kw} type="button" onClick={() => setInputData(kw)} style={{
                    padding: '5px 12px', borderRadius: 99, fontSize: 12,
                    background: inputData === kw ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.06)',
                    color: inputData === kw ? '#a78bfa' : 'rgba(255,255,255,0.55)',
                    border: inputData === kw ? '1px solid rgba(108,99,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer', transition: 'all .15s',
                  }}>{kw}</button>
                ))}
              </div>
            </div>
          )}
          {inputType === 'url' && (
            <input type="text" value={inputData} onChange={e => setInputData(e.target.value)}
              placeholder="예: https://example.com/article"
              style={{ marginBottom: 16 }} />
          )}
          {inputType === 'text' && (
            <textarea value={inputData} onChange={e => setInputData(e.target.value)}
              placeholder="원문 텍스트를 붙여넣으세요..."
              rows={6} style={{ marginBottom: 16, resize: 'vertical' }} />
          )}
          {inputType === 'file' && (
            <div style={{ marginBottom: 16 }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${inputData ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 10,
                  padding: '32px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: inputData ? 'rgba(108,99,255,0.06)' : 'rgba(255,255,255,0.02)',
                  transition: 'all .2s',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{inputData ? '✅' : '📁'}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                  {fileName || '파일 클릭하여 업로드'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>TXT, MD 지원</div>
              </div>
              <input ref={fileRef} type="file" accept=".txt,.md" style={{ display: 'none' }}
                onChange={handleFileChange} />
            </div>
          )}

          {/* Image source */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>🖼️ 배경 이미지 소스</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {([
                { key: 'canva',        icon: '🎨', label: '칸바 스타일',     sub: 'CSS 템플릿 · 빠름 · 완전무료' },
                { key: 'pixabay',      icon: '🖼️', label: 'Pixabay',         sub: '고품질 사진 · 완전무료' },
                { key: 'pollinations', icon: '🤖', label: 'Pollinations.ai', sub: 'AI 생성 이미지 · 무료' },
              ] as { key: ImgSource; icon: string; label: string; sub: string }[]).map(s => (
                <div key={s.key} onClick={() => setImgSource(s.key)} style={{
                  padding: '14px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                  background: imgSource === s.key ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${imgSource === s.key ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all .15s',
                  position: 'relative',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: imgSource === s.key ? '#a78bfa' : '#fff' }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{s.sub}</div>
                  {imgSource === s.key && (
                    <div style={{
                      position: 'absolute', top: 6, right: 8,
                      fontSize: 11, color: '#a78bfa', fontWeight: 600,
                    }}>✓ 선택됨</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {imgSource === 'pixabay' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>
                Pixabay API Key
              </label>
              <input type="password" value={pixabayKey} onChange={e => setPixabayKey(e.target.value)}
                placeholder="Pixabay API 키 입력" />
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                <a href="https://pixabay.com/api/docs/" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#6c63ff' }}>pixabay.com</a>에서 무료로 발급 가능
              </p>
            </div>
          )}

          <button type="submit" disabled={isDisabled} style={{
            width: '100%', padding: '14px', fontSize: 16, fontWeight: 700,
            background: isDisabled ? 'rgba(108,99,255,0.3)' : 'linear-gradient(135deg,#6c63ff,#a78bfa)',
            color: isDisabled ? 'rgba(255,255,255,0.4)' : '#fff',
            border: 'none', borderRadius: 10, cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all .15s',
          }}>
            ✨ Gemini AI로 카드뉴스 생성
          </button>
        </form>
      </div>
    </div>
  );
}
