import { GemmaIdentification, UncertaintyLevel } from './identification';

export interface SavedObservation {
  id: string;
  timestamp: number;
  category: string;
  commonName: string;
  scientificName: string | null;
  identificationSummary: string;
  visualEvidence: string;
  uncertainty: UncertaintyLevel;
  uncertaintyReason: string;
  observationTip: string;
  safetyNote: string;
  modelIdentifier: string;
  hasStoredImage: boolean;
}

export interface ObservationWithImage extends SavedObservation {
  imageDataUrl?: string;
}
