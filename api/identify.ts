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
    // Helper to fetch with automatic retry on transient socket/network dropouts
    let apiRes: Response | null = null;
    let lastNetworkError: any = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        apiRes = await fetch(apiUrl, {
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
          signal: AbortSignal.timeout(60000), // 60s timeout for vision models
        });
        break;
      } catch (netErr: any) {
        lastNetworkError = netErr;
        // Wait 1 second before retry if it was a connection reset or transient fetch failure
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 1200));
        }
      }
    }

    if (!apiRes) {
      const cause = lastNetworkError?.cause?.message || lastNetworkError?.cause?.code || lastNetworkError?.message || '';
      return {
        status: 503,
        body: {
          success: false,
          error: `Network connection to Google Gemma timed out or was interrupted${cause ? ` (${cause})` : ''}. Please click "Try Again".`,
          model: modelName,
        },
      };
    }

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
    let message = 'Unknown inference error occurred.';
    if (err instanceof Error) {
      if (err.name === 'TimeoutError' || err.message.includes('timeout')) {
        message = 'The AI model took too long to analyze this image. Please click "Try Again".';
      } else if (err.message.includes('fetch failed')) {
        message = 'Connection to Google Gemma was interrupted. Please check your network and click "Try Again".';
      } else {
        message = err.message;
      }
    }
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
