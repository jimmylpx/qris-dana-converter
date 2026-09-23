import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { generateDynamicQris } from '../lib/qrisConverter';
import { Smartphone, Download, Copy, Check, Zap, DollarSign } from 'lucide-react';

interface DynamicSimulatorProps {
  staticPayload: string;
  merchantName: string;
}

export const DynamicSimulator: React.FC<DynamicSimulatorProps> = ({ staticPayload, merchantName }) => {
  const [amount, setAmount] = useState<number>(25000);
  const [dynamicPayload, setDynamicPayload] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate dynamic payload & QR Code whenever amount or staticPayload changes
  useEffect(() => {
    if (!staticPayload) return;
    const generated = generateDynamicQris(staticPayload, amount);
    setDynamicPayload(generated);

    if (qrCanvasRef.current && generated) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        generated,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (error) console.error('Gagal generate QR Code canvas:', error);
        }
      );
    }
  }, [staticPayload, amount]);

  const handleCopy = () => {
    navigator.clipboard.writeText(dynamicPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = `QRIS-Dinamis-Rp${amount.toLocaleString('id-ID')}.png`;
    link.href = qrCanvasRef.current.toDataURL('image/png');
    link.click();
  };

  const quickAmounts = [10000, 25000, 50000, 100000, 250000];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">Simulator & Generator QRIS Dinamis</h3>
            <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Live Testing
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Uji konversi payload statis ke dinamis dengan nominal spesifik. Scan QR ini dengan aplikasi DANA untuk memastikan nominal muncul otomatis!
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Amount input & Quick Chips */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Nominal Transaksi (Rupiah):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount || ''}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                placeholder="25000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">Pilih Nominal Cepat:</span>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                    amount === val
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  Rp {val.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Payload Output string */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                Hasil Payload Dinamis (Tag 01 = 12 & Tag 54 disisipkan):
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Tersalin' : 'Salin Payload Dinamis'}
              </button>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all leading-relaxed">
              {dynamicPayload}
            </div>
          </div>
        </div>

        {/* Right Side: Rendered QR Code Preview Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center border-4 border-slate-800/60 max-w-[260px] w-full text-center">
            <span className="text-[11px] font-extrabold tracking-wider text-dana-600 uppercase mb-1">
              QRIS DANA DINAMIS
            </span>
            <span className="text-xs font-bold text-slate-800 truncate max-w-[220px]">
              {merchantName}
            </span>
            <span className="text-sm font-extrabold text-emerald-600 mb-2">
              Rp {amount.toLocaleString('id-ID')}
            </span>

            {/* QR Canvas */}
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <canvas ref={qrCanvasRef} className="block w-[200px] h-[200px]" />
            </div>

            <span className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-slate-500" /> Scan via DANA / GoPay / BCA
            </span>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Unduh Gambar QR Code (PNG)
          </button>
        </div>
      </div>
    </div>
  );
};
