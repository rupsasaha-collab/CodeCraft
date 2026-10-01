import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize server-side Gemini client helper
  function getGenAIClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY;
    res.json({
      status: 'ok',
      service: 'CodeCraft API',
      aiConfigured: Boolean(apiKey),
      timestamp: new Date().toISOString(),
    });
  });

  // Helper to detect if an error is a transient 503 / 429 / overloaded model condition
  function isTransientServiceError(err: unknown): boolean {
    if (!err) return false;
    const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
    const status = (err as { status?: number; statusCode?: number })?.status ||
                   (err as { status?: number; statusCode?: number })?.statusCode;

    if (status === 503 || status === 502 || status === 504 || status === 429) {
      return true;
    }

    return (
      msg.includes('503') ||
      msg.includes('service unavailable') ||
      msg.includes('overloaded') ||
      msg.includes('unavailable') ||
      msg.includes('resource_exhausted') ||
      msg.includes('quota') ||
      msg.includes('rate limit') ||
      msg.includes('high demand') ||
      msg.includes('temporarily unavailable') ||
      msg.includes('deadline exceeded') ||
      msg.includes('timeout')
    );
  }

  // AI Error Analysis endpoint
  app.post('/api/analyze-error', async (req: Request, res: Response) => {
    try {
      const { language, code, errorMessage, userContext } = req.body;

      // Validation
      if ((!code || !code.trim()) && (!errorMessage || !errorMessage.trim())) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Please provide either the code snippet, compiler/runtime error message, or both.',
        });
      }

      const ai = getGenAIClient();
      if (!ai) {
        return res.status(503).json({
          success: false,
          error: 'Service Unavailable',
          isServiceUnavailable: true,
          retryable: false,
          message: 'The Gemini API key is not configured on the server. Please check the Secrets panel in AI Studio.',
        });
      }

      const prompt = `Analyze this programming code and/or error message thoroughly:

Programming Language: ${language || 'Auto-detect'}

Source Code:
\`\`\`${language || ''}
${code || '(No code provided, analyze based on error message)'}
\`\`\`

Terminal / Compiler / Console Output:
\`\`\`
${errorMessage || '(No terminal output provided, analyze based on source code)'}
\`\`\`

User Additional Context / Problem Description:
${userContext ? userContext : '(None provided)'}

Instructions:
1. Identify the exact error name, type, and category.
2. Determine which line of code (1-based index) contains or triggers the bug. If none or general, return null.
3. Provide a simple, beginner-friendly explanation in plain English that a first-year student can understand immediately.
4. Explain the underlying computer science root cause (memory model, type system, scope, syntax rule, etc.).
5. Provide clear, numbered actionable steps to fix the error.
6. Provide the complete, fully corrected, properly indented code.
7. Provide a concise summary of the exact changes made and why.
8. Share practical prevention tips and best practices.
9. Name the educational programming concept involved.
10. Provide a sample test case or command to test the fix.`;

      // Call Gemini with multi-model fallback and transient retry
      let response;
      const modelCandidates = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let lastCaughtError: unknown = null;

      for (const modelName of modelCandidates) {
        try {
          const generateParams = {
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction:
                'You are CodeCraft, a world-class senior software engineering mentor and automated debugging engine. Your mission is to help students, beginners, and professional developers understand programming errors deeply, fix bugs cleanly, and learn underlying computer science concepts. You analyze code and error messages accurately across C, C++, Python, Java, JavaScript, and HTML/CSS. Always provide verified, production-quality corrected code.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  errorType: {
                    type: Type.STRING,
                    description: 'The exact error name or exception (e.g. IndexError, NullPointerException, Segmentation Fault)',
                  },
                  category: {
                    type: Type.STRING,
                    description: 'Category: Syntax Error, Runtime Error, Logic Error, Memory Management, Type Error, or Configuration',
                  },
                  severity: {
                    type: Type.STRING,
                    description: 'critical, warning, or info',
                  },
                  errorLine: {
                    type: Type.INTEGER,
                    description: '1-based line number in the source code where the bug occurs or originates, or null/0 if not line specific',
                  },
                  summary: {
                    type: Type.STRING,
                    description: '1-2 sentence executive summary of the issue',
                  },
                  simpleExplanation: {
                    type: Type.STRING,
                    description: 'Beginner-friendly explanation in crystal clear plain English without overly academic jargon',
                  },
                  rootCause: {
                    type: Type.STRING,
                    description: 'Deep technical root cause explaining why this happened under the hood',
                  },
                  stepsToFix: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Clear, ordered actionable steps to fix the problem',
                  },
                  correctedCode: {
                    type: Type.STRING,
                    description: 'Complete, fully corrected, clean, and runnable source code',
                  },
                  codeDiffSummary: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        lineOrSection: { type: Type.STRING, description: 'Line number or section identifier' },
                        change: { type: Type.STRING, description: 'What was changed' },
                        reason: { type: Type.STRING, description: 'Why this change resolves the issue' },
                      },
                      required: ['lineOrSection', 'change', 'reason'],
                    },
                    description: 'Summary of key modifications made',
                  },
                  preventionTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Pro tips and best practices to prevent similar errors in future',
                  },
                  educationalConcept: {
                    type: Type.STRING,
                    description: 'Key computer science / programming concept related to this bug',
                  },
                  testCase: {
                    type: Type.STRING,
                    description: 'Sample input, test case, or command to verify the fix works',
                  },
                },
                required: [
                  'errorType',
                  'category',
                  'severity',
                  'summary',
                  'simpleExplanation',
                  'rootCause',
                  'stepsToFix',
                  'correctedCode',
                  'codeDiffSummary',
                  'preventionTips',
                  'educationalConcept',
                ],
              },
            },
          };

          response = await ai.models.generateContent(generateParams);
          if (response && response.text) {
            break; // Successfully got response
          }
        } catch (attemptErr) {
          lastCaughtError = attemptErr;
          console.warn(`[CodeCraft] Model ${modelName} encountered error:`, attemptErr instanceof Error ? attemptErr.message : attemptErr);
          if (isTransientServiceError(attemptErr)) {
            // Wait briefly before trying alternate candidate model
            await new Promise((res) => setTimeout(res, 500));
            continue;
          } else {
            // Non-transient error, rethrow immediately
            throw attemptErr;
          }
        }
      }

      if (!response || !response.text) {
        throw lastCaughtError || new Error('All AI models are currently unavailable.');
      }

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response received from AI model');
      }

      const parsedData = JSON.parse(responseText);
      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (err: unknown) {
      console.error('CodeCraft error analysis failed:', err);
      const isTransient = isTransientServiceError(err);
      const rawMessage = err instanceof Error ? err.message : String(err);

      if (isTransient) {
        return res.status(503).json({
          success: false,
          error: 'Service Unavailable',
          isServiceUnavailable: true,
          retryable: true,
          message: 'The AI analysis model is currently experiencing high demand or is temporarily unavailable. Please click Retry below to run your analysis again.',
          technicalDetails: rawMessage,
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Analysis Error',
        isServiceUnavailable: false,
        retryable: true,
        message: rawMessage || 'Internal analysis error occurred. Please try again.',
      });
    }
  });

  // Mount Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodeCraft server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
