import { useState, useEffect, useRef } from 'react';
import { fetchQuestion, submitAnswer, finishSession } from '../api/interview';
import Background from './Background';
import Sidebar from './Sidebar';
import Feedback from './Feedback';

const TOTAL_QUESTIONS = 5;

export default function Interview({ role, difficulty, topic, onFinish }) {
  const [phase, setPhase] = useState('loading'); // loading | answering | evaluating | feedback | finishing
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [history, setHistory] = useState([]);
  const [qaLog, setQaLog] = useState([]);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadQuestion() {
    setPhase('loading');
    setQuestionText('');
    setAnswer('');
    setFeedback(null);
    setError(null);

    try {
      let accumulated = '';
      await fetchQuestion(role, difficulty, topic, history, (chunk) => {
        accumulated += chunk;
        setQuestionText(accumulated);
      });
      setPhase('answering');
      textareaRef.current?.focus();
    } catch (err) {
      setError(err.message);
      setPhase('answering');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!answer.trim() || phase !== 'answering') return;

    setPhase('evaluating');
    setError(null);

    try {
      const parsed = await submitAnswer(role, difficulty, topic, history, questionText, answer);

      setFeedback(parsed);
      setPhase('feedback');

      const newHistory = [
        ...history,
        {
          userMessage: `Question: ${questionText}\n\nMy answer: ${answer}`,
          assistantMessage: JSON.stringify(parsed),
        },
      ];
      setHistory(newHistory);
      setQaLog((prev) => [
        ...prev,
        {
          question: questionText,
          answer,
          score: parsed.score,
          feedback: `Good: ${parsed.whatWasGood} | Missing: ${parsed.whatWasMissing}`,
          whatWasGood: parsed.whatWasGood,
          whatWasMissing: parsed.whatWasMissing,
          modelAnswer: parsed.modelAnswer,
        },
      ]);
    } catch (err) {
      setError(err.message);
      setPhase('answering');
    }
  }

  async function handleNext() {
    if (questionNumber >= TOTAL_QUESTIONS) {
      setPhase('finishing');
      try {
        const summary = await finishSession(role, difficulty, topic, qaLog);
        onFinish(qaLog, summary);
      } catch (err) {
        setError(err.message);
        setPhase('feedback');
      }
    } else {
      setQuestionNumber((n) => n + 1);
      loadQuestion();
    }
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit(e);
  }

  const streaming = phase === 'loading';
  const showForm = ['answering', 'evaluating', 'feedback'].includes(phase) && questionText;

  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="lg:flex">
        <Sidebar
          role={role}
          difficulty={difficulty}
          topic={topic}
          questionNumber={questionNumber}
          total={TOTAL_QUESTIONS}
          qaLog={qaLog}
        />

        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 border-b border-white/8 bg-[#07070b]/80 px-5 py-3 backdrop-blur-xl lg:hidden">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{role}</span>
              {topic && <span className="rounded-md bg-violet-500/15 px-1.5 py-0.5 text-[11px] font-medium text-violet-300">{topic}</span>}
            </div>
            <span className="text-xs font-medium text-white/45 tabular-nums">
              {questionNumber} / {TOTAL_QUESTIONS}
            </span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i < questionNumber - 1
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500'
                    : i === questionNumber - 1
                    ? 'bg-violet-400/50'
                    : 'bg-white/8'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main workspace */}
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-14 lg:py-14">
          <div className="mx-auto max-w-2xl">
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3 animate-fade-in">
              <span className="text-xs font-bold tracking-[0.22em] text-violet-300/80">
                QUESTION {String(questionNumber).padStart(2, '0')}
              </span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-white/35">{difficulty}</span>
            </div>

            {/* Question prompt */}
            {streaming && !questionText ? (
              <div className="space-y-3 animate-fade-in">
                <div className="shimmer h-6 w-3/4 rounded-lg" />
                <div className="shimmer h-6 w-full rounded-lg" />
                <div className="shimmer h-6 w-5/6 rounded-lg" />
              </div>
            ) : (
              <p
                className={`animate-fade-up whitespace-pre-line text-base font-semibold leading-relaxed text-white sm:text-lg sm:leading-[1.6] ${
                  streaming ? 'caret' : ''
                }`}
              >
                {questionText}
              </p>
            )}

            {/* Answer editor */}
            {showForm && (
              <form onSubmit={handleSubmit} className="mt-8 animate-fade-up">
                <div
                  className={`overflow-hidden rounded-2xl border bg-black/20 transition-colors focus-within:border-violet-400/40 ${
                    phase === 'answering' ? 'border-white/10' : 'border-white/8 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-4 py-2.5">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                      Your Answer
                    </span>
                    <span className="text-[11px] tabular-nums text-white/30">
                      {answer.length} chars
                    </span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer here…"
                    rows={7}
                    disabled={phase !== 'answering'}
                    className="w-full resize-none bg-transparent p-4 text-[14px] leading-relaxed text-white/90 placeholder-white/30 focus:outline-none disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center justify-between border-t border-white/8 px-4 py-3">
                    <span className="text-[11px] text-white/30">
                      <kbd className="rounded bg-white/8 px-1.5 py-0.5 font-sans text-white/50">⌘</kbd>
                      <span className="mx-1">+</span>
                      <kbd className="rounded bg-white/8 px-1.5 py-0.5 font-sans text-white/50">↵</kbd>
                      <span className="ml-1.5">to submit</span>
                    </span>
                    <button
                      type="submit"
                      disabled={!answer.trim() || phase !== 'answering'}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all enabled:hover:shadow-violet-800/40 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {phase === 'evaluating' ? (
                        <>
                          <Spinner />
                          Evaluating…
                        </>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 animate-fade-in rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                {error}
              </div>
            )}

            {/* Feedback */}
            <Feedback
              feedback={feedback}
              questionNumber={questionNumber}
              totalQuestions={TOTAL_QUESTIONS}
              onNext={handleNext}
              isLoading={phase === 'evaluating'}
            />

            {/* Finishing */}
            {phase === 'finishing' && (
              <div className="mt-4 animate-fade-in rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
                <Spinner large />
                <p className="mt-3 text-sm text-white/60">Generating your session summary…</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function Spinner({ large }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-white/25 border-t-white ${
        large ? 'mx-auto h-8 w-8' : 'h-4 w-4'
      }`}
    />
  );
}
