import ScoreRing from './ScoreRing';

const GRADE_GRADIENT = {
  A: 'from-emerald-400 to-teal-400',
  B: 'from-sky-400 to-indigo-400',
  C: 'from-amber-400 to-yellow-400',
  D: 'from-orange-400 to-amber-400',
  F: 'from-rose-400 to-red-400',
};

export default function Sidebar({
  role,
  difficulty,
  topic,
  questionNumber,
  total,
  qaLog,
  complete = false,
  grade,
}) {
  const answered = qaLog.length;
  const avg = answered ? qaLog.reduce((s, q) => s + q.score, 0) / answered : 0;

  return (
    <aside className="sticky top-0 hidden h-screen w-[300px] shrink-0 flex-col border-r border-white/8 bg-white/[0.02] p-7 backdrop-blur-xl lg:flex">
      {/* Brand */}
      <div className="mb-9 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/40">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-white">AI Interviewer</p>
          <p className="mt-1 text-[11px] text-white/40">{complete ? 'Results' : 'Live session'}</p>
        </div>
      </div>

      {/* Session meta */}
      <div className="mb-7 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <p className="mb-2 text-[11px] uppercase tracking-wider text-white/35">Session</p>
        <p className="text-sm font-semibold text-white">{role}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-block rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] font-medium text-violet-300">
            {difficulty}
          </span>
          {topic && (
            <span className="inline-block rounded-md bg-white/8 px-2 py-0.5 text-[11px] font-medium text-white/55">
              {topic}
            </span>
          )}
        </div>
      </div>

      {/* Vertical stepper */}
      <div className="flex-1 overflow-y-auto">
        <p className="mb-4 text-[11px] uppercase tracking-wider text-white/35">Questions</p>
        <ol className="relative">
          {Array.from({ length: total }).map((_, i) => {
            const qa = qaLog[i];
            const done = i < answered;
            const active = !complete && !done && i === questionNumber - 1;
            const last = i === total - 1;
            return (
              <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
                {!last && (
                  <span
                    className={`absolute left-[13px] top-7 h-[calc(100%-1.25rem)] w-px ${
                      done ? 'bg-violet-500/50' : 'bg-white/10'
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold transition-all ${
                    done
                      ? 'border-violet-400 bg-violet-500 text-white'
                      : active
                      ? 'border-violet-400 bg-violet-500/15 text-violet-300'
                      : 'border-white/15 text-white/35'
                  }`}
                >
                  {done ? (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                  {active && (
                    <span className="absolute inset-0 animate-ping rounded-full border border-violet-400" />
                  )}
                </span>
                <div className="pt-1">
                  <p
                    className={`text-[13px] font-medium ${
                      done || active ? 'text-white/85' : 'text-white/40'
                    }`}
                  >
                    Question {i + 1}
                  </p>
                  {qa ? (
                    <p className="text-[11px] text-white/40">Scored {qa.score}/10</p>
                  ) : active ? (
                    <p className="text-[11px] text-violet-300/80">In progress…</p>
                  ) : (
                    <p className="text-[11px] text-white/25">Pending</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Footer score */}
      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <ScoreRing score={avg} size={62} stroke={6} showLabel={false} />
        {complete ? (
          <div>
            <p
              className={`bg-gradient-to-br ${
                GRADE_GRADIENT[grade] || 'from-white/60 to-white/40'
              } bg-clip-text text-3xl font-extrabold leading-none text-transparent`}
            >
              {grade}
            </p>
            <p className="mt-1 text-[11px] text-white/40">Final grade</p>
          </div>
        ) : (
          <div>
            <p className="text-2xl font-bold leading-none text-white">
              {answered ? avg.toFixed(1) : '—'}
            </p>
            <p className="mt-1 text-[11px] text-white/40">
              {answered} of {total} answered
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
