/* eslint-disable */
// done TODO: Import whatever service you decide to use. i.e. `import OpenAI from 'openai';`
import OpenAI from 'openai';
// HINT: You'll want to initialize your service outside of the function definition

// TODO: Implement the function below
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateResponse(message: string): Promise<string> {
  const completion = await openai.chat.completions.create ({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a species expert chatbot. Only answer questions about animals. If asked about anything else, politely redirect to species topics."
      },
      {
        role: "user",
        content: message
      }
    ],

  });

  return completion.choices[0]?.message?.content || "Unable to generate response."
}
