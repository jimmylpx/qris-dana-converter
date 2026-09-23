import React from 'react';
import { X, Globe, Bot, HelpCircle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <HelpCircle className="w-5 h-5 text-dana-400" />
          Panduan QRIS DANA Bisnis & Deploy Vercel
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Langkah mudah mengekstrak payload untuk bot Telegram dan mempublikasikan web app ini ke domain <code>.vercel.app</code> secara gratis.
        </p>

        <div className="space-y-6 text-xs text-slate-300">
          {/* Section 1: Cara Ambil QRIS dari DANA */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-dana-600 text-white flex items-center justify-center text-[10px]">1</span>
              Cara Mendapatkan Gambar QRIS DANA Bisnis
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Buka aplikasi <strong>DANA</strong> di ponsel Anda.</li>
              <li>Pilih menu <strong>DANA Bisnis</strong> atau <strong>Bisnis Saya</strong>.</li>
              <li>Pilih <strong>QR Bisnis</strong> / <strong>Tampilkan QR</strong>.</li>
              <li>Klik <strong>Unduh Gambar</strong> atau lakukan tangkapan layar (screenshot).</li>
              <li>Unggah gambar tersebut ke web app ini atau tekan <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white font-mono">Ctrl + V</kbd>.</li>
            </ul>
          </div>

          {/* Section 2: Integrasi ke Bot Telegram */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
              Cara Pasang di Bot Telegram (<Bot className="w-3.5 h-3.5 inline text-emerald-400" /> bottele)
            </h3>
            <p className="text-slate-400">
              Salin string dari tombol <strong className="text-white">"Salin Format .env"</strong> di atas, lalu tempelkan ke file konfigurasi bot Anda:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-emerald-400 border border-slate-800">
              QRIS_BASE_PAYLOAD=00020101021126570011ID.DANA.WWW...6304XXXX
            </div>
            <p className="text-slate-400 text-[11px]">
              Setiap kali customer melakukan checkout pesanan, bot akan otomatis menyisipkan nominal belanja dan menghasilkan QRIS Dinamis unik secara instan!
            </p>
          </div>

          {/* Section 3: Cara Deploy ke Vercel */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">3</span>
              Cara Deploy ke Vercel (<Globe className="w-3.5 h-3.5 inline text-sky-400" /> *.vercel.app)
            </h3>

            <div className="space-y-2">
              <p className="font-semibold text-slate-200">Metode A: Melalui Vercel Dashboard (Rekomendasi):</p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-400">
                <li>Upload folder proyek <code className="text-dana-300">qris-dana-converter</code> ini ke akun <strong>GitHub</strong> Anda.</li>
                <li>Buka <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-dana-400 underline">vercel.com</a> dan login/daftar.</li>
                <li>Klik tombol <strong>"Add New..." → "Project"</strong>.</li>
                <li>Pilih repository GitHub proyek Anda, lalu klik <strong>Import</strong>.</li>
                <li>Vercel akan otomatis mengenali preset <strong>Vite</strong>. Langsung klik <strong>Deploy</strong>!</li>
                <li>Dalam hitungan detik, web app Anda sudah aktif di domain <code className="text-emerald-400 font-mono">https://nama-proyek.vercel.app</code>.</li>
              </ol>
            </div>

            <div className="pt-2 border-t border-slate-900 space-y-1">
              <p className="font-semibold text-slate-200">Metode B: Melalui Terminal (Vercel CLI):</p>
              <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-slate-200 border border-slate-800">
                npx vercel
              </div>
              <p className="text-slate-500 text-[11px]">Cukup ikuti petunjuk prompt di terminal untuk login dan langsung online.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 bg-dana-600 hover:bg-dana-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-dana-600/25"
        >
          Mengerti & Tutup Panduan
        </button>
      </div>
    </div>
  );
};
