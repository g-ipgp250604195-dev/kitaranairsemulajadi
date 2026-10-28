import React from 'react';
import { X, Play, Clock, Sparkles } from 'lucide-react';
import { SCENES } from '../data/scenesData';

interface SceneSelectorDrawerProps {
  isOpen: boolean;
  currentSceneIndex: number;
  onClose: () => void;
  onSelectScene: (index: number) => void;
}

export const SceneSelectorDrawer: React.FC<SceneSelectorDrawerProps> = ({
  isOpen,
  currentSceneIndex,
  onClose,
  onSelectScene,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-heading">
              Senarai Babak Video: Kesan Jika Aliran Air Terganggu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scene Cards Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SCENES.map((scene, idx) => {
            const isActive = idx === currentSceneIndex;
            return (
              <div
                key={scene.id}
                onClick={() => {
                  onSelectScene(idx);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 text-left group ${
                  isActive
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-900/40'
                    : 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-heading font-bold text-sm text-cyan-300">
                      {scene.title}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {scene.startTime}s - {scene.endTime}s
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-amber-300 mb-1">
                    Tema: {scene.theme}
                  </p>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    "{scene.narrationText}"
                  </p>
                </div>

                {/* Footer with Key Terms Pill & Play indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 mt-1">
                  <div className="flex flex-wrap gap-1">
                    {scene.keyTerms.slice(0, 2).map((kt, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700"
                      >
                        {kt.term}
                      </span>
                    ))}
                  </div>

                  <span
                    className={`flex items-center gap-1 text-xs font-bold font-heading px-2.5 py-1 rounded-lg ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300 group-hover:bg-cyan-600 group-hover:text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isActive ? 'Sedang Main' : 'Tonton'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
