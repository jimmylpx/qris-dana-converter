import React from 'react';
import { ShieldCheck, BookOpen, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onReset: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, onReset, hasData }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-dana-600 to-sky-400 flex items-center justify-center shadow-lg shadow-dana-500/20 text-white font-bold text-lg ring-1 ring-white/20">
            QR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                DANA QRIS <span className="text-dana-400 font-extrabold">Converter</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-dana-500/10 text-dana-400 border border-dana-500/30">
                Bisnis Static
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Konversi QRIS DANA ke Payload Statis & Simulator Dinamis EMVCo
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasData && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
              title="Reset data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dana-300 hover:text-white bg-dana-950/60 hover:bg-dana-900/80 border border-dana-800/60 transition shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-dana-400" />
            <span>Panduan Bot & Vercel</span>
          </button>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side</span>
          </div>
        </div>
      </div>
    </header>
  );
};
