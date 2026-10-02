import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiProvider: 'openai',
    hasApiKey: Boolean(OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-'))
  });
});

// API Route: AI Assistant Chat (Powered by OpenAI)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const systemPrompt = `You are the official LearnX AI Assistant on the LearnX peer-to-peer skill exchange platform.
LearnX Tagline: "Exchange. Learn. Grow." Core principle: "Give What You're Good At. Get What You Actually Need."
Rules:
- 1 Time Credit = approximately 1 hour of verified community learning value. Time Credits are not money.
- Always be helpful, concise, professional, and encourage reciprocal peer knowledge exchange.
- Never invent fake statistics, fake users, or monetary valuations.
${userContext ? `Active user info: Name: ${userContext.name || 'Member'}, Teach: ${(userContext.canTeach || []).map((t: any) => t.name).join(', ')}, Learn: ${(userContext.wantsToLearn || []).map((w: any) => w.name).join(', ')}` : ''}`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errData = (await response.json().catch(() => ({}))) as any;
      return res.status(response.status).json({
        error: errData.error?.message || 'OpenAI API request failed'
      });
    }

    const data = (await response.json()) as any;
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';
    return res.json({ reply, model: 'gpt-4o-mini', provider: 'openai' });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.status(500).json({ error: error.message || 'Server error processing AI request' });
  }
});

// API Route: AI Natural Language Mentor Search (Powered by OpenAI)
app.post('/api/ai/search-mentors', async (req, res) => {
  try {
    const { query, availableMembers } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const systemPrompt = `You are the LearnX Search Matching Engine.
The user will provide a natural language request (e.g. "I want to learn Java from a beginner-friendly mentor").
You will match against a list of REAL registered members in JSON.
Rules:
- NEVER invent new people or fabricate names or ratings.
- Return ONLY valid JSON in format: { "matchedIds": ["id1", "id2"], "explanation": "brief reasoning" }.
- Filter and rank the provided real candidates based on skill match, skill level, and reliability.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `User query: "${query}"\nAvailable registered members: ${JSON.stringify(
              (availableMembers || []).map((m: any) => ({
                id: m.id,
                name: m.name,
                skills: m.canTeach.map((s: any) => `${s.name} (${s.level})`),
                learning: m.wantsToLearn.map((s: any) => s.name),
                bio: m.bio
              }))
            )}`
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 400
      })
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as any;
      return res.status(response.status).json({ error: err.error?.message || 'OpenAI search failed' });
    }

    const data = (await response.json()) as any;
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/search-mentors:', error);
    return res.status(500).json({ error: error.message || 'Error processing mentor search' });
  }
});

// Setup Vite dev server middleware or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LearnX server running on http://0.0.0.0:${PORT} with OpenAI API enabled`);
  });
}

startServer();
