/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  BookOpen,
  Award,
  Layers,
  Volume2,
  Droplets,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ThreeCanvas } from './components/ThreeCanvas';
import { VideoPlayerControls } from './components/VideoPlayerControls';
import { SubtitlesOverlay } from './components/SubtitlesOverlay';
import { SceneSelectorDrawer } from './components/SceneSelectorDrawer';
import { InteractiveHotspotModal } from './components/InteractiveHotspotModal';
import { QuizModal } from './components/QuizModal';
import { ScienceNotesModal } from './components/ScienceNotesModal';
import { SCENES, TOTAL_VIDEO_DURATION } from './data/scenesData';
import { audioEngine } from './audio/audioEngine';
import { Hotspot } from './types';

export default function App() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isExploreMode, setIsExploreMode] = useState<boolean>(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(true);
  const [largeFont, setLargeFont] = useState<boolean>(false);

  // Audio states
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);
  const [isSfxMuted, setIsSfxMuted] = useState<boolean>(false);

  // UI Modal states
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSceneDrawerOpen, setIsSceneDrawerOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showTitisMessage, setShowTitisMessage] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const currentSceneIndexRef = useRef<number>(0);

  // Determine current active scene based on currentTime
  const currentSceneIndex = SCENES.findIndex(
    s => currentTime >= s.startTime && currentTime < s.endTime
  );
  const activeIndex = currentSceneIndex !== -1 ? currentSceneIndex : SCENES.length - 1;
  const currentScene = SCENES[activeIndex];

  // Handle scene voiceover and ambient audio triggers on scene change
  useEffect(() => {
    if (currentSceneIndexRef.current !== activeIndex) {
      currentSceneIndexRef.current = activeIndex;

      // Update background ambient sound and music
      audioEngine.updateSceneAudio(currentScene.bgmMood, currentScene.ambientSound);

      // Trigger standard Malay voiceover narration if playing
      if (isPlaying) {
        audioEngine.speakNarration(currentScene.narrationText, 0.92 * playbackSpeed);
      }

      // If reaching the final scene (Babak 8), fire celebratory confetti
      if (activeIndex === 7) {
        try {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch {}
      }
    }
  }, [activeIndex, isPlaying, playbackSpeed, currentScene]);

  // Main playback timer loop
  useEffect(() => {
    let animFrame: number;

    const loop = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        setCurrentTime(prev => {
          const next = prev + deltaSec * playbackSpeed;
          if (next >= TOTAL_VIDEO_DURATION) {
            setIsPlaying(false);
            audioEngine.stopNarration();
            audioEngine.playCelebrationFanfare();
            return TOTAL_VIDEO_DURATION;
          }
          return next;
        });
      }

      animFrame = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, playbackSpeed]);

  // Player controls handlers
  const handlePlayPause = () => {
    if (currentTime >= TOTAL_VIDEO_DURATION) {
      // Replay if finished
      handleReplay();
      return;
    }

    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (nextState) {
      audioEngine.resume();
      audioEngine.speakNarration(currentScene.narrationText, 0.92 * playbackSpeed);
    } else {
      audioEngine.pause();
      audioEngine.stopNarration();
    }
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    currentSceneIndexRef.current = -1; // force retrigger
    audioEngine.stopNarration();
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    const newSceneIdx = SCENES.findIndex(s => seconds >= s.startTime && seconds < s.endTime);
    if (newSceneIdx !== -1 && newSceneIdx !== currentSceneIndexRef.current) {
      currentSceneIndexRef.current = newSceneIdx;
      audioEngine.updateSceneAudio(SCENES[newSceneIdx].bgmMood, SCENES[newSceneIdx].ambientSound);
      if (isPlaying) {
        audioEngine.speakNarration(SCENES[newSceneIdx].narrationText, 0.92 * playbackSpeed);
      }
    }
  };

  const handlePrevScene = () => {
    const prevIdx = Math.max(0, activeIndex - 1);
    handleSeek(SCENES[prevIdx].startTime);
  };

  const handleNextScene = () => {
    const nextIdx = Math.min(SCENES.length - 1, activeIndex + 1);
    handleSeek(SCENES[nextIdx].startTime);
  };

  const handleSelectScene = (sceneIndex: number) => {
    handleSeek(SCENES[sceneIndex].startTime);
  };

  // Audio toggle handlers
  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleVoice = () => {
    const muted = audioEngine.toggleVoice();
    setIsVoiceMuted(muted);
    if (!muted && isPlaying) {
      audioEngine.speakNarration(currentScene.narrationText, 0.92 * playbackSpeed);
    }
  };

  const handleToggleMusic = () => {
    const muted = audioEngine.toggleMusic();
    setIsMusicMuted(muted);
  };

  const handleToggleSfx = () => {
    const muted = audioEngine.toggleSfx();
    setIsSfxMuted(muted);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Click on Titis character in 3D
  const handleTitisClick = useCallback(() => {
    audioEngine.playChime();
    audioEngine.speakNarration('Hai! Saya Titis. Ingat slogan kita: Jaga Air, Jaga Kehidupan!');
    setShowTitisMessage(true);
    setTimeout(() => setShowTitisMessage(false), 4500);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-6xl px-4 py-3 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-black text-sm md:text-base text-white tracking-wide">
              KESAN JIKA ALIRAN AIR TERGANGGU
            </h1>
            <p className="text-[11px] text-cyan-400 font-medium">
              Video Animasi Pendidikan 3D • KSSR Sains Sekolah Rendah
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSceneDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-heading">8 Babak</span>
          </button>

          <button
            onClick={() => setIsNotesOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold rounded-xl border border-emerald-700/60 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-heading">Nota Sains</span>
          </button>

          <button
            onClick={() => setIsQuizOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-heading rounded-xl shadow-md shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 fill-slate-950" />
            <span>Kuiz Cilik</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl px-3 md:px-6 py-4 flex flex-col items-center gap-4">
        {/* 16:9 Landscape Video Container */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl shadow-cyan-950/20"
        >
          {/* Three.js 3D Interactive World */}
          <ThreeCanvas
            currentSceneIndex={activeIndex}
            isExploreMode={isExploreMode}
            onHotspotClick={(hs) => setSelectedHotspot(hs)}
            onTitisClick={handleTitisClick}
          />

          {/* Subtitles Overlay */}
          <SubtitlesOverlay
            currentScene={currentScene}
            currentTime={currentTime}
            subtitlesEnabled={subtitlesEnabled}
            largeFont={largeFont}
          />

          {/* Titis Speech Balloon Bubble */}
          {showTitisMessage && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 bg-cyan-900/95 border-2 border-cyan-400 text-white font-heading font-bold text-sm md:text-base rounded-2xl shadow-2xl animate-in zoom-in-95 pointer-events-none flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Hai! Saya Titis. Ingat slogan kita: “JAGA AIR, JAGA KEHIDUPAN!”</span>
            </div>
          )}

          {/* Video Player Controls (Bottom Dock) */}
          <VideoPlayerControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            currentScene={currentScene}
            playbackSpeed={playbackSpeed}
            isExploreMode={isExploreMode}
            subtitlesEnabled={subtitlesEnabled}
            largeFont={largeFont}
            isMuted={isMuted}
            isVoiceMuted={isVoiceMuted}
            isMusicMuted={isMusicMuted}
            isSfxMuted={isSfxMuted}
            isFullscreen={isFullscreen}
            onPlayPause={handlePlayPause}
            onReplay={handleReplay}
            onSeek={handleSeek}
            onPrevScene={handlePrevScene}
            onNextScene={handleNextScene}
            onSelectScene={handleSelectScene}
            onToggleMute={handleToggleMute}
            onToggleVoice={handleToggleVoice}
            onToggleMusic={handleToggleMusic}
            onToggleSfx={handleToggleSfx}
            onToggleSubtitles={() => setSubtitlesEnabled(!subtitlesEnabled)}
            onToggleLargeFont={() => setLargeFont(!largeFont)}
            onToggleExplore={() => setIsExploreMode(!isExploreMode)}
            onToggleFullscreen={handleToggleFullscreen}
            onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
            onOpenSceneDrawer={() => setIsSceneDrawerOpen(true)}
            onOpenNotes={() => setIsNotesOpen(true)}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />
        </div>

        {/* Scene Information & Learning Objectives Banner */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Active Scene Summary */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-heading">
                  Babak Semasa
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {activeIndex + 1} / 8
                </span>
              </div>
              <h2 className="text-base font-bold text-white font-heading">
                {currentScene.title}
              </h2>
              <p className="text-xs text-amber-300 font-medium mt-0.5">
                Tema: {currentScene.theme}
              </p>
            </div>
            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
              {currentScene.visualDescription}
            </p>
          </div>

          {/* Card 2: Key Science Terms */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-heading">
              Glosari Sains Babak Ini
            </span>
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-24 pr-1">
              {currentScene.keyTerms.map((kt, i) => (
                <div key={i} className="text-xs">
                  <span className="font-bold text-white font-heading">{kt.term}: </span>
                  <span className="text-slate-300">{kt.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Interactive Instruction & Character Tip */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-800/40 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-heading">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Tip Pembelajaran Murid:</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Klik pada watak <strong>Titis</strong> atau butang label biru di dalam video untuk melihat fakta sains tersembunyi! Anda juga boleh mengaktifkan <strong>Mod Teroka 3D</strong> untuk memutar objek 360 darjah.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-yellow-300 font-bold font-heading">
                “Jaga Air, Jaga Kehidupan!”
              </span>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
              >
                Uji Minda Sekarang →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals and Drawers */}
      <SceneSelectorDrawer
        isOpen={isSceneDrawerOpen}
        currentSceneIndex={activeIndex}
        onClose={() => setIsSceneDrawerOpen(false)}
        onSelectScene={handleSelectScene}
      />

      <InteractiveHotspotModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      <ScienceNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />
    </div>
  );
}
