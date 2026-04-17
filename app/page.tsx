'use client';

import { useState, useRef, useCallback } from 'react';
import { Step, InputType, ImgSource, ProcessedData, CardNews, Card } from '@/types';
import { useAuth } from '@/lib/AuthContext';
import { saveCardNews } from '@/lib/firestore';
import Header from '@/components/Header';
import StepProgress from '@/components/StepProgress';
import InputModule from '@/components/InputModule';
import ProcessingPipeline from '@/components/ProcessingPipeline';
import CardEditor from '@/components/CardEditor';
import ExportModule from '@/components/ExportModule';
import HistoryPanel from '@/components/HistoryPanel';

const LS_SESSION = 'cardnews_last_session';

function loadSavedSession(): CardNews | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function persistSession(data: Omit<CardNews, 'id' | 'uid'>) {
  try {
    localStorage.setItem(LS_SESSION, JSON.stringify({ ...data, savedAt: Date.now() }));
  } catch {}
}

export default function Home() {
  const { user } = useAuth();

  const [step,          setStep]          = useState<Step>('input');
  const [inputType,     setInputType]     = useState<InputType>('keyword');
  const [inputData,     setInputData]     = useState('');
  const [imgSource,     setImgSource]     = useState<ImgSource>('canva');
  const [pixabayKey,    setPixabayKey]    = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('pixabay_api_key') || '';
  });
  const [format,        setFormat]        = useState('1:1');
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [cards,         setCards]         = useState<Card[]>([]);
  const [cardImages,    setCardImages]    = useState<Record<string, string>>({});
  const [category,      setCategory]      = useState('');

  const [savedSession,  setSavedSession]  = useState<CardNews | null>(loadSavedSession);
  const [showHistory,   setShowHistory]   = useState(false);
  const [isSaving,      setIsSaving]      = useState(false);
  const [geminiModel,   setGeminiModel]   = useState('');
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [saveMsg,       setSaveMsg]       = useState('');
  const [errorMsg,      setErrorMsg]      = useState('');

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Handlers ──────────────────────────────────────────────────

  const handleSubmit = (type: InputType, data: string) => {
    setInputType(type);
    setInputData(data);
    setErrorMsg('');
    setStep('processing');
  };

  const handleProcessComplete = useCallback((data: ProcessedData) => {
    setProcessedData(data);
    setCards(data.cards);
    setCardImages(data.cardImages);
    setCategory(data.category);

    // Persist to localStorage
    const session: Omit<CardNews, 'id' | 'uid'> = {
      category: data.category,
      cards:     data.cards,
      cardImages: data.cardImages,
      text:      data.text,
      savedAt:   Date.now(),
    };
    persistSession(session);
    setSavedSession({ ...session, savedAt: Date.now() });
    setGeminiConnected(true);
    setStep('editor');
  }, []);

  const handleCardsChange = useCallback((updated: Card[]) => {
    setCards(updated);
    // Debounced autosave
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      try {
        const raw = localStorage.getItem(LS_SESSION);
        if (raw) {
          const session = JSON.parse(raw);
          session.cards = updated;
          session.savedAt = Date.now();
          localStorage.setItem(LS_SESSION, JSON.stringify(session));
          setSaveMsg('💾 저장됨');
          setTimeout(() => setSaveMsg(''), 1800);
        }
      } catch {}
    }, 500);
  }, []);

  const handleSaveToCloud = async () => {
    if (!user || !processedData) return;
    setIsSaving(true);
    try {
      await saveCardNews(user.uid, {
        category,
        cards,
        cardImages,
        text: processedData.text,
      });
      setSaveMsg('✅ 클라우드에 저장됨');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (e: any) {
      setSaveMsg(`❌ ${e.message}`);
      setTimeout(() => setSaveMsg(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSession = () => {
    if (!savedSession) return;
    setCards(savedSession.cards);
    setCardImages(savedSession.cardImages);
    setCategory(savedSession.category);
    setProcessedData({
      text:       savedSession.text,
      category:   savedSession.category,
      cards:      savedSession.cards,
      cardImages: savedSession.cardImages,
    });
    setStep('editor');
  };

  const handleDeleteSession = () => {
    localStorage.removeItem(LS_SESSION);
    setSavedSession(null);
  };

  const handleLoadFromHistory = (data: CardNews) => {
    setCards(data.cards);
    setCardImages(data.cardImages);
    setCategory(data.category);
    setProcessedData({
      text:       data.text,
      category:   data.category,
      cards:      data.cards,
      cardImages: data.cardImages,
    });
    persistSession(data);
    setSavedSession(data);
    setStep('editor');
  };

  const handleNewProject = () => {
    setStep('input');
    setProcessedData(null);
    setCards([]);
    setCardImages({});
    setCategory('');
    setErrorMsg('');
  };

  // ── Render ─────────────────────────────────────────────────────

  return (
    <div className="page-container">
      <Header
        onOpenHistory={user ? () => setShowHistory(true) : undefined}
        geminiConnected={geminiConnected}
        geminiModel={geminiModel}
      />

      <main className="main-content">
        <StepProgress step={step} />

        {errorMsg && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            fontSize: 14, color: '#fca5a5',
          }}>
            {errorMsg}
            <button onClick={() => setStep('input')} style={{
              background: 'transparent', color: '#ef4444', marginLeft: 16,
              fontSize: 13, border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '2px 10px',
            }}>
              다시 시도
            </button>
          </div>
        )}

        {step === 'input' && (
          <InputModule
            onSubmit={handleSubmit}
            imgSource={imgSource}
            setImgSource={setImgSource}
            pixabayKey={pixabayKey}
            setPixabayKey={(k) => {
              setPixabayKey(k);
              try { localStorage.setItem('pixabay_api_key', k); } catch {}
            }}
            savedSession={savedSession}
            onLoadSession={handleLoadSession}
            onDeleteSession={handleDeleteSession}
          />
        )}

        {step === 'processing' && (
          <ProcessingPipeline
            inputType={inputType}
            inputData={inputData}
            imgSource={imgSource}
            pixabayKey={pixabayKey}
            format={format}
            onComplete={handleProcessComplete}
            onError={(msg) => { setErrorMsg(msg); setStep('input'); }}
            onModelDetected={(m) => { setGeminiModel(m); setGeminiConnected(true); }}
          />
        )}

        {step === 'editor' && processedData && (
          <CardEditor
            cards={cards}
            cardImages={cardImages}
            category={category}
            format={format}
            imgSource={imgSource}
            onCardsChange={handleCardsChange}
            onNext={() => setStep('export')}
            onBack={() => setStep('input')}
            isSaving={isSaving}
            onSaveToCloud={user ? handleSaveToCloud : undefined}
            saveMsg={saveMsg}
          />
        )}

        {step === 'export' && processedData && (
          <ExportModule
            cards={cards}
            cardImages={cardImages}
            category={category}
            format={format}
            onBack={() => setStep('editor')}
            onNewProject={handleNewProject}
          />
        )}
      </main>

      {showHistory && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onLoad={handleLoadFromHistory}
        />
      )}
    </div>
  );
}
