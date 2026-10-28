import React from 'react';
import { X, BookOpen, Droplets, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';

interface ScienceNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScienceNotesModal: React.FC<ScienceNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl w-full max-w-3xl max-h-[85vh] p-6 shadow-2xl relative text-slate-100 flex flex-col gap-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700/60">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-heading">
              Modul Pembelajaran Sains KSSR Sekolah Rendah
            </span>
            <h2 className="text-xl font-bold text-white font-heading">
              Nota Sains: Kesan Jika Aliran Air Terganggu
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 flex flex-col gap-4 text-sm text-slate-200">
          {/* Section 1: Kitaran Air */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold font-heading">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Apakah Kitaran Air Semula Jadi?</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Kitaran air semula jadi ialah pergerakan kitaran air yang berterusan melalui proses <strong>penyejatan</strong> (air bertukar menjadi wap), <strong>kondensasi</strong> (wap menyejuk membentuk awan), dan <strong>kerpasan</strong> (hujan turun membasahi Bumi). Aliran air yang lancar menjamin keseimbangan ekosistem dan bekalan air tawar di planet kita.
            </p>
          </div>

          {/* Section 2: 6 Kesan Jika Aliran Air Terganggu */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-heading">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Kesan-Kesan Utama Gangguan Aliran Air:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-300 block mb-0.5">1. Fenomena Kemarau</span>
                Hujan yang berkurangan menyebabkan sungai menyusut, tanah merekah, dan ketiadaan punca air.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-sky-300 block mb-0.5">2. Kejadian Banjir</span>
                Hujan lebat dalam masa singkat melimpahkan air ke kawasan perumahan, merosakkan jalan raya dan harta.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-red-300 block mb-0.5">3. Krisis Bekalan Air Bersih</span>
                Paras empangan menjunam menyebabkan gangguan air paip untuk minum, memasak, dan kebersihan diri.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-yellow-300 block mb-0.5">4. Hasil Pertanian Menurun</span>
                Tanaman padi, sayur-sayuran dan buah layu, seterusnya mengurangkan bekalan makanan harian.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-purple-300 block mb-0.5">5. Haiwan Kehilangan Habitat</span>
                Sungai dan kolam mengering memusnahkan hidupan akuatik serta mengancam kelangsungan hidupan liar.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-cyan-300 block mb-0.5">6. Perubahan Suhu & Cuaca</span>
                Keseimbangan kelembapan udara terjejas, mempengaruhi suhu persekitaran dan pola cuaca tempatan.
              </div>
            </div>
          </div>

          {/* Section 3: Langkah Pemuliharaan */}
          <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/60 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold font-heading">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tindakan Kita: Cara Menjaga Sumber Air</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 text-slate-300">
              <li>Tutup pili air dengan rapat semasa menggosok gigi atau bersabun.</li>
              <li>Jangan buang sampah, sisa minyak atau bahan kimia ke dalam longkang dan sungai.</li>
              <li>Tanam lebih banyak pokok untuk memelihara kawasan tadahan hujan.</li>
              <li>Segera laporkan paip bocor kepada pihak berkuasa air.</li>
              <li>Gunakan air hujan untuk menyiram pokok bunga dan mencuci laman.</li>
            </ul>
          </div>

          {/* Slogan Banner */}
          <div className="p-4 bg-gradient-to-r from-sky-900 to-cyan-900 rounded-xl border border-cyan-400 text-center flex flex-col items-center gap-1 shadow-md">
            <Heart className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-xs uppercase font-bold text-cyan-200 tracking-wider">
              Mesej Utama Video
            </span>
            <span className="text-lg font-black text-white font-heading">
              “JAGA AIR, JAGA KEHIDUPAN!”
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs font-heading cursor-pointer transition-colors"
          >
            Tutup Nota
          </button>
        </div>
      </div>
    </div>
  );
};
