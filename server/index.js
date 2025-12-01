import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5178;

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  const useReal = process.env.USE_REAL_GEMINI === '1' || !!apiKey;

  if (!useReal) {
    // Mock response for local development when no key provided.
    return res.json({ text: `Mock: Relatório gerado com base no prompt (tamanho ${String(prompt).length}):\n\n${String(prompt).slice(0, 1000)}` });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set in environment' });
  }

  try {
    // Use the Google Generative AI REST API for Gemini 1.5 Pro
    const model = 'gemini-1.5-pro';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const txt = await r.text();
      console.error('API Error:', txt);
      return res.status(r.status).json({ error: `API Error: ${txt}` });
    }

    const json = await r.json();

    // Extract text from Gemini API response
    let text = '';
    if (json?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = json.candidates[0].content.parts[0].text;
    } else {
      text = JSON.stringify(json, null, 2);
    }

    return res.json({ text });
  } catch (err) {
    console.error('generate error', err);
    return res.status(500).json({ error: `Error: ${String(err)}` });
  }
});

app.listen(PORT, () => {
  console.log(`AI proxy server listening on http://localhost:${PORT}`);
});
