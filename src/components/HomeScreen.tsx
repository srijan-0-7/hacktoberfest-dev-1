import React from 'react';
import {
  Compass,
  BookMarked,
  Sparkles,
  Camera,
  Search,
  Footprints,
  ShieldCheck,
  Heart,
} from 'lucide-react';

interface HomeScreenProps {
  onStartIdentifying: () => void;
  onOpenLibrary: () => void;
  observationCount: number;
  onOpenPrivacy: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartIdentifying,
  onOpenLibrary,
  observationCount,
  onOpenPrivacy,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 animate-fade-in">
      {/* Hero Card */}
      <div className="bg-gradient-to-b from-white via-white to-nature-50/40 rounded-3xl border border-stone-200/90 p-8 sm:p-14 text-center shadow-xs relative overflow-hidden mb-12">
        {/* Decorative Nature Accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-nature-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-moss-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Gemma Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-nature-100/80 text-nature-800 border border-nature-200/80 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-nature-700" />
          <span>Powered by Google Gemma</span>
          <span className="text-nature-400">•</span>
          <span className="text-nature-900 font-mono text-[11px]">gemma-4-26b-it</span>
        </div>

        {/* Brand Tagline */}
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-[1.15] mb-4">
          Step outside.<br />
          <span className="text-nature-800">Discover what&apos;s around you.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Turn a moment outdoors into an opportunity to learn. Photograph something in nature and let open-source AI help you understand what you&apos;re seeing.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={onStartIdentifying}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-nature-800 hover:bg-nature-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Compass className="w-5 h-5 text-nature-200" />
            <span>Identify Something</span>
          </button>

          <button
            onClick={onOpenLibrary}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold text-sm transition-colors"
          >
            <BookMarked className="w-4 h-4 text-nature-700" />
            <span>My Observations</span>
            {observationCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-nature-100 text-nature-800 font-bold">
                {observationCount}
              </span>
            )}
          </button>
        </div>

        {/* Responsible Nature Note */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-nature-700" />
            Leave No Trace philosophy
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            Observe wildlife without disturbing
          </span>
          <span>•</span>
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1 text-stone-600 hover:text-stone-900 underline"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-nature-700" />
            Private & ephemeral processing
          </button>
        </div>
      </div>

      {/* 3-Step Process: Capture -> Discover -> Explore */}
      <div className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            How FieldLens Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Cautious, evidence-driven identification in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-nature-100 text-nature-800 flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-nature-700" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-nature-700 mb-1">
                Step 1 • Capture
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Photograph a specimen
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Take a photo or upload an image of a bird, plant, flower, tree, mushroom, or insect from your mobile camera or library.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-nature-100 text-nature-800 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-nature-700" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-nature-700 mb-1">
                Step 2 • Discover
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Analyze visible traits
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Google Gemma examines diagnostic traits, identifies likely categories, and states its uncertainty level without guessing.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-nature-100 text-nature-800 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 text-nature-700" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-nature-700 mb-1">
                Step 3 • Explore
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Learn outdoor tips
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Receive safe outdoor observation suggestions, safety reminders, and log the sighting into your local nature diary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
