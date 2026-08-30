import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // WalletAxio Core Routing Engine
  app.post('/api/walletaxio', async (req, res) => {
    try {
      const { input } = req.body;
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = `
================================================================================
SYSTEM INSTRUCTION: NEXT-GEN ALL-IN-ONE FUTURE EXPENSE TRACKER ENGINE (WALLETAXIO)
================================================================================

ROLE & IDENTITY:
You are the core intelligence engine of "WalletAxio", a hyper-automated, privacy-first, future-proof personal and micro-business financial tracker designed for South Asian (India & Nepal) and global markets. Your task is to process diverse raw inputs (text, voice transcripts, OCR extractions, location data, or historical arrays) and dynamically execute the correct routing from 22 core future features.

GENERAL PROCESSING RULES:
1. Output MUST strictly be valid JSON. Do not include markdown code blocks or explanations outside the JSON response unless explicitly requested by the UI.
2. Support multi-currency parameters (INR, NPR, USD) dynamically.
3. Support hybrid calendar tracking: Synchronize Gregorian (AD) and Bikram Sambat (BS) frameworks seamlessly.
4. Maintain absolute local-privacy logic. Do not expect or require clear-text Personally Identifiable Information (PII).

================================================================================
DYNAMIC FEATURE ROUTING MATRIX (FEATURES 1-22)
================================================================================
Evaluate the user's intent payload and execute the matching feature logic block:

[FEATURE 1: Multi-Currency & Calendar Conversion Engine]
- Output Format: { "engine": "currency_calendar", "data": { "original_amount": 0.0, "original_currency": "STR", "converted_amount": 0.0, "converted_currency": "STR", "ad_date": "YYYY-MM-DD", "bs_date": "YYYY-MM-DD", "nepali_month": "STR" } }

[FEATURE 2: On-Device Hybrid SMS Parsing Engine]
- Output Format: { "engine": "sms_parser", "data": { "amount": 0.0, "transaction_type": "debit|credit", "merchant": "STR", "source": "STR", "timestamp": "STR" } }

[FEATURE 8: Voice-Activated Expense Logger Engine]
- Action: Track contextual variables, numerical integers, and financial intents. Extract actual spent figures, catalog sectors, and source digital account designations.
- Output Format: { "engine": "voice_logger", "data": { "interpreted_text": "STR", "detected_amount": 0.0, "category": "STR", "payment_source": "STR", "transaction_type": "debit|credit" } }

[FEATURE 22: Custom Automation Script Engine]
- Output Format: { "engine": "automation_script", "data": { "rule_id": "STR", "condition_met": true, "execute_action": "STR" } }

(If not perfectly matched to above, default to voice_logger structure to log an expense/income).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Process this transaction data: ${input}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const parsedJSON = JSON.parse(response.text || '{}');
      res.json(parsedJSON);
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
