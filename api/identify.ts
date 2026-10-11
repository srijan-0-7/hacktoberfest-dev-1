import { FIELDLENS_SYSTEM_PROMPT, extractJsonFromGemma, GEMMA_DEFAULT_MODEL } from '../src/lib/gemmaPrompt';
import { validateAndSanitizeGemmaResponse } from '../src/lib/validation';

export interface IdentifyRequestBody {
  imageBase64: string;
  mimeType?: string;
}

/**
 * Core handler logic for processing Gemma vision inference.
 */
export async function handleIdentifyRequest(body: IdentifyRequestBody) {
  const { imageBase64, mimeType = 'image/jpeg' } = body;

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Missing image data. Please upload a valid image file.',
      },
    };
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMMA_API_KEY;
  if (!apiKey) {
    return {
      status: 500,
      body: {
        success: false,
        error: 'Gemma API credentials not configured. Please set GEMINI_API_KEY in your server environment.',
      },
    };
  }

  let modelName = process.env.GEMMA_MODEL || GEMMA_DEFAULT_MODEL;
  if (!modelName.startsWith('models/')) {
    modelName = `models/${modelName}`;
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

  try {
    const apiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: FIELDLENS_SYSTEM_PROMPT },
              {
                inlineData: {
                  mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok || data.error) {
      const statusCode = apiRes.status;
      const apiErrorMessage = data.error?.message || 'Google Gemma inference failed.';

      let userFacingError = `Inference provider error: ${apiErrorMessage}`;
      if (statusCode === 429) {
        userFacingError = 'Rate limit exceeded for the AI model. Please pause a moment and retry.';
      } else if (statusCode === 401 || statusCode === 403) {
        userFacingError = 'Authentication error contacting AI service. Please verify server API credentials.';
      }

      return {
        status: statusCode >= 400 && statusCode < 600 ? statusCode : 500,
        body: {
          success: false,
          error: userFacingError,
          model: modelName,
        },
      };
    }

    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return {
        status: 502,
        body: {
          success: false,
          error: 'The AI model returned an empty response for this image. Please try another angle or lighting.',
          model: modelName,
        },
      };
    }

    // Parse structured JSON
    const parsedRaw = extractJsonFromGemma(candidateText);

    // Validate and sanitize according to FieldLens schema
    const validatedData = validateAndSanitizeGemmaResponse(parsedRaw);

    return {
      status: 200,
      body: {
        success: true,
        model: modelName,
        data: validatedData,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown inference error occurred.';
    return {
      status: 500,
      body: {
        success: false,
        error: message,
        model: modelName,
      },
    };
  }
}

/**
 * Standard Vercel Serverless Function entrypoint (Node.js runtime).
 */
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
    return;
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {}
  }
  const result = await handleIdentifyRequest(body);
  res.status(result.status).json(result.body);
}
