import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="card-brutal max-w-xl w-full p-6 relative my-8 shadow-brutal-lg dark:shadow-brutal-lg-dark">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn-brutal bg-neutral-200 dark:bg-neutral-800 p-1 text-black dark:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-black text-black dark:text-white uppercase flex items-center gap-2 mb-1 tracking-tight">
          <HelpCircle className="w-5 h-5 text-brand-500" />
          Panduan Penggunaan
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 font-medium">
          Cara mengekstrak barcode QRIS dan mengonversinya menjadi payload statis EMVCo.
        </p>

        <div className="space-y-4 text-xs text-black dark:text-white font-medium">
          {/* Section 1 */}
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark space-y-2">
            <h3 className="font-black text-sm uppercase flex items-center gap-2">
              <span className="w-5 h-5 bg-brand-500 text-white flex items-center justify-center text-[11px] font-black border border-black dark:border-white">1</span>
              Ambil Barcode QRIS Merchant
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li>Buka aplikasi perbankan atau e-wallet (BCA, Mandiri, BRI, BNI, DANA, GoPay, ShopeePay, dll).</li>
              <li>Masuk ke menu <strong>QRIS Bisnis</strong>, <strong>Merchant</strong>, atau <strong>Tampilkan QR Toko</strong>.</li>
              <li>Unduh gambar barcode QRIS atau lakukan tangkapan layar (screenshot).</li>
              <li>Unggah file tersebut ke web ini, atau cukup tekan <kbd className="bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 font-bold font-mono text-[10px]">Ctrl + V</kbd>.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark space-y-2">
            <h3 className="font-black text-sm uppercase flex items-center gap-2">
              <span className="w-5 h-5 bg-brutal-yellow text-black flex items-center justify-center text-[11px] font-black border border-black dark:border-white">2</span>
              Karakteristik Payload Statis
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Payload statis yang dihasilkan telah distandarisasi ke format EMVCo murni (Point of Initiation Method = <code className="bg-white dark:bg-black px-1 border border-black dark:border-white font-bold font-mono">11</code>) tanpa nilai tagihan nominal, sehingga siap disisipkan nominal dinamis kapan saja.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark space-y-2">
            <h3 className="font-black text-sm uppercase flex items-center gap-2">
              <span className="w-5 h-5 bg-brutal-green text-black flex items-center justify-center text-[11px] font-black border border-black dark:border-white">3</span>
              Uji Coba dengan Simulator Dinamis
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Gunakan fitur simulator pada bagian bawah hasil ekstraksi. Masukkan nominal uji coba dan scan QR Code yang muncul di layar menggunakan aplikasi pembayaran apa saja untuk memastikan nama merchant dan nominal terisi secara otomatis.
            </p>
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
