'use client';

import { useEffect, useRef, useState } from 'react';
import { InputType, ImgSource, ProcessedData } from '@/types';
import {
  geminiExpandText, geminiDetectCategory, geminiGenerateCards,
  demoDetectCategory, demoGenerateCards, activeModel,
} from '@/lib/geminiClient';
import {
  generateCardImageUrls, generateCanvaTemplateMap, generatePixabayImageUrls,
} from '@/lib/imageUtils';

interface PipelineStep {
  label: string;
  sub: string;
  status: 'pending' | 'running' | 'done' | 'error';
  badge?: string;
}

interface ProcessingPipelineProps {
  inputType: InputType;
  inputData: string;
  imgSource: ImgSource;
  pixabayKey?: string;
  format?: string;
  onComplete: (data: ProcessedData) => void;
  onError: (msg: string) => void;
  onModelDetected?: (model: string) => void;
}

export default function ProcessingPipeline({
  inputType, inputData, imgSource, pixabayKey = '', format = '1:1',
  onComplete, onError, onModelDetected,
}: ProcessingPipelineProps) {
  const [steps, setSteps] = useState<PipelineStep[]>([
    { label: '텍스트 추출 및 정제', sub: 'Gemini Flash', status: 'pending' },
    { label: '콘텐츠 카테고리 분류', sub: 'Gemini Flash', status: 'pending' },
    { label: '카드뉴스 슬라이드 생성', sub: 'Gemini Flash', status: 'running' },
    { label: 'AI 배경 이미지 생성', sub: 'Pollinations · Turbo', status: 'pending' },
  ]);
  const [progress, setProgress] = useState(0);
  const ran = useRef(false);

  const setStep = (i: number, patch: Partial<PipelineStep>) =>
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function run() {
      try {
        // Step 0
        setStep(0, { status: 'running' });
        setProgress(10);
        let text = '';
        try {
          text = await geminiExpandText(inputType, inputData);
          if (activeModel) { onModelDetected?.(activeModel); }
        } catch {
          text = inputData;
        }
        setStep(0, { status: 'done', badge: 'Gemini Flash' });
        setProgress(30);

        // Step 1
        setStep(1, { status: 'running' });
        let category = '';
        try {
          category = await geminiDetectCategory(text);
        } catch {
          category = demoDetectCategory(text);
        }
        setStep(1, { status: 'done', badge: category });
        setProgress(55);

        // Step 2
        setStep(2, { status: 'running' });
        let cards;
        try {
          cards = await geminiGenerateCards(text, category, format);
        } catch {
          cards = demoGenerateCards(text, category);
        }
        setStep(2, { status: 'done', badge: `${cards.length}장` });
        setProgress(75);

        // Step 3
        setStep(3, { status: 'running' });
        let cardImages: Record<string, string> = {};
        const imgSub = imgSource === 'canva' ? 'CSS Templates' : imgSource === 'pixabay' ? 'Pixabay' : 'Pollinations · Turbo';
        setStep(3, { sub: imgSub });

        if (imgSource === 'canva') {
          cardImages = generateCanvaTemplateMap(cards);
        } else if (imgSource === 'pixabay' && pixabayKey) {
          try {
            cardImages = await generatePixabayImageUrls(cards, category, format, pixabayKey, () => {});
          } catch {
            cardImages = generateCanvaTemplateMap(cards);
          }
        } else {
          cardImages = generateCardImageUrls(cards, category, format);
        }
        setStep(3, { status: 'done' });
        setProgress(100);

        setTimeout(() => onComplete({ text, category, cards, cardImages }), 400);
      } catch (e: any) {
        onError(e.message || '처리 중 오류 발생');
      }
    }
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doneCount = steps.filter(s => s.status === 'done').length;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚙️</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Gemini AI가 분석하고 있습니다</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>잠시만 기다려 주세요...</p>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 4, borderRadius: 99,
        background: 'rgba(255,255,255,0.08)',
        marginBottom: 24, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: 'linear-gradient(90deg,#6c63ff,#06b6d4)',
          width: `${progress}%`,
          transition: 'width .5s ease',
        }} />
      </div>

      {/* Steps */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, overflow: 'hidden',
      }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px',
            borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            background: s.status === 'running' ? 'rgba(108,99,255,0.08)' : 'transparent',
            transition: 'background .3s',
          }}>
            {/* Icon */}
            <div style={{ width: 28, height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.status === 'done'
                ? <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
                : s.status === 'running'
                ? <div className="spinner" />
                : <div style={{ width: 18, height: 18, borderRadius: 4, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)' }} />
              }
            </div>
            {/* Label */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 14, fontWeight: s.status === 'running' ? 600 : 400,
                color: s.status === 'pending' ? 'rgba(255,255,255,0.35)' : '#fff',
              }}>{s.label}</div>
            </div>
            {/* Badge */}
            <div style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 99,
              background: s.status === 'running' ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.06)',
              color: s.status === 'running' ? '#a78bfa' : 'rgba(255,255,255,0.4)',
              border: s.status === 'running' ? '1px solid rgba(108,99,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
              fontWeight: s.status === 'running' ? 600 : 400,
            }}>
              {s.badge || s.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
        {doneCount} / {steps.length} 완료
      </div>
    </div>
  );
}
