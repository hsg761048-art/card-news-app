'use client';

import { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim()) return;
    onSubmit(inputType, inputData.trim());
  };

  const tabStyle = (active: boolean) => ({
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    background: active ? 'linear-gradient(135deg,rgba(108,99,255,0.3),rgba(167,139,250,0.2))' : 'transparent',
    color: active ? '#a78bfa' : 'rgba(255,255,255,0.5)',
    border: active ? '1px solid rgba(108,99,255,0.4)' : '1px solid transparent',
    cursor: 'pointer',
    transition: 'all .15s',
  });

  return (
    <div>
      {/* Resume banner */}
      {savedSession && (
        <div style={{
          background: 'rgba(108,99,255,0.1)',
          border: '1px solid rgba(108,99,255,0.25)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 14 }}>
            <span style={{ color: '#a78bfa', marginRight: 8 }}>💾</span>
            <strong>이전 작업</strong>
            <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>
              {savedSession.category} · {savedSession.cards.length}장 ·{' '}
              {new Date(savedSession.savedAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={onLoadSession} style={{ padding: '6px 14px', fontSize: 13 }}>
              이어서 편집
            </button>
            <button className="btn-ghost" onClick={onDeleteSession} style={{ padding: '6px 14px', fontSize: 13 }}>
              삭제
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>카드뉴스 만들기</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
          키워드, URL 또는 원문 텍스트를 입력하면 AI가 카드뉴스를 자동 생성합니다
        </p>

        {/* Input type tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['keyword','url','text'] as InputType[]).map(t => (
            <button key={t} style={tabStyle(inputType === t)} onClick={() => setInputType(t)}>
              {t === 'keyword' ? '🔑 키워드' : t === 'url' ? '🔗 URL' : '📝 텍스트'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {inputType === 'keyword' && (
            <input
              type="text"
              value={inputData}
              onChange={e => setInputData(e.target.value)}
              placeholder="예: 직장인 번아웃 극복법, AI 트렌드 2025"
              style={{ marginBottom: 16 }}
            />
          )}
          {inputType === 'url' && (
            <input
              type="text"
              value={inputData}
              onChange={e => setInputData(e.target.value)}
              placeholder="예: https://example.com/article"
              style={{ marginBottom: 16 }}
            />
          )}
          {inputType === 'text' && (
            <textarea
              value={inputData}
              onChange={e => setInputData(e.target.value)}
              placeholder="원문 텍스트를 붙여넣으세요..."
              rows={6}
              style={{ marginBottom: 16, resize: 'vertical' }}
            />
          )}

          {/* Image source */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>
              🖼️ 배경 이미지 소스
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['canva','pollinations','pixabay'] as ImgSource[]).map(src => (
                <button
                  key={src}
                  type="button"
                  style={tabStyle(imgSource === src)}
                  onClick={() => setImgSource(src)}
                >
                  {src === 'canva' ? '🎨 디자인 템플릿'
                   : src === 'pollinations' ? '🤖 AI 생성'
                   : '📸 Pixabay'}
                </button>
              ))}
            </div>
          </div>

          {imgSource === 'pixabay' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>
                Pixabay API Key
              </label>
              <input
                type="password"
                value={pixabayKey}
                onChange={e => setPixabayKey(e.target.value)}
                placeholder="Pixabay API 키 입력"
              />
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                <a href="https://pixabay.com/api/docs/" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#6c63ff' }}>pixabay.com</a> 에서 무료로 발급 가능
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={!inputData.trim() || (imgSource === 'pixabay' && !pixabayKey.trim())}
            style={{ width: '100%', padding: '12px', fontSize: 16 }}
          >
            ✨ 카드뉴스 생성
          </button>
        </form>
      </div>
    </div>
  );
}
