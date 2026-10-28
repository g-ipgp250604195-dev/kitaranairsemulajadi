import React from 'react';
import { X, Volume2, Info, CheckCircle2 } from 'lucide-react';
import { Hotspot } from '../types';
import { audioEngine } from '../audio/audioEngine';

interface InteractiveHotspotModalProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

export const InteractiveHotspotModal: React.FC<InteractiveHotspotModalProps> = ({
  hotspot,
  onClose,
}) => {
  if (!hotspot) return null;

  const handleReadAloud = () => {
    audioEngine.speakNarration(`${hotspot.title}. ${hotspot.description}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl w-full max-w-md p-5 shadow-2xl relative text-slate-100 flex flex-col gap-3.5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pr-8">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-700/60">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-heading">
              Fakta Sains Interaktif
            </span>
            <h3 className="text-lg font-bold text-white font-heading">
              {hotspot.title}
            </h3>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {hotspot.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handleReadAloud}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-900/60 hover:bg-sky-800 text-sky-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-sky-700/60"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Dengar Suara</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs font-heading cursor-pointer transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Faham!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
