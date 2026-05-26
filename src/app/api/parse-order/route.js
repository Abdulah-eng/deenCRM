import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const pdfParse = require('pdf-parse');
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    const pdfText = pdfData.text;

    // Initialize Gemini SDK
    // Assumes GEMINI_API_KEY is in .env.local
    const ai = new GoogleGenAI({});

    const prompt = `
You are an expert data extractor. Extract the following details from the text of this customer order PDF.
Text:
"""
${pdfText}
"""

Extract the data in the exact JSON format below. Do not include markdown formatting or any other text, just the raw JSON:
{
  "customerName": "Company Name or Person",
  "customerAddress": "Full Address",
  "items": [
    {
      "description": "Item or Service Name",
      "quantity": 10,
      "price": 100.00
    }
  ],
  "total": 1000.00
}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let rawJson = response.text;
    // Clean up potential markdown formatting
    if (rawJson.startsWith('\`\`\`json')) {
      rawJson = rawJson.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '');
    } else if (rawJson.startsWith('\`\`\`')) {
      rawJson = rawJson.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '');
    }

    const data = JSON.parse(rawJson);

    return NextResponse.json(data);
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
