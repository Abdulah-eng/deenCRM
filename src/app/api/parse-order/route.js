import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Initialize Gemini SDK with explicit API key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are an expert data extractor for construction/screed orders.
Extract the following details from this customer order PDF.

Please extract:
1. Customer Name (Auftraggeber / AG)
2. Customer Address or Project Address (BV or Anschrift)
3. Order Items (Positions): Extract the "Estrich" and "Dämmung" rows from the different floors (OG, EG, UG). For each item, capture the description (e.g. "Anhydritestrich 54mm", "EPS DEO 035", "Trittschall", "Zementestrich im DG"), the quantity (m²), and leave price as 0 if not specified.
4. Total area (Gesamtfläche)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { data: buffer.toString('base64'), mimeType: 'application/pdf' } },
        { text: prompt }
      ],
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
