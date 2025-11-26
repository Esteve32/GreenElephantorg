import OpenAI from 'openai';

const thesysClient = new OpenAI({
  apiKey: process.env.THESYS_API_KEY,
  baseURL: 'https://api.thesys.dev/v1/embed'
});

export async function generateDashboardUI(prompt: string, data?: any) {
  const systemPrompt = `You are a UI generator for GreenElephant's Conscious Communication dashboard. 
Generate clean, modern UI components that display communication lens data.
Use soft, muted colors appropriate for the communication lenses:
- Influence: #cc3333 (red)
- Attitude: #ff9933 (orange)  
- Chaordic: #ffcc00 (yellow)
- Flow: #cccc33 (green-yellow)
- Alignment: #669966 (sage green)
- Needs: #009999 (teal)
- Ego: #3399cc (blue)
- Wisdom: #663399 (purple)

When showing data, use cards, charts, or tables as appropriate.
Keep the design clean and professional with good spacing.`;

  const userMessage = data 
    ? `${prompt}\n\nHere is the data to visualize:\n${JSON.stringify(data, null, 2)}`
    : prompt;

  try {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250930',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Thesys API error:', error);
    throw error;
  }
}

export async function streamDashboardUI(prompt: string, data?: any) {
  const systemPrompt = `You are a UI generator for GreenElephant's Conscious Communication dashboard.
Generate clean, modern UI components that display communication lens data.`;

  const userMessage = data 
    ? `${prompt}\n\nData:\n${JSON.stringify(data, null, 2)}`
    : prompt;

  const stream = await thesysClient.chat.completions.create({
    model: 'c1/anthropic/claude-sonnet-4/v-20250930',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    stream: true
  });

  return stream;
}
