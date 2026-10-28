import React, { useState } from 'react';
import { X, Award, CheckCircle, AlertCircle, RotateCcw, ChevronRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/scenesData';
import { audioEngine } from '../audio/audioEngine';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      audioEngine.playChime();
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      audioEngine.playCelebrationFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative text-slate-100 flex flex-col gap-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-700/60">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-heading">
              Aktiviti Pengukuhan Murid
            </span>
            <h2 className="text-xl font-bold text-white font-heading">
              Kuiz Cilik Kitaran Air
            </h2>
          </div>
        </div>

        {!isFinished ? (
          <>
            {/* Progress Bar & Question Counter */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Soalan {currentIndex + 1} daripada {QUIZ_QUESTIONS.length}</span>
                <span className="text-amber-400 font-heading">Markah Semasa: {score}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <p className="text-base font-bold text-white leading-snug font-heading">
                {currentQ.question}
              </p>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200';
                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-bold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-red-950/90 border-red-500 text-red-200 line-through';
                  } else {
                    btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div className="p-3 bg-cyan-950/60 rounded-xl border border-cyan-800/60 flex flex-col gap-1 animate-in fade-in">
                <span className="text-xs font-bold text-cyan-300 font-heading">
                  {selectedOption === currentQ.correctIndex ? '✓ Tepat Sekali!' : 'i Penerangan Sains:'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl font-heading text-sm shadow-lg shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
                >
                  <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Soalan Seterusnya' : 'Lihat Keputusan'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Finished State */
          <div className="flex flex-col items-center text-center py-4 gap-4 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
              <Star className="w-10 h-10 text-slate-950 fill-current" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-heading">
                Keputusan Kuiz Anda
              </span>
              <h3 className="text-2xl font-black text-white font-heading">
                {score === 5
                  ? 'Cemerlang! Anda Wira Air Sejati!'
                  : score >= 3
                  ? 'Bagus! Pemahaman Yang Mantap!'
                  : 'Usaha Lagi! Tonton Video Semula!'}
              </h3>
              <p className="text-sm text-slate-300 font-sans">
                Anda telah menjawab <span className="font-bold text-amber-400">{score}</span> daripada {QUIZ_QUESTIONS.length} soalan dengan tepat.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 w-full flex items-center justify-around">
              <div>
                <span className="text-xs text-slate-400 block">Status Lencana</span>
                <span className="text-sm font-bold text-cyan-300 font-heading">
                  Wira Pemuliharaan Air
                </span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-xs text-slate-400 block">Slogan Utama</span>
                <span className="text-sm font-bold text-amber-300 font-heading">
                  Jaga Air, Jaga Kehidupan!
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold font-heading cursor-pointer transition-colors border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Cuba Lagi</span>
              </button>

              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white rounded-xl text-xs font-bold font-heading cursor-pointer transition-transform active:scale-95 shadow-md shadow-cyan-500/20"
              >
                <span>Kembali Ke Video</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
