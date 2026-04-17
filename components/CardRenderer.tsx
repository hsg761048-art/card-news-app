'use client';

import { Card } from '@/types';
import { CANVA_TEMPLATES, CATEGORY_COLOR, CATEGORY_EMOJI, BG_THEMES } from '@/lib/constants';
import CanvaBackground from './CanvaBackground';

interface CardRendererProps {
  card: Card;
  imageUrl?: string;
  category: string;
  format: string;
  width?: number;
  id?: string;
}

export default function CardRenderer({ card, imageUrl, category, format, width = 320, id }: CardRendererProps) {
  const isPortrait = format === '9:16';
  const aspectW    = isPortrait ? 9 : 1;
  const aspectH    = isPortrait ? 16 : 1;
  const height     = Math.round(width * aspectH / aspectW);
  const accent     = CATEGORY_COLOR[category] || '#6c63ff';
  const emoji      = CATEGORY_EMOJI[category] || '✨';

  // Determine background rendering mode
  const isCanva = imageUrl?.startsWith('canva:');
  const canvaIdx = isCanva ? parseInt(imageUrl!.split(':')[1]) : -1;
  const template = canvaIdx >= 0 ? CANVA_TEMPLATES[canvaIdx % CANVA_TEMPLATES.length] : null;

  const bgThemes = BG_THEMES[category] || BG_THEMES['라이프스타일'];
  const bgTheme  = bgThemes[0];

  const outerStyle: React.CSSProperties = {
    position: 'relative',
    width, height,
    borderRadius: 16,
    overflow: 'hidden',
    flexShrink: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", sans-serif',
    userSelect: 'none',
  };

  const textColor = template?.textColor || '#ffffff';
  const subColor  = template?.subColor || 'rgba(255,255,255,0.6)';
  const accentCol = template?.accent || accent;

  return (
    <div style={outerStyle} id={id}>
      {/* Background */}
      {template ? (
        <CanvaBackground template={template} width={width} height={height} />
      ) : imageUrl && !isCanva ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)' }} />
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', inset: 0, background: bgTheme.bg }} />
          <div style={{ position: 'absolute', inset: 0, background: bgTheme.overlay }} />
        </>
      )}

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: isPortrait ? '28px 22px' : '22px 20px',
        boxSizing: 'border-box',
      }}>
        {card.type === 'cover' && (
          <>
            {/* Top badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `${accentCol}22`,
              border: `1px solid ${accentCol}44`,
              borderRadius: 99, padding: '4px 12px',
              fontSize: isPortrait ? 12 : 11,
              color: accentCol,
              alignSelf: 'flex-start',
              marginBottom: 'auto',
            }}>
              <span>{emoji}</span>
              <span style={{ fontWeight: 600 }}>{card.subtitle || category}</span>
            </div>

            {/* Center title */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                width: 36, height: 3, borderRadius: 2,
                background: `linear-gradient(90deg,${accentCol},transparent)`,
                marginBottom: 12,
              }} />
              <h1 style={{
                fontSize: isPortrait ? Math.round(width * 0.085) : Math.round(width * 0.075),
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                wordBreak: 'keep-all',
              }}>
                {card.title}
              </h1>
            </div>

            {/* Bottom page indicator */}
            <div style={{ display: 'flex', gap: 4, marginTop: 'auto' }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  width: i === 0 ? 20 : 5, height: 4, borderRadius: 2,
                  background: i === 0 ? accentCol : `${accentCol}44`,
                }} />
              ))}
            </div>
          </>
        )}

        {card.type === 'content' && (
          <>
            {/* Point label */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `${accentCol}20`, border: `1px solid ${accentCol}30`,
              borderRadius: 6, padding: '3px 10px',
              fontSize: 11, color: accentCol, fontWeight: 600,
              alignSelf: 'flex-start', marginBottom: 10,
            }}>
              POINT
            </div>

            <h2 style={{
              fontSize: isPortrait ? Math.round(width * 0.065) : Math.round(width * 0.058),
              fontWeight: 700,
              color: textColor,
              lineHeight: 1.3,
              marginBottom: 12,
              wordBreak: 'keep-all',
            }}>
              {card.title}
            </h2>

            <div style={{ width: 28, height: 2, background: accentCol, borderRadius: 1, marginBottom: 12 }} />

            <p style={{
              fontSize: isPortrait ? Math.round(width * 0.042) : Math.round(width * 0.038),
              color: subColor,
              lineHeight: 1.65,
              wordBreak: 'keep-all',
              flex: 1,
            }}>
              {card.body}
            </p>
          </>
        )}

        {card.type === 'end' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: `${accentCol}25`, border: `2px solid ${accentCol}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              {emoji}
            </div>
            <h2 style={{
              fontSize: isPortrait ? Math.round(width * 0.07) : Math.round(width * 0.062),
              fontWeight: 700, color: textColor, textAlign: 'center',
            }}>
              {card.title}
            </h2>
            <p style={{
              fontSize: isPortrait ? Math.round(width * 0.04) : Math.round(width * 0.035),
              color: subColor, textAlign: 'center', lineHeight: 1.6,
            }}>
              {card.subtitle}
            </p>
            <p style={{
              fontSize: isPortrait ? Math.round(width * 0.036) : Math.round(width * 0.032),
              color: `${accentCol}cc`, textAlign: 'center',
              marginTop: 4,
            }}>
              {card.body}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
