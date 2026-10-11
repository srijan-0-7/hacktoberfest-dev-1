import React, { useState } from 'react';
import {
  CheckCircle2,
  Bookmark,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Compass,
  Cpu,
  BookmarkCheck,
} from 'lucide-react';
import { GemmaIdentification, UncertaintyLevel } from '../types/identification';

interface IdentificationResultProps {
  identification: GemmaIdentification;
  imageDataUrl: string;
  modelIdentifier: string;
  onSave: () => Promise<void>;
  onIdentifyAnother: () => void;
  isAlreadySaved?: boolean;
}

export const IdentificationResult: React.FC<IdentificationResultProps> = ({
  identification,
  imageDataUrl,
  modelIdentifier,
  onSave,
  onIdentifyAnother,
  isAlreadySaved = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(isAlreadySaved);

  const handleSaveClick = async () => {
    if (savedSuccess || isSaving) return;
    try {
      setIsSaving(true);
      await onSave();
      setSavedSuccess(true);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save observation.');
    } finally {
      setIsSaving(false);
    }
  };

  const getUncertaintyConfig = (level: UncertaintyLevel) => {
    switch (level) {
      case 'low':
        return {
          label: 'Low Uncertainty',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dotClass: 'bg-emerald-600',
          desc: 'High confidence based on distinct visible diagnostic features.',
        };
      case 'medium':
        return {
          label: 'Moderate Uncertainty',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          dotClass: 'bg-amber-600',
          desc: 'Likely match, though key distinguishing traits may be partially obscured.',
        };
      case 'high':
      default:
        return {
          label: 'High Uncertainty',
          badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
          dotClass: 'bg-orange-600',
          desc: 'Broad categorization only. Specimen requires closer inspection to verify.',
        };
    }
  };

  const uncertaintyCfg = getUncertaintyConfig(identification.uncertainty);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden animate-fade-in my-4">
      {/* Top Banner / Image & Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-stone-200">
        {/* Photo Column */}
        <div className="md:col-span-5 bg-stone-900 relative min-h-[260px] md:min-h-full flex items-center justify-center">
          <img
            src={imageDataUrl}
            alt={identification.common_name}
            className="w-full h-full object-cover max-h-[380px]"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
              {identification.category}
            </span>
          </div>
        </div>

        {/* Header Details Column */}
        <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Uncertainty Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${uncertaintyCfg.badgeClass}`}
                title={uncertaintyCfg.desc}
              >
                <span className={`w-2 h-2 rounded-full ${uncertaintyCfg.dotClass}`} />
                {uncertaintyCfg.label}
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                <Cpu className="w-3 h-3 text-stone-600" />
                {modelIdentifier.replace('models/', '')}
              </span>
            </div>

            {/* Common Name */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug mb-1">
              {identification.common_name}
            </h2>

            {/* Scientific Name */}
            {identification.scientific_name ? (
              <p className="text-sm font-medium italic text-nature-800 mb-3 font-serif">
                {identification.scientific_name}
              </p>
            ) : (
              <p className="text-xs text-stone-400 mb-3">
                No verified scientific species classification warranted
              </p>
            )}

            {/* Identification Summary */}
            <p className="text-sm text-stone-700 leading-relaxed font-normal">
              {identification.identification_summary}
            </p>
          </div>

          {/* Uncertainty explanation snippet */}
          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>
              <strong>Confidence basis:</strong> {identification.uncertainty_reason}
            </span>
          </div>
        </div>
      </div>

      {/* Structured Details Cards */}
      <div className="p-6 sm:p-8 space-y-5 bg-[#FAF8F5]/60">
        {/* Visible Evidence */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            <CheckCircle2 className="w-4 h-4 text-nature-700" />
            <span>Diagnostic Visual Evidence</span>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">
            {identification.visual_evidence}
          </p>
        </div>

        {/* Observation Tip */}
        <div className="bg-nature-50/70 rounded-2xl p-4 sm:p-5 border border-nature-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nature-900 mb-2">
            <Compass className="w-4 h-4 text-nature-800" />
            <span>Outdoor Observation Tip</span>
          </div>
          <p className="text-sm text-nature-900 leading-relaxed">
            {identification.observation_tip}
          </p>
        </div>

        {/* Safety Note */}
        <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-950 mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Safety & Outdoor Caution</span>
          </div>
          <p className="text-sm text-amber-950 leading-relaxed font-medium">
            {identification.safety_note}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="p-3.5 rounded-xl bg-stone-100/70 border border-stone-200 text-stone-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
          <span>
            <strong>Educational AI Assistant:</strong> Predictions are generated by Google Gemma and are not verified by a botanist or scientific database. Never consume wild plants or fungi based on AI results.
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 sm:p-6 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onIdentifyAnother}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Identify Another</span>
        </button>

        <button
          type="button"
          onClick={handleSaveClick}
          disabled={savedSuccess || isSaving}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all ${
            savedSuccess
              ? 'bg-emerald-700 text-white cursor-default'
              : 'bg-nature-800 hover:bg-nature-700 text-white hover:shadow active:scale-95'
          }`}
        >
          {savedSuccess ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-emerald-200" />
              <span>Saved to Observations</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-nature-200" />
              <span>{isSaving ? 'Saving...' : 'Save Observation'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
