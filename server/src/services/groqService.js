import Groq from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

export async function getNextQuestion({ role, difficulty, topic, history }) {
  const messages = buildMessages(buildSystemPrompt(role, difficulty, topic), history, 'question', null, null, topic);

  return client.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: 1024,
    stream: true,
  });
}

export async function evaluateAnswer({ role, difficulty, topic, history, question, answer }) {
  const messages = buildMessages(buildSystemPrompt(role, difficulty, topic), history, 'evaluate', question, answer, topic);

  const response = await client.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: 2048,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'feedback',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            whatWasGood: { type: 'string' },
            whatWasMissing: { type: 'string' },
            modelAnswer: { type: 'string' },
          },
          required: ['score', 'whatWasGood', 'whatWasMissing', 'modelAnswer'],
          additionalProperties: false,
        },
      },
    },
  });

  return JSON.parse(response.choices[0].message.content);
}

export async function generateSummary({ role, difficulty, topic, questionAnswerPairs }) {
  const historyText = questionAnswerPairs
    .map(
      (qa, i) =>
        `Q${i + 1}: ${qa.question}\nAnswer: ${qa.answer}\nScore: ${qa.score}/10\nFeedback: ${qa.feedback}`
    )
    .join('\n\n');

  const messages = [
    { role: 'system', content: buildSystemPrompt(role, difficulty, topic) },
    {
      role: 'user',
      content: `Here is the complete interview session for a ${role} role at ${difficulty} difficulty:\n\n${historyText}\n\nProvide a final session summary. Each string field must be plain prose with no markdown.`,
    },
  ];

  const response = await client.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: 2048,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'summary',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            overallScore: { type: 'number' },
            grade: { type: 'string' },
            strengths: { type: 'array', items: { type: 'string' } },
            areasToImprove: { type: 'array', items: { type: 'string' } },
            recommendation: { type: 'string' },
          },
          required: ['overallScore', 'grade', 'strengths', 'areasToImprove', 'recommendation'],
          additionalProperties: false,
        },
      },
    },
  });

  return JSON.parse(response.choices[0].message.content);
}

function buildSystemPrompt(role, difficulty, topic) {
  const topicLine = topic
    ? `- Focus all questions specifically on the topic: ${topic}`
    : '- Cover a broad range of relevant technical topics';

  return `You are an expert technical interviewer conducting a ${difficulty} difficulty interview for a ${role} position.

Your behavior:
- Ask one focused technical question at a time
${topicLine}
- Evaluate answers fairly and constructively
- Adjust question complexity to the difficulty level: Easy (fundamentals), Medium (practical application), Hard (advanced/system design)
- Be professional and encouraging
- Write all text as plain prose. Never use markdown formatting (no **bold**, no backticks, no bullet characters like * or -)`;
}

function buildMessages(systemPrompt, history, mode, question = null, answer = null, topic = '') {
  const messages = [{ role: 'system', content: systemPrompt }];

  for (const turn of history) {
    messages.push({ role: 'user', content: turn.userMessage });
    messages.push({ role: 'assistant', content: turn.assistantMessage });
  }

  if (mode === 'question') {
    const topicInstruction = topic ? `- The question must be specifically about ${topic}.` : '';

    const instructions = `Output requirements for the question:
- Return ONLY the interview question itself. No greetings, no "Welcome back", no lead-in or commentary.
- Do NOT number the question or write "Question N" — progress is tracked separately.
${topicInstruction}
- Use absolutely no markdown: no **bold**, no \`backticks\`, no * or - bullet lists. Write code, table, or column names as plain words.
- If the question includes a schema or multiple parts, separate them with real line breaks rather than one long paragraph.`;

    messages.push({
      role: 'user',
      content:
        history.length === 0
          ? `Ask the first interview question.\n\n${instructions}`
          : `Ask the next interview question. Make it different from previous questions.\n\n${instructions}`,
    });
  } else if (mode === 'evaluate') {
    messages.push({
      role: 'user',
      content: `Question: ${question}\n\nMy answer: ${answer}\n\nEvaluate my answer. Give a score from 1-10, what was good, what was missing, and a brief ideal answer outline. Each field must be plain prose with no markdown.`,
    });
  }

  return messages;
}
