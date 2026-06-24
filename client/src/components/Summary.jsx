import Background from './Background';
import Sidebar from './Sidebar';

const TOTAL_QUESTIONS = 5;

export default function Summary({ role, difficulty, qaLog, summary, onRestart }) {
  const avgScore = qaLog.length
    ? qaLog.reduce((sum, qa) => sum + qa.score, 0) / qaLog.length
    : 0;
  const grade = summary?.grade || getGrade(avgScore);

  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="lg:flex">
        <Sidebar
          role={role}
          difficulty={difficulty}
          questionNumber={TOTAL_QUESTIONS + 1}
          total={TOTAL_QUESTIONS}
          qaLog={qaLog}
          complete
          grade={grade}
        />

        <main className="flex-1 px-5 py-10 sm:px-8 lg:px-14 lg:py-14">
          <div className="mx-auto max-w-3xl space-y-5 pb-10">
            {/* Title */}
            <div className="animate-fade-up">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300/80">
                Session complete
              </p>
              <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Here's how you did
              </h1>
              <p className="mt-2 text-sm text-white/45">
                {role} · {difficulty} · {qaLog.length} questions answered
              </p>
            </div>

            {/* Stat tiles (mobile shows the score; desktop has it in the rail too) */}
            <div className="grid grid-cols-3 gap-3 animate-fade-up delay-100">
              <Stat value={`${avgScore.toFixed(1)}`} sub="/ 10 average" />
              <Stat value={grade} sub="final grade" gradient />
              <Stat value={qaLog.length} sub="questions" />
            </div>

            {/* Strengths & Areas */}
            {summary && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ListCard
                  className="animate-fade-up delay-200"
                  tone="good"
                  title="Strengths"
                  items={summary.strengths}
                />
                <ListCard
                  className="animate-fade-up delay-300"
                  tone="bad"
                  title="Areas to Improve"
                  items={summary.areasToImprove}
                />
              </div>
            )}

            {/* Recommendation */}
            {summary?.recommendation && (
              <div className="animate-fade-up delay-300 rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-transparent p-6 backdrop-blur-xl">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/85">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-violet-500/20 text-[11px] text-violet-300">
                    ◆
                  </span>
                  Recommendation
                </h3>
                <p className="text-[14px] leading-relaxed text-white/70">{summary.recommendation}</p>
              </div>
            )}

            {/* Breakdown */}
            <div className="animate-fade-up delay-400 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
              <h3 className="mb-4 text-sm font-semibold text-white/80">Question Breakdown</h3>
              <div className="space-y-2.5">
                {qaLog.map((qa, i) => {
                  const tone =
                    qa.score >= 8 ? 'text-emerald-300' : qa.score >= 5 ? 'text-amber-300' : 'text-rose-300';
                  const barColor =
                    qa.score >= 8 ? 'bg-emerald-400' : qa.score >= 5 ? 'bg-amber-400' : 'bg-rose-400';
                  return (
                    <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.02] p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 text-[13px] font-medium text-white/80">
                          <span className="mr-1.5 text-white/35">Q{i + 1}</span>
                          {qa.question}
                        </p>
                        <span className={`shrink-0 text-sm font-bold tabular-nums ${tone}`}>
                          {qa.score}
                          <span className="text-white/30">/10</span>
                        </span>
                      </div>
                      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/8">
                        <div
                          className={`h-full rounded-full ${barColor} transition-all duration-700`}
                          style={{ width: `${qa.score * 10}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onRestart}
              className="animate-fade-up delay-400 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:shadow-xl hover:shadow-violet-800/50 active:scale-[0.99]"
            >
              Start New Interview
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

const GRADE_GRADIENT = {
  A: 'from-emerald-400 to-teal-400',
  B: 'from-sky-400 to-indigo-400',
  C: 'from-amber-400 to-yellow-400',
  D: 'from-orange-400 to-amber-400',
  F: 'from-rose-400 to-red-400',
};

function Stat({ value, sub, gradient }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl">
      <p
        className={`text-3xl font-extrabold leading-none ${
          gradient
            ? `bg-gradient-to-br ${GRADE_GRADIENT[value] || 'from-white to-white/60'} bg-clip-text text-transparent`
            : 'text-white'
        }`}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11px] uppercase tracking-wider text-white/40">{sub}</p>
    </div>
  );
}

function ListCard({ tone, title, items, className = '' }) {
  const styles =
    tone === 'good'
      ? { wrap: 'border-emerald-500/20', dot: 'bg-emerald-400', label: 'text-emerald-300' }
      : { wrap: 'border-rose-500/20', dot: 'bg-rose-400', label: 'text-rose-300' };

  return (
    <div className={`rounded-3xl border ${styles.wrap} bg-white/[0.03] p-5 backdrop-blur-xl ${className}`}>
      <h3 className={`mb-3 text-sm font-semibold ${styles.label}`}>{title}</h3>
      <ul className="space-y-2.5">
        {items?.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-white/70">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function getGrade(score) {
  if (score >= 9) return 'A';
  if (score >= 7) return 'B';
  if (score >= 5) return 'C';
  if (score >= 3) return 'D';
  return 'F';
}
