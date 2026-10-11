import React from 'react';
import { Compass, BookMarked, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'identify' | 'library';
  setActiveTab: (tab: 'identify' | 'library') => void;
  observationCount: number;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  observationCount,
  onOpenPrivacy,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('identify')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-nature-800 text-nature-100 flex items-center justify-center shadow-sm group-hover:bg-nature-700 transition-colors">
            <Compass className="w-5 h-5 text-nature-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-stone-900">
                FieldLens
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-nature-100 text-nature-800 border border-nature-200/60 hidden sm:inline-flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Gemma
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium -mt-0.5 hidden xs:block">
              Nature Observation
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center bg-stone-200/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('identify')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'identify'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-4 h-4 text-nature-700" />
              <span>Identify</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'library'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookMarked className="w-4 h-4 text-nature-700" />
              <span>Observations</span>
              {observationCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] bg-nature-100 text-nature-800 font-bold">
                  {observationCount}
                </span>
              )}
            </button>
          </nav>

          <button
            onClick={onOpenPrivacy}
            title="Privacy & AI Info"
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
