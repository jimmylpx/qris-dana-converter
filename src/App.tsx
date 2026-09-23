import React, { useState } from 'react';
import { Header } from './components/Header';
import { QrUploader } from './components/QrUploader';
import { PayloadResult } from './components/PayloadResult';
import { DynamicSimulator } from './components/DynamicSimulator';
import { GuideModal } from './components/GuideModal';
import { extractQrisMetadata, convertToStaticBasePayload, QrisMetadata } from './lib/qrisConverter';
import { Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [staticPayload, setStaticPayload] = useState<string>('');
  const [metadata, setMetadata] = useState<QrisMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const handlePayloadDetected = (payload: string) => {
    setIsLoading(true);
    try {
      const meta = extractQrisMetadata(payload);
      const convertedStatic = convertToStaticBasePayload(payload);

      setStaticPayload(convertedStatic);
      setMetadata(meta);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStaticPayload('');
    setMetadata(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={handleReset}
        hasData={Boolean(staticPayload)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dana-500/10 border border-dana-500/20 text-dana-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tools DANA Bisnis & EMVCo QRIS Standar</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ubah QRIS DANA Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-dana-400 via-sky-300 to-emerald-400">Payload Statis</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Ekstrak string payload dari gambar barcode QRIS DANA Anda secara instan untuk kebutuhan fitur <strong className="text-slate-200">Mengonversi payload statis DANA Bisnis</strong> pada bot Telegram atau aplikasi kasir Anda.
          </p>
        </div>

        {/* Upload / Input Component */}
        <QrUploader
          onPayloadDetected={handlePayloadDetected}
          isLoading={isLoading}
        />

        {/* Results Section (Appears after decoding QRIS) */}
        {metadata && staticPayload && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Step 1: Static Payload Result */}
            <PayloadResult
              metadata={metadata}
              staticPayload={staticPayload}
            />

            {/* Step 2: Dynamic QRIS Simulator */}
            <DynamicSimulator
              staticPayload={staticPayload}
              merchantName={metadata.merchantName}
            />
          </div>
        )}

        {/* Features / Why this tool section */}
        {!metadata && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-900">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-dana-500/10 text-dana-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Ekstraksi Akurat 100%</h4>
              <p className="text-[11px] text-slate-400">
                Mem-parsing standar EMVCo TLV untuk mengambil nama toko, ID merchant DANA, dan menghitung ulang CRC-16 dengan validitas tinggi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Siap untuk Bot Telegram</h4>
              <p className="text-[11px] text-slate-400">
                Format keluaran disesuaikan langsung dengan variabel <code className="text-emerald-400">QRIS_BASE_PAYLOAD</code> pada konfigurasi bottele Anda.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Aman & Terjamin Privasi</h4>
              <p className="text-[11px] text-slate-400">
                Proses decode gambar dilakukan 100% di browser Anda (Client-Side). Gambar dan data QRIS Anda tidak pernah disimpan di server mana pun.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          DANA QRIS to Static Payload Converter • Siap Dideploy ke <span className="text-slate-300 font-semibold">Vercel</span>
        </p>
      </footer>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};
