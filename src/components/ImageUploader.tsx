import React, { useRef, useState } from 'react';
import { Upload, Camera, RefreshCw, Trash2, AlertCircle, Sparkles, ImageIcon } from 'lucide-react';
import { validateImageFile } from '../lib/validation';
import { processImageFile, ProcessedImageData } from '../lib/imageUtils';

interface ImageUploaderProps {
  onImageSelected: (imageData: ProcessedImageData) => void;
  onClear: () => void;
  selectedImage: ProcessedImageData | null;
  isLoading: boolean;
  onAnalyze: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onClear,
  selectedImage,
  isLoading,
  onAnalyze,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setErrorMessage(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      return;
    }

    try {
      setIsProcessingFile(true);
      const processed = await processImageFile(file);
      onImageSelected(processed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to read image file.';
      setErrorMessage(msg);
    } finally {
      setIsProcessingFile(false);
      // Reset input values so selecting same file again fires event
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => handleFileChange(e.target.files?.[0] || null)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => handleFileChange(e.target.files?.[0] || null)}
      />

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-amber-700 hover:text-amber-900 text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {!selectedImage ? (
        /* Upload Drag & Drop Area */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all ${
            dragActive
              ? 'border-nature-600 bg-nature-50/70 scale-[0.99]'
              : 'border-stone-300 hover:border-nature-500 bg-white hover:bg-stone-50/50'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-nature-100 text-nature-800 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ImageIcon className="w-8 h-8 text-nature-700" />
          </div>

          <h3 className="text-lg font-bold text-stone-900 mb-1">
            Photograph or upload nature specimen
          </h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
            Upload a clear photo of a plant, flower, bird, tree, mushroom, or insect to identify it with Google Gemma.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingFile || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nature-800 hover:bg-nature-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Photo</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isProcessingFile || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Camera className="w-4 h-4 text-nature-700" />
              <span>Use Camera</span>
            </button>
          </div>

          <p className="text-xs text-stone-400 mt-5">
            Supported: JPEG, PNG, WebP up to 5 MB
          </p>
        </div>
      ) : (
        /* Image Preview & Analyze Controls */
        <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-sm">
          <div className="relative rounded-2xl overflow-hidden bg-stone-950 aspect-video max-h-[380px] flex items-center justify-center mb-5 group">
            <img
              src={selectedImage.dataUrl}
              alt="Nature specimen preview"
              className="w-full h-full object-contain"
            />

            {/* Replace / Remove floating buttons */}
            {!isLoading && (
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Replace with another image"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-700 text-white backdrop-blur-md transition-colors shadow-sm"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500 font-medium text-center sm:text-left">
              <span>Resolution: {selectedImage.width}×{selectedImage.height}px</span>
              <span className="mx-2">•</span>
              <span>{(selectedImage.originalSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClear}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={onAnalyze}
                disabled={isLoading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-nature-800 hover:bg-nature-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-nature-200" />
                <span>{isLoading ? 'Analyzing...' : 'Identify Organism'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
