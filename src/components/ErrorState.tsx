import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Lightbulb } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onReset }) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-red-200/80 p-6 sm:p-10 shadow-sm max-w-xl mx-auto my-6 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-4 border border-red-100">
        <AlertTriangle className="w-7 h-7 text-red-600" />
      </div>

      <h3 className="text-xl font-bold text-stone-900 text-center mb-2">
        Unable to Complete Identification
      </h3>

      <div className="bg-red-50/60 rounded-xl p-4 border border-red-100 text-sm text-red-800 text-center mb-6 font-medium">
        {error}
      </div>

      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 mb-6 text-left">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Tips for a clearer observation</span>
        </div>
        <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
          <li>Ensure the specimen (flower, leaf, insect, plumage) is sharply focused.</li>
          <li>Avoid harsh backlighting or severe motion blur.</li>
          <li>Get closer if safe, or crop the photo to isolate the organism.</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-nature-800 hover:bg-nature-700 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Choose Different Photo</span>
        </button>
      </div>
    </div>
  );
};
