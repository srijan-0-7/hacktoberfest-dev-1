import React, { useState } from 'react';
import { BookMarked, Search, Filter, Compass, Sparkles } from 'lucide-react';
import { SavedObservation } from '../types/observation';
import { ObservationCard } from './ObservationCard';

interface ObservationLibraryProps {
  observations: SavedObservation[];
  onSelectObservation: (obs: SavedObservation) => void;
  onDeleteObservation: (id: string) => void;
  onGoToIdentify: () => void;
}

export const ObservationLibrary: React.FC<ObservationLibraryProps> = ({
  observations,
  onSelectObservation,
  onDeleteObservation,
  onGoToIdentify,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(observations.map(o => o.category.toLowerCase())))];

  const filteredObservations = observations.filter(obs => {
    const matchesSearch =
      obs.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.identificationSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (obs.scientificName && obs.scientificName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || obs.category.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-5xl mx-auto py-6 animate-fade-in">
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-nature-700" />
            <span>My Field Observations</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {observations.length} {observations.length === 1 ? 'record' : 'records'} saved locally on your device
          </p>
        </div>

        {observations.length > 0 && (
          <button
            onClick={onGoToIdentify}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-nature-800 hover:bg-nature-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Compass className="w-4 h-4" />
            <span>New Observation</span>
          </button>
        )}
      </div>

      {observations.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-14 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-nature-100 text-nature-800 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-nature-700" />
          </div>

          <h3 className="text-lg font-bold text-stone-900 mb-2">
            No Saved Observations Yet
          </h3>

          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            Step outside into your garden, local park, or trail. Photograph any organism, let Google Gemma analyze it, and save it to your personal nature journal.
          </p>

          <button
            onClick={onGoToIdentify}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-nature-800 hover:bg-nature-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow active:scale-95"
          >
            <Compass className="w-4 h-4 text-nature-200" />
            <span>Identify Something Now</span>
          </button>
        </div>
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by common or scientific name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-nature-600/20 focus:border-nature-600 transition-all"
              />
            </div>

            {/* Category Filter Chips */}
            {categories.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1 hidden sm:block" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                      selectedCategory === cat
                        ? 'bg-nature-800 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cards Grid */}
          {filteredObservations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200/80 p-6">
              <p className="text-sm text-stone-500">
                No observations match &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs font-bold text-nature-800 underline"
              >
                Clear search & filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredObservations.map(obs => (
                <ObservationCard
                  key={obs.id}
                  observation={obs}
                  onSelect={onSelectObservation}
                  onDelete={onDeleteObservation}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
