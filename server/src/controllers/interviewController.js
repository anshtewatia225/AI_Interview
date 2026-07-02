import { getNextQuestion, evaluateAnswer, generateSummary } from '../services/groqService.js';
import Session from '../models/Session.js';

export async function startQuestion(req, res) {
  const { role, difficulty, topic = '', history = [] } = req.body;

  if (!role || !difficulty) {
    return res.status(400).json({ error: 'role and difficulty are required' });
  }

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await getNextQuestion({ role, difficulty, topic, history });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('startQuestion error:', err);
    res.status(500).json({ error: 'Failed to generate question' });
  }
}

export async function submitAnswer(req, res) {
  const { role, difficulty, topic = '', history = [], question, answer } = req.body;

  if (!role || !difficulty || !question || !answer) {
    return res.status(400).json({ error: 'role, difficulty, question, and answer are required' });
  }

  try {
    const feedback = await evaluateAnswer({ role, difficulty, topic, history, question, answer });
    res.json(feedback);
  } catch (err) {
    console.error('submitAnswer error:', err);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
}

export async function finishSession(req, res) {
  const { role, difficulty, topic = '', questionAnswerPairs } = req.body;

  if (!role || !difficulty || !questionAnswerPairs?.length) {
    return res.status(400).json({ error: 'role, difficulty, and questionAnswerPairs are required' });
  }

  try {
    const summary = await generateSummary({ role, difficulty, topic, questionAnswerPairs });
    res.json(summary);

    try {
      await Session.create({
        role,
        difficulty,
        topic,
        questions: questionAnswerPairs,
        ...summary,
        completedAt: new Date(),
      });
    } catch (dbErr) {
      console.warn('Failed to save session to DB:', dbErr.message);
    }
  } catch (err) {
    console.error('finishSession error:', err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
}

export async function getSessions(req, res) {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 }).limit(20);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}
