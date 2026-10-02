import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Server-side Google GenAI instance with required headers
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiProvider: GEMINI_API_KEY ? 'gemini' : (OPENAI_API_KEY ? 'openai' : 'local'),
    hasApiKey: Boolean(GEMINI_API_KEY || (OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-')))
  });
});

// Helper for intelligent fallback response if external AI APIs are unreachable or out of credits
function generateLocalFallbackChat(lastUserMessage: string, userContext?: any): string {
  const q = lastUserMessage.toLowerCase();
  const userName = userContext?.name || 'Member';

  if (q.includes('credit') || q.includes('time credit') || q.includes('earn') || q.includes('bonus')) {
    return `Hi ${userName}! On LearnX, 1 Time Credit equals approximately 1 hour of verified community learning value.

Here is how credits work:
• 🎁 **Welcome Bonus**: Every newly registered user receives 5 Free Time Credits immediately upon sign-up.
• 🎓 **Earn Credits**: Host and complete 1 hour of verified teaching to earn +1 Time Credit.
• 📘 **Spend Credits**: Book 1-on-1 sessions with verified mentors (-1 Credit per hour).
• 🤝 **Reciprocity**: Time Credits are community exchange units, not money, encouraging reciprocal knowledge sharing!`;
  }

  if (q.includes('teach') || q.includes('python') || q.includes('skill') || q.includes('agenda')) {
    return `Great question, ${userName}! When structuring a 45-minute peer session:
1. **0-5 min**: Icebreaker & goal alignment (confirm what the learner wants to build).
2. **5-25 min**: Interactive walk-through or live coding using the in-session Whiteboard and Screen Share.
3. **25-40 min**: Hands-on practice where the learner writes or explains code with your real-time guidance.
4. **40-45 min**: Summary, Q&A, and both participants confirming completion to transfer the 1 Time Credit.

You can launch a live room anytime from the "Live" tab!`;
  }

  if (q.includes('match') || q.includes('swap') || q.includes('peer') || q.includes('find')) {
    return `Hi ${userName}! To find the best peer match:
• Switch to **LEARN MODE** on the Home tab to browse mentors offering skills you want.
• Switch to **TEACH MODE** to see members seeking what you can teach.
• Visit the **Exchange** tab for computed Direct Mutual Matches where you and a partner can directly trade knowledge!`;
  }

  return `Hello ${userName}! As your LearnX Assistant, I'm here to support your peer skill exchange journey. You can ask me how to structure an agenda, find mentors in Python, Web Development, or Design, or learn how Time Credits work. How can I help you today?`;
}

// API Route: AI Assistant Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    const systemPrompt = `You are the official LearnX AI Assistant on the LearnX peer-to-peer skill exchange platform.
LearnX Tagline: "Exchange. Learn. Grow." Core principle: "Give What You're Good At. Get What You Actually Need."
Platform Rules & Guidelines:
- 1 Time Credit = approximately 1 hour of verified community learning value. Time Credits are not money.
- Newly registered users get 5 Free Time Credits upon sign-up.
- Users can switch seamlessly between LEARN MODE and TEACH MODE.
- Live video sessions include WebRTC video/audio, screen sharing, and real-time whiteboard.
- Be helpful, concise, practical, professional, and encourage reciprocal peer knowledge exchange.
- Never invent fake statistics or monetary valuations.
${userContext ? `Active user info: Name: ${userContext.name || 'Member'}, Teach: ${(userContext.canTeach || []).map((t: any) => t.name).join(', ')}, Learn: ${(userContext.wantsToLearn || []).map((w: any) => w.name).join(', ')}, Credits: ${userContext.timeCredits ?? 5}` : ''}`;

    // Try Gemini API first
    if (GEMINI_API_KEY) {
      try {
        const conversationText = messages
          .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
          .join('\n\n');

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Conversation history:\n${conversationText}\n\nRespond to the user's latest inquiry constructively and concisely.`,
          config: {
            systemInstruction: systemPrompt
          }
        });

        const reply = geminiResponse.text?.trim();
        if (reply) {
          return res.json({ reply, model: 'gemini-3.8-flash', provider: 'gemini' });
        }
      } catch (geminiError: any) {
        console.warn('Gemini generateContent error, attempting fallback:', geminiError?.message || geminiError);
      }
    }

    // Try OpenAI if configured and has credits
    if (OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-')) {
      try {
        const formattedMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        ];

        const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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

        if (openAiResponse.ok) {
          const data = (await openAiResponse.json()) as any;
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return res.json({ reply, model: 'gpt-4o-mini', provider: 'openai' });
          }
        }
      } catch (openAiError: any) {
        console.warn('OpenAI error in fallback, using local assistant:', openAiError?.message);
      }
    }

    // High quality intelligent local assistant fallback
    const localReply = generateLocalFallbackChat(lastMessage, userContext);
    return res.json({ reply: localReply, model: 'learnx-assistant-engine', provider: 'learnx' });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.json({
      reply: 'Hello! I am here to help you exchange skills, find mentors, and make the most of your Time Credits. How can I assist you today?',
      model: 'fallback',
      provider: 'learnx'
    });
  }
});

