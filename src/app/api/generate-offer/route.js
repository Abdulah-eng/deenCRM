import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const { projectDetails, type } = await request.json();

    if (!projectDetails) {
      return NextResponse.json({ error: 'Project details are required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({});

    const prompt = `
You are an expert construction estimator for a German company. Based on the following project details provided by a salesman, generate a detailed offer/quote breakdown. 

Order Type: ${type}
Project Details / Checklist:
"""
${projectDetails}
"""

Return the estimation as a JSON object with a list of recommended services/materials and their estimated quantities and prices. 

Output format exactly:
{
  "items": [
    {
      "description": "Item or Service Name",
      "quantity": 100,
      "unit": "m²",
      "unitPrice": 15.50
    }
  ],
  "estimatedTotal": 1550.00
}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let rawJson = response.text;
    if (rawJson.startsWith('\`\`\`json')) {
      rawJson = rawJson.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '');
    } else if (rawJson.startsWith('\`\`\`')) {
      rawJson = rawJson.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '');
    }

    const data = JSON.parse(rawJson);

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI Offer Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
