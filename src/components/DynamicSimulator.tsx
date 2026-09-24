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

  useEffect(() => {
    if (!staticPayload) return;
    const generated = generateDynamicQris(staticPayload, amount);
    setDynamicPayload(generated);

    if (qrCanvasRef.current && generated) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        generated,
        {
          width: 220,
          margin: 1,
          color: {
            dark: '#000000',
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
    <div className="card-brutal p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-black dark:border-white">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brutal-green text-black border-2 border-black dark:border-white shadow-brutal-sm flex items-center justify-center font-black">
              <Zap className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-black text-black dark:text-white text-base uppercase tracking-tight">
              Simulator & Generator QRIS Dinamis
            </h3>
            <span className="text-[10px] font-black bg-emerald-300 text-black border-2 border-black dark:border-white px-2 py-0.5 shadow-brutal-sm uppercase">
              Live Testing
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
            Uji konversi payload statis ke dinamis dengan nominal spesifik. Scan QR ini dengan aplikasi pembayaran (m-banking / e-wallet) untuk memastikan nominal muncul otomatis.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Amount input & Quick Chips */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-white mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-brand-500" />
              Nominal Transaksi (Rupiah):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-black dark:text-white">
                Rp
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount || ''}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                placeholder="25000"
                className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-white pl-12 pr-4 py-3 text-base font-black text-black dark:text-white shadow-brutal-sm dark:shadow-brutal-sm-dark focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div>
            <span className="text-[11px] font-black uppercase text-neutral-600 dark:text-neutral-400 mb-2 block">
              Pilih Nominal Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`text-xs px-3 py-1.5 uppercase font-black transition-all ${
                    amount === val
                      ? 'btn-brutal bg-black text-white dark:bg-white dark:text-black'
                      : 'border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  Rp {val.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Payload Output string */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase text-neutral-600 dark:text-neutral-400">
                Payload Dinamis (Tag 01 = 12 & Tag 54 disisipkan):
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] font-black uppercase text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Tersalin' : 'Salin Payload Dinamis'}
              </button>
            </div>
            <div className="bg-neutral-100 dark:bg-neutral-900 p-3 border-2 border-black dark:border-white text-[11px] font-mono text-black dark:text-white break-all select-all leading-relaxed shadow-brutal-sm dark:shadow-brutal-sm-dark">
              {dynamicPayload}
            </div>
          </div>
        </div>

        {/* Right Side: Rendered QR Code Preview Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="bg-white text-black p-4 border-[3px] border-black dark:border-white shadow-brutal dark:shadow-brutal-dark flex flex-col items-center max-w-[260px] w-full text-center">
            <span className="text-[11px] font-black tracking-wider text-brand-600 uppercase mb-0.5">
              QRIS DINAMIS
            </span>
            <span className="text-xs font-black text-black truncate max-w-[220px]">
              {merchantName}
            </span>
            <span className="text-sm font-black text-black my-1 px-2 py-0.5 bg-brutal-yellow border-2 border-black">
              Rp {amount.toLocaleString('id-ID')}
            </span>

            {/* QR Canvas */}
            <div className="border-2 border-black p-1 bg-white mt-1">
              <canvas ref={qrCanvasRef} className="block w-[200px] h-[200px]" />
            </div>

            <span className="text-[10px] text-neutral-600 mt-2 font-bold flex items-center gap-1 uppercase">
              <Smartphone className="w-3 h-3 text-black" /> Scan via E-Wallet / M-Banking
            </span>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="btn-brutal mt-4 bg-brutal-green text-black px-4 py-2 text-xs flex items-center gap-2 uppercase tracking-wide"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            Unduh Gambar QR (PNG)
          </button>
        </div>
      </div>
    </div>
  );
};
