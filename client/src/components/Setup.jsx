import { useState } from 'react';
import Background from './Background';

const ROLES = [
  { name: 'Frontend Developer', icon: '🎨', blurb: 'UI, React, CSS, browser APIs' },
  { name: 'Backend Developer', icon: '⚙️', blurb: 'APIs, databases, system design' },
  { name: 'Full Stack Developer', icon: '🧩', blurb: 'End-to-end web engineering' },
];

const DIFFICULTIES = [
  { name: 'Easy', blurb: 'Fundamentals', dot: 'bg-emerald-400' },
  { name: 'Medium', blurb: 'Applied skills', dot: 'bg-amber-400' },
  { name: 'Hard', blurb: 'System design', dot: 'bg-rose-400' },
];

const TOPICS = {
  'Frontend Developer': [
    'React & Hooks', 'JavaScript Core', 'CSS & Layout', 'Performance',
    'Accessibility', 'TypeScript', 'Testing', 'Browser APIs',
  ],
  'Backend Developer': [
    'Node.js', 'REST API Design', 'Databases & SQL', 'System Design',
    'Auth & Security', 'Caching', 'Message Queues', 'DevOps & CI/CD',
  ],
  'Full Stack Developer': [
    'React & Node.js', 'API Design', 'Databases', 'System Design',
    'Auth flows', 'Performance', 'TypeScript', 'Testing',
  ],
};

const FEATURES = [
  ['5', 'tailored questions'],
  ['10', 'point scoring'],
  ['1', 'session report'],
];

export default function Setup({ onStart, onHistory }) {
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');

  const topics = role ? TOPICS[role] : [];
  const ready = role && difficulty;

  function handleRoleChange(r) {
    setRole(r);
    setTopic(''); // reset topic when role changes
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (ready) onStart(role, difficulty, topic);
  }

  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-[1.1fr_1fr]">
      <Background />

      {/* Left — brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/8 p-12 lg:flex xl:p-16">
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/40">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">AI Interviewer</span>
          </div>
          <button
            onClick={onHistory}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-all hover:border-white/20 hover:text-white"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
            </svg>
            History
          </button>
        </div>

        <div className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/60">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
            </span>
            Powered by Gemini
          </div>
          <h1 className="max-w-md text-5xl font-extrabold leading-[1.05] tracking-tight text-white xl:text-6xl">
            Ace your next{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              tech interview
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/50">
            A realistic mock interview that adapts to your role, topic, and difficulty — then tells you exactly how to improve.
          </p>
        </div>

        <div className="flex gap-8 animate-fade-up delay-200">
          {FEATURES.map(([n, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold text-white">{n}</p>
              <p className="mt-1 max-w-[7rem] text-xs leading-snug text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — configurator */}
      <div className="flex min-h-screen flex-col px-6 py-8 sm:px-10 sm:py-12">
        {/* Mobile header */}
        <div className="mb-7 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">AI Interviewer</span>
          </div>
          <button
            onClick={onHistory}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-all hover:border-white/20 hover:text-white"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
            </svg>
            History
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-center animate-fade-up delay-100">
          <div className="max-w-md w-full mx-auto lg:mx-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/80">
              Configure
            </p>
            <h2 className="mb-6 text-xl font-bold text-white">Set up your session</h2>

            {/* Role */}
            <Label>Role</Label>
            <div className="mb-5 space-y-2">
              {ROLES.map((r) => {
                const active = role === r.name;
                return (
                  <button
                    type="button"
                    key={r.name}
                    onClick={() => handleRoleChange(r.name)}
                    className={`group flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                      active
                        ? 'border-violet-400/50 bg-violet-500/10 shadow-lg shadow-violet-900/30'
                        : 'border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg transition-colors ${active ? 'bg-violet-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                      {r.icon}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-white">{r.name}</span>
                      <span className="block text-xs text-white/45">{r.blurb}</span>
                    </span>
                    <Check active={active} />
                  </button>
                );
              })}
            </div>

            {/* Topic — slides in once role is chosen */}
            {role && (
              <div className="mb-5 animate-fade-up">
                <Label>Topic <span className="ml-1 text-white/30 normal-case tracking-normal font-normal">(optional)</span></Label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => {
                    const active = topic === t;
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTopic(active ? '' : t)}
                        className={`rounded-xl border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
                          active
                            ? 'border-violet-400/50 bg-violet-500/15 text-violet-200 shadow-md shadow-violet-900/30'
                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Difficulty */}
            <Label>Difficulty</Label>
            <div className="mb-7 grid grid-cols-3 gap-2.5">
              {DIFFICULTIES.map((d) => {
                const active = difficulty === d.name;
                return (
                  <button
                    type="button"
                    key={d.name}
                    onClick={() => setDifficulty(d.name)}
                    className={`rounded-2xl border p-3 text-left transition-all duration-200 ${
                      active
                        ? 'border-violet-400/50 bg-violet-500/10 shadow-lg shadow-violet-900/30'
                        : 'border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className={`mb-2 block h-2 w-2 rounded-full ${d.dot}`} />
                    <span className="block text-sm font-semibold text-white">{d.name}</span>
                    <span className="mt-0.5 block text-[11px] leading-tight text-white/45">{d.blurb}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={!ready}
              className="group w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-all duration-200 enabled:hover:shadow-xl enabled:hover:shadow-violet-800/50 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="flex items-center justify-center gap-2">
                {ready ? 'Start Interview' : 'Select role & difficulty'}
                {ready && (
                  <svg className="h-4 w-4 transition-transform group-enabled:group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Label({ children }) {
  return <p className="mb-2.5 text-[13px] font-medium text-white/55">{children}</p>;
}

function Check({ active }) {
  return (
    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all ${active ? 'border-violet-400 bg-violet-500' : 'border-white/15'}`}>
      {active && (
        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
        </svg>
      )}
    </span>
  );
}
