import React from 'react';
import { X, Globe, Bot, HelpCircle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="card-brutal max-w-2xl w-full p-6 relative my-8 shadow-brutal-lg dark:shadow-brutal-lg-dark">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn-brutal bg-neutral-200 dark:bg-neutral-800 p-1 text-black dark:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-black text-black dark:text-white uppercase flex items-center gap-2 mb-1 tracking-tight">
          <HelpCircle className="w-5 h-5 text-dana-500" />
          Panduan QRIS DANA & Deploy Vercel
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 font-medium">
          Langkah mengekstrak payload untuk bot Telegram dan publikasi web app ke domain <code>.vercel.app</code> secara gratis.
        </p>

        <div className="space-y-5 text-xs text-black dark:text-white font-medium">
          {/* Section 1 */}
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark space-y-2">
            <h3 className="font-black text-sm uppercase flex items-center gap-2">
              <span className="w-5 h-5 bg-dana-500 text-white flex items-center justify-center text-[11px] font-black border border-black dark:border-white">1</span>
              Ambil Gambar QRIS dari DANA
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>Buka aplikasi <strong>DANA</strong> di ponsel.</li>
              <li>Pilih menu <strong>DANA Bisnis</strong> atau <strong>Bisnis Saya</strong>.</li>
              <li>Pilih <strong>QR Bisnis</strong> / <strong>Tampilkan QR</strong>.</li>
              <li>Unduh gambar atau lakukan screenshot.</li>
              <li>Upload gambar ke web ini atau tekan <kbd className="bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 font-bold font-mono text-[10px]">Ctrl + V</kbd>.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark space-y-2">
            <h3 className="font-black text-sm uppercase flex items-center gap-2">
              <span className="w-5 h-5 bg-brutal-green text-black flex items-center justify-center text-[11px] font-black border border-black dark:border-white">2</span>
              Pasang di Bot Telegram (<Bot className="w-4 h-4 inline text-emerald-600 dark:text-emerald-400" /> bottele)
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Salin string dari tombol <strong>"Salin Format .env"</strong>, lalu tempelkan ke konfigurasi bot:
            </p>
            <div className="bg-white dark:bg-black p-2.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 border-2 border-black dark:border-white font-bold">
              QRIS_BASE_PAYLOAD=00020101021126570011ID.DANA.WWW...6304XXXX
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-[11px]">
              Setiap kali customer checkout pesanan, bot akan otomatis menyisipkan nominal belanja menjadi QRIS Dinamis.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark space-y-3">
            <h3 className="font-black text-sm uppercase flex items-center gap-2">
              <span className="w-5 h-5 bg-brutal-yellow text-black flex items-center justify-center text-[11px] font-black border border-black dark:border-white">3</span>
              Deploy ke Vercel (<Globe className="w-4 h-4 inline text-sky-500" /> *.vercel.app)
            </h3>

            <div className="space-y-2">
              <p className="font-bold">Melalui Vercel Dashboard:</p>
              <ol className="list-decimal pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
                <li>Buka <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="underline font-bold text-dana-600 dark:text-dana-400">vercel.com/new</a> dan login akun GitHub Anda.</li>
                <li>Import repository <strong>qris-dana-converter</strong>.</li>
                <li>Vercel otomatis mendeteksi preset Vite. Langsung klik <strong>Deploy</strong>.</li>
                <li>Selesai, web app live di domain <code className="bg-white dark:bg-black px-1 border border-black dark:border-white font-mono">https://nama-proyek.vercel.app</code>.</li>
              </ol>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-brutal w-full mt-6 py-3 bg-black text-white dark:bg-white dark:text-black text-xs uppercase tracking-wider"
        >
          Tutup Panduan
        </button>
      </div>
    </div>
  );
};
