import axios from 'axios';
import * as Haptics from 'expo-haptics';
import { uploadMessage } from '../lib/supabase-functions';

const API_KEY = 'sk-proj-swSlVBjCcBFln4uLkXqbT3BlbkFJZsnxH0wY8paQAPNh8sG7'; // Replace with your actual API key
const API_URL = 'https://api.openai.com/v1/chat/completions';

const aiHapticFeedback = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export async function generateChatResponse(messages: { role: string; content: string }[], userId: string): Promise<string> {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant. Format your responses using markdown when appropriate." },
          ...messages.slice(-10) // Include only the last 10 messages
        ],
        temperature: 1,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content || "Sorry, I couldn't generate a response.";

    await uploadMessage({
      content: aiResponse,
      role: 'ai',
      user_data_id: userId,
    });

    await aiHapticFeedback();

    return aiResponse;
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "Sorry, there was an error generating the response.";
  }
}

export async function sendUserMessage(content: string, userId: string): Promise<void> {
  try {
    await uploadMessage({
      content,
      role: 'user',
      user_data_id: userId,
    });
  } catch (error) {
    console.error('Error uploading user message:', error);
  }
}
