'use client';

import { useAuth } from '@/lib/AuthContext';

interface HeaderProps {
  onOpenHistory?: () => void;
  geminiModel?: string;
  geminiConnected?: boolean;
  imgSource?: string;
  onChangeKey?: () => void;
  onNewProject?: () => void;
  showActions?: boolean;
}

export default function Header({
  onOpenHistory, geminiModel, geminiConnected,
  imgSource, onChangeKey, onNewProject, showActions,
}: HeaderProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const srcLabel: Record<string, string> = {
    canva: 'Canva', pixabay: 'Pixabay', pollinations: 'Pollinations',
  };

  return (
    <header style={{
      background: 'rgba(10,10,26,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 960, margin: '0 auto', padding: '0 16px',
        height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
          }}>✨</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>AI 카드뉴스 생성기</div>
            {(geminiModel || imgSource) && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>
                {geminiModel ? `Gemini 3.1` : ''}{geminiModel && imgSource ? ' · ' : ''}{imgSource ? srcLabel[imgSource] || imgSource : ''}
              </div>
            )}
          </div>
        </div>

        {/* Gemini status */}
        {geminiConnected && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 99, padding: '4px 12px',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Gemini 연결됨</span>
            {geminiModel && (
              <span style={{ fontSize: 11, color: 'rgba(16,185,129,0.6)' }}>{geminiModel}</span>
            )}
          </div>
        )}

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {showActions && (
            <>
              {onChangeKey && (
                <button onClick={onChangeKey} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '6px 14px', cursor: 'pointer',
                }}>🔑 키 변경</button>
              )}
              {onNewProject && (
                <button onClick={onNewProject} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '6px 14px', cursor: 'pointer',
                }}>← 처음부터</button>
              )}
            </>
          )}

          {!loading && (
            <button className="btn-ghost" onClick={onOpenHistory} style={{ fontSize: 12 }}>
              📚 보관함
            </button>
          )}

          {loading ? (
            <div className="spinner" style={{ width: 18, height: 18 }} />
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user.photoURL && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="" width={26} height={26}
                  style={{ borderRadius: '50%', border: '2px solid rgba(108,99,255,0.4)' }} />
              )}
              <button className="btn-ghost" onClick={signOut} style={{ fontSize: 12 }}>로그아웃</button>
            </div>
          ) : (
            <button className="btn-primary" onClick={signInWithGoogle} style={{ fontSize: 12, padding: '6px 14px' }}>
              🔑 Google 로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
