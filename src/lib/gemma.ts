import { GemmaIdentification, InferenceResponse } from '../types/identification';

export interface IdentificationResult {
  identification: GemmaIdentification;
  modelIdentifier: string;
}

/**
 * Sends a processed image to the serverless /api/identify endpoint
 * for real-time inference via Google Gemma.
 */
export async function identifyOrganism(
  imageBase64: string,
  mimeType: string,
  signal?: AbortSignal
): Promise<IdentificationResult> {
  const payload = {
    imageBase64,
    mimeType,
  };

  let response: Response;
  try {
    response = await fetch('/api/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Identification request was cancelled.');
    }
    throw new Error('Network connection error. Please verify your internet connection and try again.');
  }

  let resultData: InferenceResponse;
  try {
    resultData = await response.json();
  } catch {
    throw new Error(`Server returned an unreadable response (Status ${response.status}).`);
  }

  if (!response.ok || !resultData.success) {
    const errorMsg = !resultData.success && resultData.error
      ? resultData.error
      : `Inference failed with status ${response.status}`;
    const details = !resultData.success && resultData.details ? ` (${resultData.details})` : '';
    throw new Error(`${errorMsg}${details}`);
  }

  return {
    identification: resultData.data,
    modelIdentifier: resultData.model,
  };
}
