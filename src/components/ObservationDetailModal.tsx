import React, { useEffect, useState } from 'react';
import {
  X,
  Calendar,
  Cpu,
  Trash2,
  CheckCircle2,
  Compass,
  ShieldAlert,
  HelpCircle,
  ImageIcon,
} from 'lucide-react';
import { SavedObservation } from '../types/observation';
import { loadObservationImage } from '../lib/storage';

interface ObservationDetailModalProps {
  observation: SavedObservation | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const ObservationDetailModal: React.FC<ObservationDetailModalProps> = ({
  observation,
  onClose,
  onDelete,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!observation) {
      setImageUrl(null);
      return;
    }
    loadObservationImage(observation.id).then(setImageUrl);
  }, [observation]);

  if (!observation) return null;

  const formattedDate = new Date(observation.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-nature-100 text-nature-800 border border-nature-200">
              {observation.category}
            </span>
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formattedDate}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Specimen Image */}
          {imageUrl ? (
            <div className="rounded-2xl overflow-hidden bg-stone-900 max-h-[320px] flex items-center justify-center">
              <img
                src={imageUrl}
                alt={observation.commonName}
                className="w-full h-full object-contain max-h-[320px]"
              />
            </div>
          ) : (
            <div className="h-40 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 gap-2">
              <ImageIcon className="w-6 h-6 opacity-40" />
              <span className="text-sm">Image preview unavailable</span>
            </div>
          )}

          {/* Names */}
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              {observation.commonName}
            </h2>
            {observation.scientificName && (
              <p className="text-sm italic font-serif text-nature-800 mt-0.5">
                {observation.scientificName}
              </p>
            )}
            <p className="text-sm text-stone-700 mt-2 leading-relaxed">
              {observation.identificationSummary}
            </p>
          </div>

          {/* Uncertainty Basis */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-800 capitalize">
                {observation.uncertainty} uncertainty:
              </span>{' '}
              {observation.uncertaintyReason}
            </div>
          </div>

          {/* Visual Evidence */}
          <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-nature-700" />
              <span>Visible Diagnostic Traits</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {observation.visualEvidence}
            </p>
          </div>

          {/* Outdoor Tip */}
          <div className="bg-nature-50 rounded-2xl p-4 border border-nature-200">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-nature-900 mb-1.5">
              <Compass className="w-3.5 h-3.5 text-nature-800" />
              <span>Observation Tip</span>
            </div>
            <p className="text-xs text-nature-950 leading-relaxed">
              {observation.observationTip}
            </p>
          </div>

          {/* Safety Caution */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-950 mb-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Safety Note</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {observation.safetyNote}
            </p>
          </div>

          <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-2">
            <Cpu className="w-3 h-3 text-stone-400" />
            <span>Analyzed by: {observation.modelIdentifier}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm(`Delete observation "${observation.commonName}"?`)) {
                onDelete(observation.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Observation</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
