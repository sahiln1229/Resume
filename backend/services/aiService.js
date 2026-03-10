const { GoogleGenAI } = require('@google/genai');

// Use the new SDK if API key is provided
let ai;
if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

/**
 * Calls Gemini API to analyze resume text and return structured JSON
 * @param {string} resumeText - The extracted text from the resume
 * @returns {Promise<Object>} - The structured AI analysis
 */
const analyzeResumeWithAI = async (resumeText) => {
    if (!ai || !process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const prompt = `
You are an expert resume reviewer and career coach.
Analyze the following resume and provide structured improvements.

Tasks:
1 Improve bullet points using strong action verbs
2 Detect grammar issues
3 Suggest missing skills for the job role
4 Recommend projects to strengthen the resume
5 Improve experience descriptions
6 Generate a professional LinkedIn summary
7 Give a resume score out of 100
8 Generate 10 interview questions based on the resume (HR, Technical, Project, Problem-Solving)

Return the output AT ALL TIMES as a STRICT, VALID JSON object matching the exact structure below. Do not wrap it in markdown blockquotes or add any extra text outside the JSON.

JSON Structure Requirements:
{
  "resumeScore": number, // out of 100
  "improvedBulletPoints": [
    {
      "original": "string - snippet from resume",
      "improved": "string - suggested improved version",
      "impact": "string - short categorization like 'Leadership', 'Performance'"
    }
  ],
  "grammarSuggestions": [
    {
      "error": "string - original text",
      "correction": "string - suggested fix",
      "type": "string - e.g., 'Tone', 'Action Verb', 'Grammar'"
    }
  ],
  "missingSkills": ["string"],
  "projectSuggestions": ["string"],
  "linkedinSummary": "string",
  "sectionFeedback": [
    {
      "section": "string - e.g. 'Experience', 'Education', 'Skills'",
      "score": number, // out of 100
      "feedback": "string",
      "status": "string - either 'Elite', 'Strong', or 'Improve'"
    }
  ],
  "interviewQuestions": ["string"]
}

Resume Text:
"""
${resumeText.substring(0, 15000)}
"""`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2, // Keep it deterministic
                responseMimeType: "application/json" // Force JSON output if possible (some environments support this natively in the SDK, otherwise we rely on the prompt)
            }
        });

        let textResponse = response.text;

        // Safety fallback: if it returned markdown wrapped json
        if (textResponse.startsWith('```json')) {
            textResponse = textResponse.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (textResponse.startsWith('```')) {
            textResponse = textResponse.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        return JSON.parse(textResponse);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new Error("Failed to analyze resume with AI.");
    }
};

module.exports = {
    analyzeResumeWithAI
};
