import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

// Retry with exponential backoff for transient API errors (503, 429)
async function generateWithRetry(ai, model, contents, config, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({ model, contents, config });
      return response;
    } catch (err) {
      const status = err?.status || err?.error?.code;
      const isRetryable = status === 503 || status === 429;

      if (isRetryable && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.warn(`Gemini API ${status} on attempt ${attempt}. Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const isExcel = file.name.toLowerCase().match(/\.xlsx?$/);

    let contents;

    const prompt = `
You are an expert data extractor for construction orders.
Extract the following details from this customer order (which could be a PDF or Excel text).

Please extract:
1. Customer Name (Auftraggeber / AG / Name)
2. Customer Address or Project Address (BV, Anschrift, Ort)
3. Order Items (Positions): Extract the relevant construction/screed rows. For each item, capture the description (e.g. "Anhydritestrich", "Dämmung", "Heizung", or specific services requested), the quantity (m², Stk, etc. as just the number), and leave price as 0 if not specified.
4. Total area or value if available (otherwise 0)
    `;

    if (isExcel) {
      const xlsx = require('xlsx');
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      let csvText = '';
      workbook.SheetNames.forEach(sheetName => {
        csvText += `\n--- Sheet: ${sheetName} ---\n`;
        csvText += xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      });
      contents = [
        { text: `Here is the data from an Excel order file:\n\n${csvText}` },
        { text: prompt }
      ];
    } else {
      // Default to PDF
      contents = [
        { inlineData: { data: buffer.toString('base64'), mimeType: 'application/pdf' } },
        { text: prompt }
      ];
    }

    const config = {
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
    };

    // Try gemini-2.5-flash first, fall back to gemini-2.0-flash if still failing
    let response;
    try {
      response = await generateWithRetry(ai, 'gemini-2.5-flash', contents, config, 3);
    } catch (primaryErr) {
      console.warn('gemini-2.5-flash unavailable, falling back to gemini-2.0-flash...');
      response = await generateWithRetry(ai, 'gemini-2.0-flash', contents, config, 2);
    }

    const data = JSON.parse(response.text);
    return NextResponse.json(data);

  } catch (error) {
    console.error('PDF Parsing Error:', error);
    const status = error?.status || 500;
    const isOverloaded = status === 503 || status === 429;
    return NextResponse.json(
      {
        error: isOverloaded
          ? 'KI-Dienst ist vorübergehend ausgelastet. Bitte in 30 Sekunden erneut versuchen.'
          : error.message
      },
      { status: isOverloaded ? 503 : 500 }
    );
  }
}
