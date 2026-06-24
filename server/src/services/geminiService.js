import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-2.5-flash';

export async function getNextQuestion({ role, difficulty, topic, history }) {
  const systemInstruction = buildSystemPrompt(role, difficulty, topic);
  const contents = buildContents(history, 'question', null, null, topic);

  return ai.models.generateContentStream({
    model: MODEL,
    contents,
    config: { systemInstruction, maxOutputTokens: 1024 },
  });
}

export async function evaluateAnswer({ role, difficulty, topic, history, question, answer }) {
  const systemInstruction = buildSystemPrompt(role, difficulty, topic);
  const contents = buildContents(history, 'evaluate', question, answer, topic);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          whatWasGood: { type: Type.STRING },
          whatWasMissing: { type: Type.STRING },
          modelAnswer: { type: Type.STRING },
        },
        required: ['score', 'whatWasGood', 'whatWasMissing', 'modelAnswer'],
        propertyOrdering: ['score', 'whatWasGood', 'whatWasMissing', 'modelAnswer'],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function generateSummary({ role, difficulty, topic, questionAnswerPairs }) {
  const systemInstruction = buildSystemPrompt(role, difficulty, topic);

  const historyText = questionAnswerPairs
    .map(
      (qa, i) =>
        `Q${i + 1}: ${qa.question}\nAnswer: ${qa.answer}\nScore: ${qa.score}/10\nFeedback: ${qa.feedback}`
    )
    .join('\n\n');

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Here is the complete interview session for a ${role} role at ${difficulty} difficulty:\n\n${historyText}\n\nProvide a final session summary. Each string field must be plain prose with no markdown.`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          grade: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
        },
        required: ['overallScore', 'grade', 'strengths', 'areasToImprove', 'recommendation'],
        propertyOrdering: [
          'overallScore',
          'grade',
          'strengths',
          'areasToImprove',
          'recommendation',
        ],
      },
    },
  });

  return JSON.parse(response.text);
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

function buildContents(history, mode, question = null, answer = null, topic = '') {
  const contents = [];

  for (const turn of history) {
    contents.push({ role: 'user', parts: [{ text: turn.userMessage }] });
    contents.push({ role: 'model', parts: [{ text: turn.assistantMessage }] });
  }

  if (mode === 'question') {
    const topicInstruction = topic
      ? `- The question must be specifically about ${topic}.`
      : '';

    const instructions = `Output requirements for the question:
- Return ONLY the interview question itself. No greetings, no "Welcome back", no lead-in or commentary.
- Do NOT number the question or write "Question N" — progress is tracked separately.
${topicInstruction}
- Use absolutely no markdown: no **bold**, no \`backticks\`, no * or - bullet lists. Write code, table, or column names as plain words (e.g. users, id (PK)).
- If the question includes a schema or multiple parts, separate them with real line breaks (newlines) rather than one long paragraph.`;

    contents.push({
      role: 'user',
      parts: [
        {
          text:
            history.length === 0
              ? `Ask the first interview question.\n\n${instructions}`
              : `Ask the next interview question. Make it different from previous questions.\n\n${instructions}`,
        },
      ],
    });
  } else if (mode === 'evaluate') {
    contents.push({
      role: 'user',
      parts: [
        {
          text: `Question: ${question}\n\nMy answer: ${answer}\n\nEvaluate my answer. Give a score from 1-10, what was good, what was missing, and a brief ideal answer outline. Each field must be plain prose with no markdown.`,
        },
      ],
    });
  }

  return contents;
}
