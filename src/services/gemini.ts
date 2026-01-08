import { StudentProfile } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface GeminiResponse {
  solution: string;
  explanation: string;
}

export const generateAnswer = async (
  question: string,
  imageBase64: string | null,
  profile: StudentProfile
): Promise<GeminiResponse> => {
  if (!API_KEY || API_KEY === "YOUR_API_KEY") {
    throw new Error("Gemini API Key is missing. Please add it to the .env file.");
  }

  const prompt = `
    You are an expert academic tutor for Pakistani students.
    Student Context:
    - Grade: ${profile.grade}
    - Subject: ${profile.subject}
    - Province/Curriculum: ${profile.province}

    Task:
    1. Analyze the user's question (and image if provided).
    2. Provide a "Right Solution" (direct answer/steps).
    3. Provide an "Explanation" (conceptual understanding).

    Rules:
    - Match the language complexity to ${profile.grade} level.
    - Use simple English.
    - Keep sentences short and clear.
    - Avoid advanced jargon unless necessary for the subject.
    - Format the output strictly as JSON with keys: "solution" and "explanation".
    
    User Question: ${question}
  `;

  const parts: any[] = [{ text: prompt }];

  if (imageBase64) {
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    });
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
            responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch response from Gemini');
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error('No response generated');
    }

    try {
        return JSON.parse(textResponse);
    } catch (e) {
        // Fallback if JSON parsing fails (though responseMimeType should prevent this)
        return {
            solution: "Here is the answer based on your request.",
            explanation: textResponse
        }
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
