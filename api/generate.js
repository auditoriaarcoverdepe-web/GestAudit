export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    // Use Google Generative AI API with gemini-1.5-pro
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

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return res.status(response.status).json({ 
        error: `Gemini API Error: ${errorText}` 
      });
    }

    const data = await response.json();

    // Extract text from Gemini response
    let text = '';
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
    } else {
      text = JSON.stringify(data, null, 2);
    }

    return res.status(200).json({ text });

  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: `Server error: ${error.message}` 
    });
  }
}