// API Route: AI Natural Language Mentor Search
app.post('/api/ai/search-mentors', async (req, res) => {
  try {
    const { query, availableMembers } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const members = Array.isArray(availableMembers) ? availableMembers : [];

    // Local heuristic search fallback function
    const localMatch = () => {
      const q = query.toLowerCase();
      const matched = members.filter((m: any) => {
        const teachMatch = (m.canTeach || []).some((s: any) => s.name?.toLowerCase().includes(q) || q.includes(s.name?.toLowerCase()));
        const learnMatch = (m.wantsToLearn || []).some((s: any) => s.name?.toLowerCase().includes(q) || q.includes(s.name?.toLowerCase()));
        const nameMatch = m.name?.toLowerCase().includes(q);
        const bioMatch = m.bio?.toLowerCase().includes(q);
        return teachMatch || learnMatch || nameMatch || bioMatch;
      });

      return {
        matchedIds: matched.map((m: any) => m.id),
        explanation: matched.length > 0
          ? `Matched ${matched.length} registered member(s) matching your request "${query}".`
          : `No direct matches found for "${query}". Try searching for Python, Java, English, or Design.`
      };
    };

    // Try Gemini first
    if (GEMINI_API_KEY && members.length > 0) {
      try {
        const systemPrompt = `You are the LearnX Search Matching Engine.
The user will provide a natural language request (e.g. "I want to learn Java from a beginner-friendly mentor").
You will match against a list of REAL registered members in JSON.
Rules:
- NEVER invent new people or fabricate names or ratings.
- Return ONLY valid JSON in format: { "matchedIds": ["id1", "id2"], "explanation": "brief reasoning" }.
- Filter and rank the provided real candidates based on skill match, skill level, and reliability.`;

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `User query: "${query}"\nAvailable registered members: ${JSON.stringify(
            members.map((m: any) => ({
              id: m.id,
              name: m.name,
              skills: (m.canTeach || []).map((s: any) => `${s.name} (${s.level})`),
              learning: (m.wantsToLearn || []).map((s: any) => s.name),
              bio: m.bio
            }))
          )}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json'
          }
        });

        const text = geminiResponse.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          return res.json(parsed);
        }
      } catch (geminiError: any) {
        console.warn('Gemini search error, falling back:', geminiError?.message || geminiError);
      }
    }

    // Try OpenAI if available
    if (OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-') && members.length > 0) {
      try {
        const systemPrompt = `You are the LearnX Search Matching Engine.
The user will provide a natural language request. Return ONLY valid JSON in format: { "matchedIds": ["id1", "id2"], "explanation": "brief reasoning" }.`;

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
                content: `User query: "${query}"\nMembers: ${JSON.stringify(
                  members.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    skills: (m.canTeach || []).map((s: any) => `${s.name} (${s.level})`),
                    learning: (m.wantsToLearn || []).map((s: any) => s.name)
                  }))
                )}`
              }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 400
          })
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return res.json(JSON.parse(content));
          }
        }
      } catch (openAiError: any) {
        console.warn('OpenAI search error:', openAiError?.message);
      }
    }

    // Robust local fallback
    return res.json(localMatch());
  } catch (error: any) {
    console.error('Error in /api/ai/search-mentors:', error);
    return res.json({ matchedIds: [], explanation: 'Search completed with default matching.' });
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
    console.log(`LearnX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
