export const GEMMA_DEFAULT_MODEL = 'models/gemma-4-26b-a4b-it';

export const FIELDLENS_SYSTEM_PROMPT = `You are FieldLens, a cautious nature-observation assistant. Analyze the supplied photograph and identify the most likely visible organism when the evidence permits.

Distinguish visible evidence from assumptions. Do not claim certainty when the photograph is ambiguous. Never invent details that cannot reasonably be inferred from the image.

If identification is uncertain, give the broadest defensible category, such as bird, flowering plant, tree, mushroom, insect, or unknown organism. Do not guess a precise species simply to complete the response.

Return concise, useful, educational information for a person exploring nature outdoors. Include a reminder not to touch or disturb unknown organisms.

Provide your final identification formatted as a JSON object matching this schema:
\`\`\`json
{
  "category": "broad organism category (e.g. bird, flowering plant, tree, mushroom, insect, or unknown organism)",
  "common_name": "likely common name, or an explicit unknown label if unclear",
  "scientific_name": "possible scientific name only when sufficiently justified; otherwise null",
  "identification_summary": "short concise explanation (1-2 sentences)",
  "visual_evidence": "visible characteristics in the photo supporting the identification",
  "uncertainty": "low" | "medium" | "high",
  "uncertainty_reason": "short explanation of confidence level or ambiguity",
  "observation_tip": "one safe, practical outdoor observation tip",
  "safety_note": "any relevant outdoor safety caution or reminder not to touch/disturb"
}
\`\`\``;

/**
 * Extracts key-value pairs formatted as bullet points or markdown lines
 * when the model returns reasoning or structured lists without JSON braces.
 */
function extractFromKeyValueLines(text: string): Record<string, unknown> | null {
  const fields = [
    'category',
    'common_name',
    'scientific_name',
    'identification_summary',
    'visual_evidence',
    'uncertainty',
    'uncertainty_reason',
    'observation_tip',
    'safety_note',
  ];
  const result: Record<string, unknown> = {};
  let count = 0;

  for (const field of fields) {
    const regex = new RegExp(
      `(?:\\*|\\-|•)?\\s*[\`"']?${field}[\`"']?\\s*:\\s*(?:"([^"]*)"|'([^']*)'|([^\\n\\r]+))`,
      'i'
    );
    const match = text.match(regex);
    if (match) {
      const val = (match[1] ?? match[2] ?? match[3] ?? '').trim();
      if (val.toLowerCase().startsWith('null')) {
        result[field] = null;
      } else {
        result[field] = val.replace(/^["']|["']$/g, '');
      }
      count++;
    }
  }

  return count >= 3 ? result : null;
}

/**
 * Robust extractor for parsing identification JSON from Gemma outputs.
 * Handles markdown code fences, reasoning/chain-of-thought prefixes,
 * curly-brace slicing, and structured bullet lists.
 */
export function extractJsonFromGemma(text: string): Record<string, unknown> {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty or invalid response received from Gemma model.');
  }

  const clean = text.trim();

  // 1. Direct parse attempt
  try {
    return JSON.parse(clean);
  } catch {}

  // 2. Markdown fence extraction ```json ... ``` or ``` ... ```
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  let match;
  let lastFenced: string | null = null;
  while ((match = fenceRegex.exec(clean)) !== null) {
    lastFenced = match[1].trim();
    try {
      return JSON.parse(lastFenced);
    } catch {}
  }

  // 3. Substring between last '{' and last '}' (often the final answer after reasoning)
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = clean.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      const sanitized = candidate
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\u201C\u201D]/g, '"');
      try {
        return JSON.parse(sanitized);
      } catch {}
    }
  }

  // 4. Try from the fenced block if it was partial JSON
  if (lastFenced) {
    const fBrace = lastFenced.indexOf('{');
    const lBrace = lastFenced.lastIndexOf('}');
    if (fBrace !== -1 && lBrace !== -1 && lBrace > fBrace) {
      try {
        return JSON.parse(lastFenced.slice(fBrace, lBrace + 1));
      } catch {}
    }
  }

  // 5. Fallback: Parse structured key-value bullet points
  const kvResult = extractFromKeyValueLines(clean);
  if (kvResult) {
    return kvResult;
  }

  throw new Error('Could not parse structured identification from model output.');
}
