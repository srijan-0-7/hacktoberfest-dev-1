import { GemmaIdentification, UncertaintyLevel } from '../types/identification';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No image file was provided.' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload a JPEG, PNG, or WebP image.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image file is too large (${sizeInMB} MB). Maximum supported size is 5 MB.`,
    };
  }

  return { valid: true };
}

export function validateAndSanitizeGemmaResponse(raw: unknown): GemmaIdentification {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Model returned an empty or invalid payload structure.');
  }

  const obj = raw as Record<string, unknown>;

  // Category
  const category = typeof obj.category === 'string' && obj.category.trim().length > 0
    ? obj.category.trim()
    : 'unknown organism';

  // Common Name
  const common_name = typeof obj.common_name === 'string' && obj.common_name.trim().length > 0
    ? obj.common_name.trim()
    : 'Unknown Organism';

  // Scientific Name
  let scientific_name: string | null = null;
  if (typeof obj.scientific_name === 'string' && obj.scientific_name.trim().length > 0) {
    const s = obj.scientific_name.trim();
    const lower = s.toLowerCase();
    if (
      !lower.startsWith('null') &&
      !lower.startsWith('unknown') &&
      !lower.startsWith('n/a') &&
      !lower.startsWith('none') &&
      !lower.includes('cannot be') &&
      !lower.includes('unverified')
    ) {
      scientific_name = s;
    }
  }

  // Summary
  const identification_summary = typeof obj.identification_summary === 'string' && obj.identification_summary.trim().length > 0
    ? obj.identification_summary.trim()
    : 'Unable to provide a detailed identification based on the visible features in this image.';

  // Visual Evidence
  let visual_evidence = '';
  if (Array.isArray(obj.visual_evidence)) {
    visual_evidence = obj.visual_evidence.filter(v => typeof v === 'string').join('; ');
  } else if (typeof obj.visual_evidence === 'string') {
    visual_evidence = obj.visual_evidence.trim();
  }
  if (!visual_evidence) {
    visual_evidence = 'No distinctive visible features could be unambiguously matched.';
  }

  // Uncertainty
  let uncertainty: UncertaintyLevel = 'high';
  if (typeof obj.uncertainty === 'string') {
    const lower = obj.uncertainty.toLowerCase().trim();
    if (lower === 'low' || lower === 'medium' || lower === 'high') {
      uncertainty = lower;
    }
  }

  // Uncertainty Reason
  const uncertainty_reason = typeof obj.uncertainty_reason === 'string' && obj.uncertainty_reason.trim().length > 0
    ? obj.uncertainty_reason.trim()
    : 'Inference is based on photographic visual evidence and may be affected by resolution, lighting, or angle.';

  // Observation Tip
  const observation_tip = typeof obj.observation_tip === 'string' && obj.observation_tip.trim().length > 0
    ? obj.observation_tip.trim()
    : 'Observe from a respectful distance without disturbing the surrounding habitat.';

  // Safety Note
  const safety_note = typeof obj.safety_note === 'string' && obj.safety_note.trim().length > 0
    ? obj.safety_note.trim()
    : 'Do not touch, consume, or disturb unknown wild plants, fungi, or animals.';

  return {
    category,
    common_name,
    scientific_name,
    identification_summary,
    visual_evidence,
    uncertainty,
    uncertainty_reason,
    observation_tip,
    safety_note,
  };
}
