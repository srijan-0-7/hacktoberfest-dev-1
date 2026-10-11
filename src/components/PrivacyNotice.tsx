import React from 'react';
import { ShieldCheck, X, Eye, Cpu, Database, HeartHandshake } from 'lucide-react';

interface PrivacyNoticeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2 text-nature-900 font-bold">
            <ShieldCheck className="w-5 h-5 text-nature-700" />
            <span>Privacy & Model Transparency</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-stone-600 leading-relaxed max-h-[75vh] overflow-y-auto">
          <div className="flex items-start gap-3">
            <Cpu className="w-5 h-5 text-nature-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900 mb-1">How AI Inference Works</h4>
              <p>
                When you click &ldquo;Analyze with Gemma&rdquo;, your photograph is sent securely over HTTPS to the backend and processed in real time by <strong>Google Gemma 4 Vision</strong> (<code className="text-xs bg-stone-100 px-1 py-0.5 rounded text-stone-800">models/gemma-4-26b-a4b-it</code>).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-nature-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900 mb-1">Zero Server Retention</h4>
              <p>
                FieldLens does not retain, archive, or train on your photos. Uploaded images are ephemeral and discarded immediately once the analysis completes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-nature-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900 mb-1">Local Browser Persistence</h4>
              <p>
                Any observations you choose to save are stored exclusively on your device using browser <code>localStorage</code> (for details) and <code>IndexedDB</code> (for image caching). If you clear your browser data or delete an observation, it is gone.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-nature-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900 mb-1">Responsible Observation & Safety</h4>
              <p>
                FieldLens is an educational nature companion. Model outputs are AI-assisted estimates and should never be treated as definitive or consulted for foraging, wild food consumption, or medical decisions. Please practice <em>Leave No Trace</em> and do not touch or disturb unknown organisms.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-nature-800 hover:bg-nature-700 text-white font-medium text-sm rounded-xl transition-colors"
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
};
