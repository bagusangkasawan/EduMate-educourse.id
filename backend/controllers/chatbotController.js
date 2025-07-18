import asyncHandler from 'express-async-handler';

const askChatbot = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const system = process.env.GEMINI_SYSTEM_PROMPT;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.status(500);
    throw new Error('Gemini API key not configured on server.');
  }

  if (!message) {
    res.status(400);
    throw new Error('Message is required.');
  }

  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${message}`
                }
              ]
            }
          ],
          systemInstruction: {
            parts: [
              {
                text: `${system}`
              }
            ]
          },
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Failed to get response from AI.');
    }

    const result = await response.json();

    if (result.candidates?.length > 0) {
      res.json({
        reply: result.candidates[0].content.parts[0].text
      });
    } else {
      res.json({
        reply: 'Maaf, saya tidak dapat merespons. Coba pertanyaan lain.'
      });
    }
  } catch (error) {
    res.status(res.statusCode >= 400 ? res.statusCode : 500);
    throw new Error(error.message);
  }
});

export { askChatbot };
