export type UncertaintyLevel = 'low' | 'medium' | 'high';

export interface GemmaIdentification {
  category: string;
  common_name: string;
  scientific_name: string | null;
  identification_summary: string;
  visual_evidence: string;
  uncertainty: UncertaintyLevel;
  uncertainty_reason: string;
  observation_tip: string;
  safety_note: string;
}

export interface InferenceSuccessResponse {
  success: true;
  model: string;
  data: GemmaIdentification;
}

export interface InferenceErrorResponse {
  success: false;
  error: string;
  details?: string;
  model?: string;
}

export type InferenceResponse = InferenceSuccessResponse | InferenceErrorResponse;
