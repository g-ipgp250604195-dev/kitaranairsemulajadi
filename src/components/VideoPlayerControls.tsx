import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Music,
  Subtitles,
  Compass,
  Maximize,
  Minimize,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';
import { SCENES, TOTAL_VIDEO_DURATION } from '../data/scenesData';
import { SceneData } from '../types';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  currentScene: SceneData;
  playbackSpeed: number;
  isExploreMode: boolean;
  subtitlesEnabled: boolean;
  largeFont: boolean;
  isMuted: boolean;
  isVoiceMuted: boolean;
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onReplay: () => void;
  onSeek: (seconds: number) => void;
  onPrevScene: () => void;
  onNextScene: () => void;
  onSelectScene: (sceneIndex: number) => void;
  onToggleMute: () => void;
  onToggleVoice: () => void;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onToggleSubtitles: () => void;
  onToggleLargeFont: () => void;
  onToggleExplore: () => void;
  onToggleFullscreen: () => void;
  onChangeSpeed: (speed: number) => void;
  onOpenSceneDrawer: () => void;
  onOpenNotes: () => void;
  onOpenQuiz: () => void;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  currentTime,
  currentScene,
  playbackSpeed,
  isExploreMode,
  subtitlesEnabled,
  largeFont,
  isMuted,
  isVoiceMuted,
  isMusicMuted,
  isSfxMuted,
  isFullscreen,
  onPlayPause,
  onReplay,
  onSeek,
  onPrevScene,
  onNextScene,
  onSelectScene,
  onToggleMute,
  onToggleVoice,
  onToggleMusic,
  onToggleSfx,
  onToggleSubtitles,
  onToggleLargeFont,
  onToggleExplore,
  onToggleFullscreen,
  onChangeSpeed,
  onOpenSceneDrawer,
  onOpenNotes,
  onOpenQuiz,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const speeds = [0.75, 1.0, 1.25];

  return (
    <div
      className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-30 w-[96%] max-w-[940px] transition-all duration-300 ${
        isCollapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Toggle Button Tab */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1 bg-slate-900/90 hover:bg-slate-800 text-sky-300 text-xs font-semibold rounded-t-lg border-t border-x border-slate-700/80 shadow-md cursor-pointer transition-colors"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Papar Kawalan Video</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Sembunyi Kawalan (Mod Sinema)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Bottom Dock */}
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 md:p-4 shadow-2xl flex flex-col gap-2.5">
        {/* Timeline Scrubber */}
        <div className="flex flex-col gap-1">
          <div className="relative flex items-center group">
            {/* Scene Markers Along Bar */}
            <div className="absolute inset-x-0 h-2 bg-slate-800 rounded-full overflow-hidden pointer-events-none flex">
              {SCENES.map((s, idx) => {
                const widthPercent = (s.duration / TOTAL_VIDEO_DURATION) * 100;
                return (
                  <div
                    key={s.id}
                    style={{ width: `${widthPercent}%` }}
                    className={`h-full border-r border-slate-900/60 transition-colors ${
                      currentScene.id === s.id ? 'bg-cyan-500/40' : 'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>

            {/* Native Slider */}
            <input
              type="range"
              min={0}
              max={TOTAL_VIDEO_DURATION}
              step={0.1}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="relative w-full h-2 bg-transparent appearance-none cursor-pointer accent-cyan-400 z-10"
            />
          </div>

          {/* Time & Scene Title Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-400">{formatTime(currentTime)}</span>
              <span className="text-slate-500">/</span>
              <span className="font-mono text-slate-400">{formatTime(TOTAL_VIDEO_DURATION)}</span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-sky-950 text-cyan-300 rounded text-[11px] font-heading border border-cyan-800/40">
                {currentScene.title}
              </span>
            </div>

            {/* Quick Education Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenSceneDrawer}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors border border-slate-700"
                title="Pilih Babak"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline font-heading">Senarai Babak</span>
              </button>

              <button
                onClick={onOpenNotes}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors border border-slate-700"
                title="Nota Sains"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline font-heading">Nota Sains</span>
              </button>

              <button
                onClick={onOpenQuiz}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-200 rounded-lg text-xs font-medium cursor-pointer transition-colors border border-amber-600/50"
                title="Kuiz Cilik Kitaran Air"
              >
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-heading font-bold">Uji Minda!</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Row: Playback Controls & Utility Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
          {/* Left: Playback buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onReplay}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Ulang Dari Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onPrevScene}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Babak Sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onPlayPause}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
              title={isPlaying ? 'Jeda (Pause)' : 'Main (Play)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span className="text-xs font-heading">{isPlaying ? 'JEDA' : 'MAIN'}</span>
            </button>

            <button
              onClick={onNextScene}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Babak Seterusnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Speed Multiplier */}
            <div className="hidden sm:flex items-center gap-1 ml-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
              {speeds.map(spd => (
                <button
                  key={spd}
                  onClick={() => onChangeSpeed(spd)}
                  className={`px-1.5 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Right: Audio toggles, Subtitles, 3D explore, Fullscreen */}
          <div className="flex items-center gap-1">
            {/* Narration Voice Toggle */}
            <button
              onClick={onToggleVoice}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                isVoiceMuted
                  ? 'text-red-400 bg-red-950/40 hover:bg-red-900/50'
                  : 'text-sky-300 bg-sky-950/50 hover:bg-sky-900/50'
              }`}
              title={isVoiceMuted ? 'Aktifkan Suara Latar' : 'Senyapkan Suara Latar'}
            >
              {isVoiceMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="hidden lg:inline text-[11px]">Suara</span>
            </button>

            {/* BGM Toggle */}
            <button
              onClick={onToggleMusic}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                isMusicMuted
                  ? 'text-slate-500 bg-slate-800 hover:bg-slate-700'
                  : 'text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50'
              }`}
              title={isMusicMuted ? 'Aktifkan Muzik Latar' : 'Senyapkan Muzik Latar'}
            >
              <Music className="w-4 h-4" />
              <span className="hidden lg:inline text-[11px]">Muzik</span>
            </button>

            {/* Master Mute */}
            <button
              onClick={onToggleMute}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={isMuted ? 'Buka Audio' : 'Senyapkan Semua'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Subtitles Toggle */}
            <button
              onClick={onToggleSubtitles}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                subtitlesEnabled
                  ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-700/50'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
              title={subtitlesEnabled ? 'Tutup Sari Kata' : 'Buka Sari Kata'}
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Large font toggle for classroom screens */}
            {subtitlesEnabled && (
              <button
                onClick={onToggleLargeFont}
                className={`px-1.5 py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition-colors ${
                  largeFont
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Saiz Fon Sari Kata"
              >
                A+
              </button>
            )}

            {/* 3D Explore Mode Toggle */}
            <button
              onClick={onToggleExplore}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                isExploreMode
                  ? 'text-amber-300 bg-amber-950/70 border border-amber-600/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Mod Teroka 3D (Bebas Putar Objek)"
            >
              <Compass className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">Teroka 3D</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={onToggleFullscreen}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? 'Keluar Skrin Penuh' : 'Skrin Penuh (16:9)'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
