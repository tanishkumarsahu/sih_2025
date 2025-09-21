import { UserProfile, InternshipRecommendation } from '@/types';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Using fallback recommendations.');
    }
  }

  async enhanceRecommendations(
    profile: UserProfile, 
    baseRecommendations: InternshipRecommendation[]
  ): Promise<InternshipRecommendation[]> {
    // Temporarily disable Gemini to ensure basic flow works
    console.log('Gemini enhancement temporarily disabled - using base recommendations');
    return baseRecommendations;
    
    if (!this.apiKey) {
      return baseRecommendations;
    }

    try {
      const prompt = this.createEnhancementPrompt(profile, baseRecommendations);
      
      console.log('Calling Gemini API with URL:', `${this.baseUrl}?key=${this.apiKey.substring(0, 10)}...`);
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Gemini API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      const enhancedText = data.candidates[0]?.content?.parts[0]?.text;

      if (enhancedText) {
        return this.parseEnhancedRecommendations(enhancedText, baseRecommendations);
      }

      return baseRecommendations;
    } catch (error) {
      console.error('Gemini enhancement failed:', error);
      return baseRecommendations;
    }
  }

  private createEnhancementPrompt(profile: UserProfile, recommendations: InternshipRecommendation[]): string {
    return `
As an AI career counselor, enhance these internship recommendations for a student with the following profile:

Student Profile:
- Education: ${profile.education}
- Skills: ${profile.skills.join(', ')}
- Interests: ${profile.interests.join(', ')}
- Location: ${profile.location.city}, ${profile.location.state}
- Language: ${profile.languagePreference}
- Open to Remote: ${profile.openToRemote ? 'Yes' : 'No'}

Current Recommendations:
${recommendations.map((rec, index) => `
${index + 1}. ${rec.title} at ${rec.company}
   - Location: ${rec.location}
   - Stipend: ₹${rec.stipend}
   - Match Score: ${rec.matchScore}%
   - Current Explanation: ${rec.explanation}
`).join('')}

Please provide enhanced explanations for each recommendation that:
1. Are more personalized and specific to the student's profile
2. Highlight specific skill matches and growth opportunities
3. Explain career progression potential
4. Include cultural and language considerations if relevant
5. Keep explanations concise but compelling (2-3 sentences each)

Format your response as JSON with this structure:
{
  "recommendations": [
    {
      "id": "internship_id",
      "enhancedExplanation": "enhanced explanation text",
      "whyRecommended": "specific reasons why this matches the student"
    }
  ]
}
`;
  }

  private parseEnhancedRecommendations(
    enhancedText: string, 
    baseRecommendations: InternshipRecommendation[]
  ): InternshipRecommendation[] {
    try {
      // Extract JSON from the response
      const jsonMatch = enhancedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return baseRecommendations;
      }

      const enhancedData = JSON.parse(jsonMatch[0]);
      
      return baseRecommendations.map(rec => {
        const enhancement = enhancedData.recommendations?.find((enh: any) => enh.id === rec.id);
        
        if (enhancement) {
          return {
            ...rec,
            explanation: enhancement.enhancedExplanation || rec.explanation,
            whyRecommended: enhancement.whyRecommended || rec.whyRecommended,
          };
        }
        
        return rec;
      });
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      return baseRecommendations;
    }
  }

  async generatePersonalizedInsights(profile: UserProfile): Promise<string> {
    if (!this.apiKey) {
      return "Complete your profile to get personalized career insights!";
    }

    try {
      const prompt = `
Based on this student profile, provide 2-3 personalized career insights and tips:

Profile:
- Education: ${profile.education}
- Skills: ${profile.skills.join(', ')}
- Interests: ${profile.interests.join(', ')}
- Location: ${profile.location.city}, ${profile.location.state}

Provide practical, actionable advice for their internship search and career development.
Keep it encouraging and specific to their background.
Respond in ${profile.languagePreference === 'hi' ? 'Hindi' : 'English'}.
`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 512,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "Keep exploring opportunities that match your interests!";
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return "Keep exploring opportunities that match your interests!";
    }
  }
}

export const geminiService = new GeminiService();
