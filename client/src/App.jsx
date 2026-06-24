import { useState } from 'react';
import Setup from './components/Setup';
import Interview from './components/Interview';
import Summary from './components/Summary';
import History from './components/History';
import './index.css';

export default function App() {
  const [screen, setScreen] = useState('setup'); // setup | interview | summary | history
  const [config, setConfig] = useState({ role: '', difficulty: '', topic: '' });
  const [results, setResults] = useState({ qaLog: [], summary: null });

  function handleStart(role, difficulty, topic) {
    setConfig({ role, difficulty, topic });
    setScreen('interview');
  }

  function handleFinish(qaLog, summary) {
    setResults({ qaLog, summary });
    setScreen('summary');
  }

  function handleRestart() {
    setConfig({ role: '', difficulty: '', topic: '' });
    setResults({ qaLog: [], summary: null });
    setScreen('setup');
  }

  if (screen === 'setup')
    return <Setup onStart={handleStart} onHistory={() => setScreen('history')} />;

  if (screen === 'interview')
    return (
      <Interview
        role={config.role}
        difficulty={config.difficulty}
        topic={config.topic}
        onFinish={handleFinish}
      />
    );

  if (screen === 'summary')
    return (
      <Summary
        role={config.role}
        difficulty={config.difficulty}
        topic={config.topic}
        qaLog={results.qaLog}
        summary={results.summary}
        onRestart={handleRestart}
      />
    );

  if (screen === 'history')
    return <History onBack={() => setScreen('setup')} />;
}
