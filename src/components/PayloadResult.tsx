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
    <div className="space-y-6">
      {/* Merchant Overview Card */}
      <div className="card-brutal p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-black dark:border-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-dana-500 text-white border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark flex items-center justify-center font-black">
              <Store className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-black dark:text-white uppercase tracking-tight">
                  {metadata.merchantName}
                </h3>
                {metadata.isDana ? (
                  <span className="text-[11px] font-black bg-dana-500 text-white border-2 border-black dark:border-white px-2 py-0.5 shadow-brutal-sm uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> DANA Bisnis
                  </span>
                ) : (
                  <span className="text-[11px] font-black bg-brutal-yellow text-black border-2 border-black dark:border-white px-2 py-0.5 shadow-brutal-sm uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> QRIS Standar
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 mt-1 font-semibold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-dana-500" /> {metadata.merchantCity} ({metadata.postalCode})
                </span>
                <span>•</span>
                <span>Mata Uang: {metadata.currency}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark font-mono font-bold">
              CRC-16: <strong className="text-emerald-600 dark:text-emerald-400">{staticPayload.slice(-4)}</strong>
            </span>
          </div>
        </div>

        {/* Converted Static Payload Box */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-black dark:text-white bg-brutal-yellow px-2 py-0.5 border-2 border-black dark:border-white shadow-brutal-sm">
                Payload Statis Bersih
              </span>
              <span className="text-[10px] font-bold uppercase bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white px-2 py-0.5 border-2 border-black dark:border-white">
                Tag 01 = Statis (11)
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyEnv}
                className="btn-brutal bg-white dark:bg-neutral-900 text-black dark:text-white px-3 py-1.5 text-xs flex items-center gap-1.5 uppercase"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Terminal className="w-3.5 h-3.5 text-dana-500" />}
                <span>{copiedEnv ? 'Tersalin .env!' : 'Salin Format .env'}</span>
              </button>

              <button
                onClick={handleCopyPayload}
                className="btn-brutal bg-dana-500 text-white px-3.5 py-1.5 text-xs flex items-center gap-1.5 uppercase"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Tersalin!' : 'Salin String Payload'}</span>
              </button>
            </div>
          </div>

          <div className="w-full bg-[#fefce8] dark:bg-[#181812] p-4 border-2 border-black dark:border-white text-xs font-mono text-black dark:text-yellow-200 break-all leading-relaxed select-all shadow-brutal-sm dark:shadow-brutal-sm-dark">
            {staticPayload}
          </div>

          <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2 shadow-brutal-sm dark:shadow-brutal-sm-dark">
            <Terminal className="w-4 h-4 text-dana-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-black dark:text-white font-black uppercase text-[11px] mb-0.5">Penggunaan pada Bot Telegram:</p>
              <p className="font-medium text-[11px]">
                Masukkan nilai di atas ke file <code className="bg-white dark:bg-black px-1.5 py-0.5 border border-black dark:border-white font-bold font-mono">.env</code> pada variabel{' '}
                <code className="bg-emerald-200 dark:bg-emerald-950 text-black dark:text-emerald-300 px-1.5 py-0.5 border border-black dark:border-white font-bold font-mono">QRIS_BASE_PAYLOAD</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion: EMVCo TLV Tag Inspection */}
      <div className="card-brutal p-5">
        <button
          onClick={() => setShowTlvDetails(!showTlvDetails)}
          className="w-full flex items-center justify-between text-left text-xs font-black uppercase text-black dark:text-white"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-dana-500" />
            <span>Struktur Data EMVCo QRIS (Rincian Tag-Length-Value)</span>
            <span className="text-[10px] bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 font-mono">
              {tags.length} Tag
            </span>
          </div>
          {showTlvDetails ? <ChevronUp className="w-5 h-5 stroke-[2.5]" /> : <ChevronDown className="w-5 h-5 stroke-[2.5]" />}
        </button>

        {showTlvDetails && (
          <div className="mt-4 overflow-x-auto border-2 border-black dark:border-white">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-black text-white dark:bg-white dark:text-black uppercase">
                  <th className="py-2.5 px-3 font-black">Tag</th>
                  <th className="py-2.5 px-3 font-black">Nama Parameter</th>
                  <th className="py-2.5 px-3 font-black">Panjang</th>
                  <th className="py-2.5 px-3 font-black font-mono">Nilai Data</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black dark:divide-white font-mono bg-white dark:bg-neutral-900">
                {tags.map((tag) => (
                  <React.Fragment key={tag.id}>
                    <tr className="hover:bg-neutral-100 dark:hover:bg-neutral-800/80">
                      <td className="py-2 px-3 text-dana-600 dark:text-dana-400 font-black">{tag.id}</td>
                      <td className="py-2 px-3 text-black dark:text-white font-sans font-bold">{tag.name}</td>
                      <td className="py-2 px-3 text-neutral-600 dark:text-neutral-400">{tag.length}</td>
                      <td className="py-2 px-3 text-black dark:text-white break-all">{tag.value}</td>
                    </tr>
                    {tag.subTags && tag.subTags.map((sub) => (
                      <tr key={`${tag.id}-${sub.id}`} className="bg-neutral-50 dark:bg-neutral-950 text-[11px]">
                        <td className="py-1.5 px-3 pl-8 text-sky-600 dark:text-sky-400 font-bold">└─ {sub.id}</td>
                        <td className="py-1.5 px-3 text-neutral-600 dark:text-neutral-400 font-sans">{sub.name}</td>
                        <td className="py-1.5 px-3 text-neutral-500">{sub.length}</td>
                        <td className="py-1.5 px-3 text-neutral-800 dark:text-neutral-200 break-all">{sub.value}</td>
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
