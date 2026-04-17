'use client';

import { Step } from '@/types';

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: 'input',      label: '입력',    icon: '✍️' },
  { key: 'processing', label: '생성',    icon: '⚙️' },
  { key: 'editor',     label: '편집',    icon: '🎨' },
  { key: 'export',     label: '내보내기', icon: '📤' },
];

const ORDER: Step[] = ['input', 'processing', 'editor', 'export'];

interface StepProgressProps {
  step: Step;
}

export default function StepProgress({ step }: StepProgressProps) {
  const currentIdx = ORDER.indexOf(step);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const done    = i < currentIdx;
        const active  = i === currentIdx;
        const pending = i > currentIdx;

        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            {/* Circle */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: done ? 16 : 14,
              fontWeight: 600,
              background: done    ? 'linear-gradient(135deg,#6c63ff,#a78bfa)'
                        : active  ? 'rgba(108,99,255,0.2)'
                        : 'rgba(255,255,255,0.05)',
              border: done   ? 'none'
                    : active ? '2px solid #6c63ff'
                    : '1px solid rgba(255,255,255,0.1)',
              color: pending ? 'rgba(255,255,255,0.3)' : '#fff',
              flexShrink: 0,
              transition: 'all .3s',
            }}>
              {done ? '✓' : s.icon}
            </div>

            {/* Label */}
            <span style={{
              marginLeft: 6,
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: done || active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              whiteSpace: 'nowrap',
            }}>
              {s.label}
            </span>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1,
                height: 2,
                margin: '0 8px',
                background: done ? 'linear-gradient(90deg,#6c63ff,#a78bfa)' : 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                transition: 'background .3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
