import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Polyfill DOMMatrix for pdf-parse dependency on Node.js context
    if (typeof global.DOMMatrix === 'undefined') {
      global.DOMMatrix = class DOMMatrix {
        constructor() {}
      };
    }

    const pdfParse = require('pdf-parse');
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new pdfParse.PDFParse({ data: buffer });
    await parser.load();
    const pdfData = await parser.getText();
    const pdfText = pdfData.text;
    await parser.destroy();

    // Initialize Gemini SDK with explicit API key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are an expert data extractor. Extract the following details from the text of this customer order PDF.
Text:
"""
${pdfText}
"""
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            customerName: { type: 'string' },
            customerAddress: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' }
                },
                required: ['description', 'quantity', 'price']
              }
            },
            total: { type: 'number' }
          },
          required: ['customerName', 'customerAddress', 'items', 'total']
        }
      }
    });

    const data = JSON.parse(response.text);

    return NextResponse.json(data);
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
