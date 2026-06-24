import ScoreRing from './ScoreRing';

export default function Feedback({ feedback, questionNumber, totalQuestions, onNext, isLoading }) {
  if (isLoading) {
    return (
      <div className="mt-6 animate-fade-in rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-white/55">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
          <span className="text-sm">Evaluating your answer…</span>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  const isLast = questionNumber >= totalQuestions;

  return (
    <div className="mt-6 animate-fade-up">
      {/* Verdict banner */}
      <div className="flex items-center gap-5 rounded-t-2xl border border-b-0 border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
        <ScoreRing score={feedback.score} size={92} stroke={7} showLabel={false} />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-300/80">
            Evaluation
          </p>
          <h3 className="mt-1 text-lg font-bold text-white">
            {feedback.score >= 8
              ? 'Strong answer'
              : feedback.score >= 5
              ? 'Decent — sharpen it'
              : 'Needs work'}
          </h3>
          <p className="mt-1 text-sm text-white/45">
            {feedback.score >= 8
              ? 'You clearly understand this topic.'
              : feedback.score >= 5
              ? 'Good foundation with gaps to close.'
              : 'Review the model answer below.'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 rounded-b-2xl border border-white/10 bg-white/[0.03] p-6 pt-0 backdrop-blur-xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel tone="good" icon="✓" title="What was good" text={feedback.whatWasGood} />
          <Panel tone="bad" icon="✗" title="What was missing" text={feedback.whatWasMissing} />
        </div>
        {feedback.modelAnswer && (
          <Panel tone="info" icon="◆" title="Model answer" text={feedback.modelAnswer} />
        )}

        <button
          onClick={onNext}
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all hover:shadow-violet-800/40 active:scale-[0.99]"
        >
          {isLast ? 'View Summary' : `Next Question (${questionNumber + 1}/${totalQuestions})`}
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const TONES = {
  good: { wrap: 'border-emerald-500/20 bg-emerald-500/[0.07]', badge: 'bg-emerald-500/15 text-emerald-300', label: 'text-emerald-300' },
  bad: { wrap: 'border-rose-500/20 bg-rose-500/[0.07]', badge: 'bg-rose-500/15 text-rose-300', label: 'text-rose-300' },
  info: { wrap: 'border-white/10 bg-white/[0.03]', badge: 'bg-white/10 text-white/60', label: 'text-white/60' },
};

function Panel({ tone, icon, title, text }) {
  const t = TONES[tone];
  return (
    <div className={`rounded-2xl border p-4 ${t.wrap}`}>
      <div className="mb-1.5 flex items-center gap-2">
        <span className={`grid h-5 w-5 place-items-center rounded-md text-[11px] font-bold ${t.badge}`}>
          {icon}
        </span>
        <span className={`text-xs font-semibold uppercase tracking-wide ${t.label}`}>{title}</span>
      </div>
      <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-white/75">{text}</p>
    </div>
  );
}
