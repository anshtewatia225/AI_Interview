const BASE = `${import.meta.env.VITE_API_URL ?? ''}/api/interview`;

async function streamRequest(url, body, onChunk) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) onChunk(parsed.text);
        } catch {
          // ignore malformed chunks
        }
      }
    }
  }
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

export async function fetchQuestion(role, difficulty, topic, history, onChunk) {
  await streamRequest(`${BASE}/question`, { role, difficulty, topic, history }, onChunk);
}

export async function submitAnswer(role, difficulty, topic, history, question, answer) {
  return postJson(`${BASE}/answer`, { role, difficulty, topic, history, question, answer });
}

export async function finishSession(role, difficulty, topic, questionAnswerPairs) {
  return postJson(`${BASE}/finish`, { role, difficulty, topic, questionAnswerPairs });
}

export async function getSessions() {
  const res = await fetch(`${BASE}/sessions`);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}
