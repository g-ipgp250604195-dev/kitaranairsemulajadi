import React from 'react';
import { SceneData } from '../types';

interface SubtitlesOverlayProps {
  currentScene: SceneData;
  currentTime: number;
  subtitlesEnabled: boolean;
  largeFont: boolean;
}

export const SubtitlesOverlay: React.FC<SubtitlesOverlayProps> = ({
  currentScene,
  currentTime,
  subtitlesEnabled,
  largeFont,
}) => {
  if (!subtitlesEnabled) return null;

  const sceneLocalTime = currentTime - currentScene.startTime;

  // Find matching subtitle segment or fallback to narration text
  const activeSegment = currentScene.speechSubtitles.find(
    sub => sceneLocalTime >= sub.startOffset && sceneLocalTime <= sub.endOffset
  );

  const displayedText = activeSegment ? activeSegment.text : currentScene.narrationText;

  // Final slogan highlight in Babak 8
  const isFinalSlogan = currentScene.id === 8 && displayedText.includes('JAGA AIR, JAGA KEHIDUPAN!');

  return (
    <div className="absolute bottom-20 left-0 right-0 px-4 flex justify-center pointer-events-none z-20">
      <div
        className={`max-w-3xl text-center px-6 py-3.5 rounded-2xl bg-slate-950/85 border border-cyan-500/40 shadow-2xl transition-all duration-300 ${
          isFinalSlogan
            ? 'scale-105 border-yellow-400 bg-amber-950/90'
            : ''
        }`}
      >
        {isFinalSlogan ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase font-heading">
              Slogan Kesedaran Alam Sekitar
            </span>
            <span
              className={`font-black tracking-wide text-yellow-300 font-heading drop-shadow-md ${
                largeFont ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
              }`}
            >
              “JAGA AIR, JAGA KEHIDUPAN!”
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase font-heading">
              {currentScene.title}
            </span>
            <p
              className={`font-bold text-white tracking-wide leading-relaxed font-heading ${
                largeFont ? 'text-lg md:text-xl' : 'text-base md:text-lg'
              }`}
            >
              {displayedText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
