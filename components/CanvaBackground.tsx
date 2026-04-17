'use client';

import { CanvaTemplate, CanvaShape } from '@/types';

interface Props {
  template: CanvaTemplate;
  width: number;
  height: number;
}

function renderShape(s: CanvaShape, i: number) {
  const x = typeof s.x === 'string' ? s.x : `${s.x ?? 0}px`;
  const y = typeof s.y === 'string' ? s.y : `${s.y ?? 0}px`;
  const transform = s.rotate ? `rotate(${s.rotate}deg)` : undefined;
  const filter    = s.blur ? `blur(${s.blur}px)` : undefined;

  if (s.type === 'circle') {
    return (
      <div key={i} style={{
        position: 'absolute', left: x, top: y,
        width: s.w, height: s.h,
        borderRadius: '50%',
        background: s.color,
        transform, filter,
        pointerEvents: 'none',
      }} />
    );
  }
  if (s.type === 'rect') {
    return (
      <div key={i} style={{
        position: 'absolute', left: x, top: y,
        width: s.w, height: s.h,
        background: s.color,
        transform, filter,
        pointerEvents: 'none',
      }} />
    );
  }
  if (s.type === 'line-h') {
    return (
      <div key={i} style={{
        position: 'absolute', left: 0, top: y,
        width: '100%', height: 1,
        background: s.color,
        pointerEvents: 'none',
      }} />
    );
  }
  if (s.type === 'wave') {
    const id = `wave-${i}`;
    return (
      <svg key={i} style={{ position: 'absolute', left: 0, top: y, width: '100%', pointerEvents: 'none' }}
        viewBox="0 0 400 60" preserveAspectRatio="none" height={40}>
        <path d={`M0,30 Q100,0 200,30 T400,30 L400,60 L0,60 Z`} fill={s.color} />
      </svg>
    );
  }
  if (s.type === 'tri') {
    return (
      <div key={i} style={{
        position: 'absolute', left: x, top: y,
        width: 0, height: 0,
        borderLeft: '60px solid transparent',
        borderRight: '60px solid transparent',
        borderBottom: `104px solid ${s.color}`,
        pointerEvents: 'none',
      }} />
    );
  }
  if (s.type === 'grid') {
    return (
      <div key={i} style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${s.color} 1px,transparent 1px),linear-gradient(90deg,${s.color} 1px,transparent 1px)`,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />
    );
  }
  if (s.type === 'hex') {
    return (
      <div key={i} style={{
        position: 'absolute', left: x, top: y,
        width: 80, height: 92,
        background: s.color,
        clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
        pointerEvents: 'none',
      }} />
    );
  }
  return null;
}

export default function CanvaBackground({ template, width, height }: Props) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: template.bg,
      overflow: 'hidden',
      borderRadius: 'inherit',
    }}>
      {template.shapes.map((s, i) => renderShape(s, i))}
    </div>
  );
}
