import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const { projectDetails, type } = await request.json();

    if (!projectDetails) {
      return NextResponse.json({ error: 'Project details are required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are an expert construction estimator for a German company. Based on the following project details provided by a salesman, generate a detailed offer/quote breakdown. 

Order Type: ${type}
Project Details / Checklist:
"""
${projectDetails}
"""

Return the estimation as a JSON object with a list of recommended services/materials and their estimated quantities and prices.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  quantity: { type: 'number' },
                  unit: { type: 'string' },
                  unitPrice: { type: 'number' }
                },
                required: ['description', 'quantity', 'unit', 'unitPrice']
              }
            },
            estimatedTotal: { type: 'number' }
          },
          required: ['items', 'estimatedTotal']
        }
      }
    });

    let data;
    try {
      data = JSON.parse(response.text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response text as JSON:", response.text);
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        throw parseError;
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI Offer Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
