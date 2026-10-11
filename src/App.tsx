import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ImageUploader } from './components/ImageUploader';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { IdentificationResult } from './components/IdentificationResult';
import { ObservationLibrary } from './components/ObservationLibrary';
import { ObservationDetailModal } from './components/ObservationDetailModal';
import { PrivacyNotice } from './components/PrivacyNotice';
import { ProcessedImageData } from './lib/imageUtils';
import { GemmaIdentification } from './types/identification';
import { SavedObservation } from './types/observation';
import { identifyOrganism } from './lib/gemma';
import { loadObservations, saveObservation, deleteObservation } from './lib/storage';
import { Sparkles, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'identify' | 'library'>('identify');
  const [selectedImage, setSelectedImage] = useState<ProcessedImageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identification, setIdentification] = useState<GemmaIdentification | null>(null);
  const [modelIdentifier, setModelIdentifier] = useState<string>('models/gemma-4-26b-a4b-it');
  const [isSavedInCurrentSession, setIsSavedInCurrentSession] = useState(false);

  // Saved library state
  const [observations, setObservations] = useState<SavedObservation[]>([]);
  const [inspectedObservation, setInspectedObservation] = useState<SavedObservation | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Load observations from storage on mount
  useEffect(() => {
    setObservations(loadObservations());
  }, []);

  const handleImageSelected = (data: ProcessedImageData) => {
    setSelectedImage(data);
    setError(null);
    setIdentification(null);
    setIsSavedInCurrentSession(false);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setError(null);
    setIdentification(null);
    setIsSavedInCurrentSession(false);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isLoading) return;

    setIsLoading(true);
    setError(null);
    setIdentification(null);

    try {
      const result = await identifyOrganism(selectedImage.base64, selectedImage.mimeType);
      setIdentification(result.identification);
      setModelIdentifier(result.modelIdentifier);
      setIsSavedInCurrentSession(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during inference.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveObservation = async () => {
    if (!identification || !selectedImage) return;

    const newObservation: SavedObservation = {
      id: crypto.randomUUID ? crypto.randomUUID() : `obs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      category: identification.category,
      commonName: identification.common_name,
      scientificName: identification.scientific_name,
      identificationSummary: identification.identification_summary,
      visualEvidence: identification.visual_evidence,
      uncertainty: identification.uncertainty,
      uncertaintyReason: identification.uncertainty_reason,
      observationTip: identification.observation_tip,
      safetyNote: identification.safety_note,
      modelIdentifier: modelIdentifier,
      hasStoredImage: true,
    };

    await saveObservation(newObservation, selectedImage.dataUrl);
    setObservations(loadObservations());
    setIsSavedInCurrentSession(true);
  };

  const handleDelete = async (id: string) => {
    await deleteObservation(id);
    setObservations(loadObservations());
    if (inspectedObservation?.id === id) {
      setInspectedObservation(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900">
      {/* Sticky Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        observationCount={observations.length}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'library' ? (
          /* Observation Library Tab */
          <ObservationLibrary
            observations={observations}
            onSelectObservation={setInspectedObservation}
            onDeleteObservation={handleDelete}
            onGoToIdentify={() => {
              setActiveTab('identify');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* Identification Tab */
          <div className="space-y-8">
            {/* Show Home Hero if no image selected and no result */}
            {!selectedImage && !identification && !isLoading && (
              <HomeScreen
                onStartIdentifying={() => {
                  const uploaderEl = document.getElementById('uploader-section');
                  uploaderEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenLibrary={() => {
                  setActiveTab('library');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                observationCount={observations.length}
                onOpenPrivacy={() => setIsPrivacyOpen(true)}
              />
            )}

            {/* Uploader Section */}
            <div id="uploader-section" className="scroll-mt-24">
              {!identification && !isLoading && !error && (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                      Nature Identification
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                      Upload or snap a photo of any outdoor organism
                    </p>
                  </div>

                  <ImageUploader
                    selectedImage={selectedImage}
                    onImageSelected={handleImageSelected}
                    onClear={handleClearImage}
                    isLoading={isLoading}
                    onAnalyze={handleAnalyze}
                  />
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <LoadingState imagePreviewUrl={selectedImage?.dataUrl} />
              )}

              {/* Error State */}
              {error && !isLoading && (
                <ErrorState
                  error={error}
                  onRetry={handleAnalyze}
                  onReset={handleClearImage}
                />
              )}

              {/* Identification Result */}
              {identification && selectedImage && !isLoading && (
                <IdentificationResult
                  identification={identification}
                  imageDataUrl={selectedImage.dataUrl}
                  modelIdentifier={modelIdentifier}
                  onSave={handleSaveObservation}
                  onIdentifyAnother={handleClearImage}
                  isAlreadySaved={isSavedInCurrentSession}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Observation Detail Modal */}
      <ObservationDetailModal
        observation={inspectedObservation}
        onClose={() => setInspectedObservation(null)}
        onDelete={handleDelete}
      />

      {/* Privacy Notice Modal */}
      <PrivacyNotice
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/70 py-8 px-4 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">FieldLens</span>
            <span>•</span>
            <span>Hacktoberfest 2026 Week 1: “Touch Grass”</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-nature-800 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Google Gemma Vision
            </span>
            <span>•</span>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-stone-900 underline"
            >
              Privacy & Ethics
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
