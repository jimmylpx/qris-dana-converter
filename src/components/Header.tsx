import React from 'react';
import { ShieldCheck, BookOpen, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onReset: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, onReset, hasData }) => {
  return (
    <header className="border-b-2 border-black dark:border-white bg-white dark:bg-brutal-darkCard sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 text-white font-black text-lg border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark flex items-center justify-center tracking-tighter">
            QR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-black dark:text-white uppercase">
                QRIS <span className="text-brand-500 underline decoration-2">Converter</span>
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-brutal-yellow text-black border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark">
                Universal Static
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 hidden sm:block font-medium">
              Konversi QRIS ke Payload Statis & Simulator Dinamis EMVCo
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasData && (
            <button
              onClick={onReset}
              className="btn-brutal bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white px-3 py-1.5 text-xs flex items-center gap-1.5"
              title="Reset data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={onOpenGuide}
            className="btn-brutal bg-white dark:bg-neutral-900 text-black dark:text-white px-3 py-1.5 text-xs flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-500" />
            <span>Panduan</span>
          </button>

          <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-black dark:text-white bg-brutal-green border-2 border-black dark:border-white px-2.5 py-1 shadow-brutal-sm dark:shadow-brutal-sm-dark uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Client-Side</span>
          </div>
        </div>
      </div>
    </header>
  );
};
