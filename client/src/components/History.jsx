import { useEffect, useState } from 'react';
import { getSessions } from '../api/interview';
import Background from './Background';

const GRADE_GRADIENT = {
  A: 'from-emerald-400 to-teal-400',
  B: 'from-sky-400 to-indigo-400',
  C: 'from-amber-400 to-yellow-400',
  D: 'from-orange-400 to-amber-400',
  F: 'from-rose-400 to-red-400',
};

const DIFF_DOT = {
  Easy: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  Hard: 'bg-rose-400',
};

export default function History({ onBack }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 animate-fade-in">
          <button
            onClick={onBack}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-white/20 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Session History</h1>
            <p className="text-sm text-white/45">Your past interview sessions</p>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-24 rounded-2xl" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-300">
            Failed to load sessions: {error}
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-white/60 text-sm">No sessions yet. Complete an interview to see your history.</p>
          </div>
        )}

        {/* Session list */}
        {!loading && !error && sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((s) => {
              const isOpen = expanded === s._id;
              const avg = s.overallScore ?? (s.questions?.length
                ? s.questions.reduce((acc, q) => acc + (q.score || 0), 0) / s.questions.length
                : 0);
              const grade = s.grade || getGrade(avg);
              const date = new Date(s.completedAt || s.createdAt);

              return (
                <div
                  key={s._id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all animate-fade-up"
                >
                  {/* Row */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : s._id)}
                    className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Grade badge */}
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${GRADE_GRADIENT[grade] || 'from-white/40 to-white/20'} text-xl font-extrabold text-white shadow-lg`}
                    >
                      {grade}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{s.role}</span>
                        <span className="flex items-center gap-1 rounded-md bg-white/8 px-1.5 py-0.5 text-[11px] text-white/55">
                          <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT[s.difficulty] || 'bg-white/30'}`} />
                          {s.difficulty}
                        </span>
                        {s.topic && (
                          <span className="rounded-md bg-violet-500/15 px-1.5 py-0.5 text-[11px] font-medium text-violet-300">
                            {s.topic}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-white/40">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' · '}
                        {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold text-white tabular-nums">
                        {typeof avg === 'number' ? avg.toFixed(1) : '—'}
                        <span className="text-sm font-medium text-white/35">/10</span>
                      </p>
                      <p className="text-[11px] text-white/35">avg score</p>
                    </div>

                    <svg
                      className={`ml-1 h-4 w-4 shrink-0 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-white/8 px-5 pb-5 pt-4 animate-fade-in">
                      {/* Strengths / Areas */}
                      {(s.strengths?.length > 0 || s.areasToImprove?.length > 0) && (
                        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {s.strengths?.length > 0 && (
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-3.5">
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                                Strengths
                              </p>
                              <ul className="space-y-1.5">
                                {s.strengths.map((str, i) => (
                                  <li key={i} className="flex gap-2 text-[12px] text-white/70">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                    {str}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {s.areasToImprove?.length > 0 && (
                            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.07] p-3.5">
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-rose-300">
                                Areas to Improve
                              </p>
                              <ul className="space-y-1.5">
                                {s.areasToImprove.map((a, i) => (
                                  <li key={i} className="flex gap-2 text-[12px] text-white/70">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Per-question breakdown */}
                      {s.questions?.length > 0 && (
                        <div className="space-y-2">
                          {s.questions.map((q, i) => {
                            const sc = q.score ?? 0;
                            const scoreColor =
                              sc >= 8 ? 'text-emerald-300' : sc >= 5 ? 'text-amber-300' : 'text-rose-300';
                            const barColor =
                              sc >= 8 ? 'bg-emerald-400' : sc >= 5 ? 'bg-amber-400' : 'bg-rose-400';
                            return (
                              <div
                                key={i}
                                className="rounded-2xl border border-white/8 bg-white/[0.02] p-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="line-clamp-2 text-[12px] font-medium text-white/75">
                                    <span className="mr-1.5 text-white/35">Q{i + 1}</span>
                                    {q.question}
                                  </p>
                                  <span className={`shrink-0 text-sm font-bold tabular-nums ${scoreColor}`}>
                                    {sc}<span className="text-white/30">/10</span>
                                  </span>
                                </div>
                                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
                                  <div
                                    className={`h-full rounded-full ${barColor}`}
                                    style={{ width: `${sc * 10}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
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
