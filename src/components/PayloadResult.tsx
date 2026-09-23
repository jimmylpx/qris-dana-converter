import React, { useState } from 'react';
import { Copy, Check, Store, MapPin, CheckCircle2, ChevronDown, ChevronUp, Layers, Terminal, AlertTriangle } from 'lucide-react';
import { QrisMetadata } from '../lib/qrisConverter';
import { EmvTag, parseTlv } from '../lib/emvco';

interface PayloadResultProps {
  metadata: QrisMetadata;
  staticPayload: string;
}

export const PayloadResult: React.FC<PayloadResultProps> = ({ metadata, staticPayload }) => {
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [showTlvDetails, setShowTlvDetails] = useState(false);

  const tags: EmvTag[] = parseTlv(staticPayload);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(staticPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopyEnv = () => {
    const envText = `QRIS_BASE_PAYLOAD=${staticPayload}`;
    navigator.clipboard.writeText(envText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Merchant Overview Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-dana-500/10 border border-dana-500/20 text-dana-400 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">{metadata.merchantName}</h3>
                {metadata.isDana ? (
                  <span className="text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> DANA Bisnis
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> QRIS Standar
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> {metadata.merchantCity} ({metadata.postalCode})
                </span>
                <span>•</span>
                <span>Mata Uang: {metadata.currency}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              CRC-16: <strong className="text-emerald-400">{staticPayload.slice(-4)}</strong>
            </span>
          </div>
        </div>

        {/* Converted Static Payload Box */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-dana-400">
                Payload Statis Bersih (Siap Pakai untuk Bot)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                Tag 01 = Statis (11)
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyEnv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5 text-dana-400" />}
                <span>{copiedEnv ? 'Tersalin .env!' : 'Salin Format .env'}</span>
              </button>

              <button
                onClick={handleCopyPayload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-dana-600 hover:bg-dana-500 text-white shadow-lg shadow-dana-600/30 transition"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Tersalin!' : 'Salin String Payload'}</span>
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 break-all leading-relaxed select-all">
              {staticPayload}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
            <Terminal className="w-4 h-4 text-dana-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-300 font-medium mb-0.5">Cara Penggunaan di Proyek Bot Telegram Anda:</p>
              <p>
                Buka file <code className="text-dana-300 bg-slate-900 px-1.5 py-0.5 rounded">.env</code> lalu masukkan nilai di atas ke variabel{' '}
                <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">QRIS_BASE_PAYLOAD</code>. Bot Anda akan otomatis menyisipkan nominal pesanan menjadi QRIS Dinamis!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion: EMVCo TLV Tag Inspection */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <button
          onClick={() => setShowTlvDetails(!showTlvDetails)}
          className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-dana-400" />
            <span>Struktur Data EMVCo QRIS (Rincian Tag-Length-Value)</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              {tags.length} Tag Utama
            </span>
          </div>
          {showTlvDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTlvDetails && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3 font-semibold">Tag</th>
                  <th className="py-2 px-3 font-semibold">Nama Parameter</th>
                  <th className="py-2 px-3 font-semibold">Panjang</th>
                  <th className="py-2 px-3 font-semibold font-mono">Nilai Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {tags.map((tag) => (
                  <React.Fragment key={tag.id}>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-dana-400 font-bold">{tag.id}</td>
                      <td className="py-2 px-3 text-slate-300 font-sans">{tag.name}</td>
                      <td className="py-2 px-3 text-slate-400">{tag.length}</td>
                      <td className="py-2 px-3 text-slate-200 break-all">{tag.value}</td>
                    </tr>
                    {tag.subTags && tag.subTags.map((sub) => (
                      <tr key={`${tag.id}-${sub.id}`} className="bg-slate-950/40 text-[11px]">
                        <td className="py-1.5 px-3 pl-8 text-sky-400">└─ {sub.id}</td>
                        <td className="py-1.5 px-3 text-slate-400 font-sans">{sub.name}</td>
                        <td className="py-1.5 px-3 text-slate-500">{sub.length}</td>
                        <td className="py-1.5 px-3 text-slate-300 break-all">{sub.value}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
