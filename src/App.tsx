import React, { useState } from 'react';
import { Header } from './components/Header';
import { QrUploader } from './components/QrUploader';
import { PayloadResult } from './components/PayloadResult';
import { DynamicSimulator } from './components/DynamicSimulator';
import { GuideModal } from './components/GuideModal';
import { extractQrisMetadata, convertToStaticBasePayload, QrisMetadata } from './lib/qrisConverter';
import { Shield, Zap, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-brutal-bg dark:bg-brutal-darkBg text-black dark:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={handleReset}
        hasData={Boolean(staticPayload)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-block px-3 py-1 bg-brutal-yellow text-black border-2 border-black dark:border-white shadow-brutal-sm text-xs font-black uppercase tracking-wider">
            EMVCo QRIS Standar • Universal
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-tight">
            Konversi QRIS ke <span className="bg-brand-500 text-white px-2 py-0.5 border-2 border-black dark:border-white shadow-brutal-sm">Payload Statis</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium max-w-xl mx-auto">
            Ekstrak string QRIS secara otomatis untuk kebutuhan payload statis dan simulator dinamis.
          </p>
        </div>

        {/* Upload / Input Component */}
        <QrUploader
          onPayloadDetected={handlePayloadDetected}
          isLoading={isLoading}
        />

        {/* Results Section */}
        {metadata && staticPayload && (
          <div className="space-y-8 animate-in fade-in duration-300">
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

        {/* Features Info Cards */}
        {!metadata && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            <div className="card-brutal p-5 space-y-2">
              <div className="w-10 h-10 bg-brand-500 text-white border-2 border-black dark:border-white shadow-brutal-sm flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-xs font-black uppercase text-black dark:text-white">Ekstraksi Akurat</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                Parsing standar EMVCo TLV untuk mengambil nama merchant dan menghitung ulang CRC-16 dengan valid.
              </p>
            </div>

            <div className="card-brutal p-5 space-y-2">
              <div className="w-10 h-10 bg-brutal-green text-black border-2 border-black dark:border-white shadow-brutal-sm flex items-center justify-center font-black">
                <Zap className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-xs font-black uppercase text-black dark:text-white">Standar EMVCo Murni</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                Payload dinormalisasi ke format statis murni tanpa nominal bawaan dan siap disisipkan nominal transaksi.
              </p>
            </div>

            <div className="card-brutal p-5 space-y-2">
              <div className="w-10 h-10 bg-brutal-yellow text-black border-2 border-black dark:border-white shadow-brutal-sm flex items-center justify-center font-black">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-xs font-black uppercase text-black dark:text-white">Aman & Terjamin</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                Semua decoding gambar berjalan 100% di browser pengguna tanpa perantara backend.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black dark:border-white bg-white dark:bg-brutal-darkCard py-6 text-center text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 transition-colors">
        <p>
          QRIS to Static & Dynamic Payload Converter • EMVCo Standard
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
