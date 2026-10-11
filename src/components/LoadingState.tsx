import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, Eye, Shield } from 'lucide-react';

interface LoadingStateProps {
  imagePreviewUrl?: string;
}

const STAGES = [
  { icon: Eye, text: 'Scanning image pixels & color distribution...' },
  { icon: Compass, text: 'Examining leaf shape, plumage, or structural morphology...' },
  { icon: Sparkles, text: 'Consulting Google Gemma vision-language representations...' },
  { icon: Shield, text: 'Synthesizing cautious observation tip and safety notice...' },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ imagePreviewUrl }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex(prev => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = STAGES[stageIndex].icon;

  return (
    <div className="w-full bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto my-6 animate-fade-in">
      {/* Visual pulse indicator */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-2xl bg-nature-200 animate-ping opacity-30" />
        <div className="relative w-20 h-20 rounded-2xl bg-nature-800 text-nature-100 flex items-center justify-center shadow-md">
          <CurrentIcon className="w-9 h-9 text-nature-200 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2">
        Analyzing with Google Gemma
      </h3>
      <p className="text-sm font-medium text-nature-700 mb-6 h-6 transition-all duration-300">
        {STAGES[stageIndex].text}
      </p>

      {imagePreviewUrl && (
        <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-nature-200 shadow-inner mb-6 opacity-80">
          <img
            src={imagePreviewUrl}
            alt="Specimen thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="w-full max-w-xs mx-auto bg-stone-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-nature-600 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
        />
      </div>

      <p className="text-xs text-stone-400 mt-5">
        Carefully evaluating visible evidence • Never guessing species when ambiguous
      </p>
    </div>
  );
};
