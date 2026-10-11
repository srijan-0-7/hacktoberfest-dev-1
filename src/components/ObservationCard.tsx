import React, { useEffect, useState } from 'react';
import { Trash2, ExternalLink, Calendar, ImageIcon } from 'lucide-react';
import { SavedObservation } from '../types/observation';
import { loadObservationImage } from '../lib/storage';

interface ObservationCardProps {
  observation: SavedObservation;
  onSelect: (obs: SavedObservation) => void;
  onDelete: (id: string) => void;
}

export const ObservationCard: React.FC<ObservationCardProps> = ({
  observation,
  onSelect,
  onDelete,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    let isMounted = true;
    loadObservationImage(observation.id).then(url => {
      if (isMounted) {
        setImageUrl(url);
        setIsLoadingImage(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [observation.id]);

  const formattedDate = new Date(observation.timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getUncertaintyColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'high':
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group">
      {/* Image Thumbnail */}
      <div
        onClick={() => onSelect(observation)}
        className="relative aspect-video sm:aspect-[4/3] bg-stone-100 cursor-pointer overflow-hidden flex items-center justify-center select-none"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={observation.commonName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : isLoadingImage ? (
          <div className="animate-pulse bg-stone-200 w-full h-full" />
        ) : (
          <div className="text-stone-400 flex flex-col items-center gap-1">
            <ImageIcon className="w-8 h-8 opacity-40" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Category tag */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
          {observation.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getUncertaintyColor(
                observation.uncertainty
              )}`}
            >
              {observation.uncertainty} uncertainty
            </span>

            <span className="text-[11px] text-stone-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>

          <h3
            onClick={() => onSelect(observation)}
            className="font-bold text-stone-900 text-base leading-snug hover:text-nature-800 cursor-pointer line-clamp-1"
          >
            {observation.commonName}
          </h3>

          {observation.scientificName && (
            <p className="text-xs italic text-stone-500 font-serif mb-2 line-clamp-1">
              {observation.scientificName}
            </p>
          )}

          <p className="text-xs text-stone-600 line-clamp-2 mt-1">
            {observation.identificationSummary}
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => onSelect(observation)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-nature-800 hover:text-nature-950 transition-colors"
          >
            <span>View Details</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              if (window.confirm(`Delete observation "${observation.commonName}"?`)) {
                onDelete(observation.id);
              }
            }}
            title="Delete this observation"
            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
