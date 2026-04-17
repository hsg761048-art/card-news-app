'use client';

import { useEffect, useRef, useState } from 'react';
import { InputType, ImgSource, ProcessedData } from '@/types';
import {
  geminiExpandText,
  geminiDetectCategory,
  geminiGenerateCards,
  demoDetectCategory,
  demoGenerateCards,
  activeModel,
} from '@/lib/geminiClient';
import {
  generateCardImageUrls,
  generateCanvaTemplateMap,
  generatePixabayImageUrls,
} from '@/lib/imageUtils';

interface Step {
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
  detail?: string;
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
  const [steps, setSteps] = useState<Step[]>([
    { label: '텍스트 정제 & 확장', status: 'pending' },
    { label: '카테고리 분류',       status: 'pending' },
    { label: '카드 슬라이드 생성',  status: 'pending' },
    { label: '배경 이미지 준비',    status: 'pending' },
  ]);
  const [log, setLog]   = useState<string[]>([]);
  const ran = useRef(false);

  const setStep = (i: number, patch: Partial<Step>) =>
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function run() {
      try {
        // Step 0: expand text
        setStep(0, { status: 'running' });
        let text = '';
        try {
          text = await geminiExpandText(inputType, inputData);
          addLog(`✅ 텍스트 정제 완료 (${text.length}자)`);
          if (activeModel) { addLog(`🤖 모델: ${activeModel}`); onModelDetected?.(activeModel); }
        } catch (e: any) {
          addLog('⚠️ Gemini 오류 — 데모 모드로 전환');
          text = inputData;
        }
        setStep(0, { status: 'done' });

        // Step 1: detect category
        setStep(1, { status: 'running' });
        let category = '';
        try {
          category = await geminiDetectCategory(text);
        } catch {
          category = demoDetectCategory(text);
        }
        addLog(`📂 카테고리: ${category}`);
        setStep(1, { status: 'done', detail: category });

        // Step 2: generate cards
        setStep(2, { status: 'running' });
        let cards;
        try {
          cards = await geminiGenerateCards(text, category, format);
        } catch {
          cards = demoGenerateCards(text, category);
        }
        addLog(`🃏 카드 ${cards.length}장 생성`);
        setStep(2, { status: 'done', detail: `${cards.length}장` });

        // Step 3: images
        setStep(3, { status: 'running' });
        let cardImages: Record<string, string> = {};
        if (imgSource === 'canva') {
          cardImages = generateCanvaTemplateMap(cards);
          addLog('🎨 Canva 템플릿 적용');
        } else if (imgSource === 'pixabay' && pixabayKey) {
          try {
            cardImages = await generatePixabayImageUrls(cards, category, format, pixabayKey, (i, total) => {
              addLog(`📸 Pixabay ${i}/${total}`);
            });
          } catch (e: any) {
            addLog(`⚠️ Pixabay 오류: ${e.message} — Canva 템플릿으로 대체`);
            cardImages = generateCanvaTemplateMap(cards);
          }
        } else {
          cardImages = generateCardImageUrls(cards, category, format);
          addLog('🤖 AI 이미지 URL 생성');
        }
        setStep(3, { status: 'done' });

        onComplete({ text, category, cards, cardImages });
      } catch (e: any) {
        onError(e.message || '처리 중 오류 발생');
      }
    }

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusIcon = (s: Step['status']) =>
    s === 'done'    ? '✅'
    : s === 'running' ? '⏳'
    : s === 'error'   ? '❌'
    : '⬜';

  return (
    <div className="card">
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>✨ 카드뉴스 생성 중...</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 8,
            background: s.status === 'running' ? 'rgba(108,99,255,0.1)'
                      : s.status === 'done'    ? 'rgba(16,185,129,0.08)'
                      : 'rgba(255,255,255,0.03)',
            border: `1px solid ${
              s.status === 'running' ? 'rgba(108,99,255,0.25)'
              : s.status === 'done'  ? 'rgba(16,185,129,0.2)'
              : 'rgba(255,255,255,0.06)'
            }`,
            transition: 'all .3s',
          }}>
            {s.status === 'running'
              ? <div className="spinner" />
              : <span style={{ fontSize: 18 }}>{statusIcon(s.status)}</span>
            }
            <span style={{ flex: 1, fontSize: 14 }}>{s.label}</span>
            {s.detail && (
              <span className="badge">{s.detail}</span>
            )}
          </div>
        ))}
      </div>

      {/* Log */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: '12px 14px',
        fontFamily: 'monospace',
        fontSize: 12,
        color: 'rgba(255,255,255,0.55)',
        maxHeight: 140,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>
        {log.length === 0
          ? <span style={{ color: 'rgba(255,255,255,0.25)' }}>로그 대기 중...</span>
          : log.map((l, i) => <span key={i}>{l}</span>)
        }
      </div>
    </div>
  );
}
