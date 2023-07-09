
import api from '@forge/api'

export async function sendMessage(message) {
  try {
    const response = await api.fetch('https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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', // Replace with your API key
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: message }],
      })
    },
    );

    // Get the assistant's reply
    const reply = response;
    return reply;
  }
   catch (error) {
    console.error(error.message);
    return "error"
  }
}