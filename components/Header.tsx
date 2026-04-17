'use client';

import { useAuth } from '@/lib/AuthContext';

interface HeaderProps {
  onOpenHistory?: () => void;
  geminiModel?: string;
  geminiConnected?: boolean;
}

export default function Header({ onOpenHistory, geminiModel, geminiConnected }: HeaderProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <header style={{
      background: 'rgba(10,10,26,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '0 16px',
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo + Gemini status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>✨</div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>AI 카드뉴스 생성기</span>
          </div>

          {geminiConnected && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 99, padding: '3px 10px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Gemini 연결됨</span>
              {geminiModel && (
                <span style={{ fontSize: 10, color: 'rgba(16,185,129,0.7)', marginLeft: 4 }}>
                  {geminiModel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!loading && user && (
            <button className="btn-ghost" onClick={onOpenHistory} style={{ fontSize: 13 }}>
              📋 히스토리
            </button>
          )}
          {loading ? (
            <div className="spinner" style={{ width: 18, height: 18 }} />
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user.photoURL && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt={user.displayName ?? ''} width={28} height={28}
                  style={{ borderRadius: '50%', border: '2px solid rgba(108,99,255,0.4)' }} />
              )}
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName}
              </span>
              <button className="btn-ghost" onClick={signOut} style={{ fontSize: 12 }}>로그아웃</button>
            </div>
          ) : (
            <button className="btn-primary" onClick={signInWithGoogle} style={{ fontSize: 13, padding: '7px 16px' }}>
              🔑 Google 로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
