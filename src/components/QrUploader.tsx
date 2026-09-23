import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { Upload, Camera, FileText, Image as ImageIcon, Sparkles, AlertCircle, X } from 'lucide-react';

interface QrUploaderProps {
  onPayloadDetected: (payload: string) => void;
  isLoading: boolean;
}

const SAMPLE_DANA_PAYLOAD = "00020101021126570011ID.DANA.WWW011893600915304267225902090426722590303UKE51440014ID.CO.QRIS.WWW0215ID10200329284720303UKE5204581353033605802ID5920WARUNG KEMIRI RAYA 16014Kota Palembang6105301156304D909";

export const QrUploader: React.FC<QrUploaderProps> = ({ onPayloadDetected, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [textInput, setTextInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Decode QR Code from Image Element / Canvas
  const decodeQrFromImage = useCallback((img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setErrorMessage('Gagal memproses context canvas browser.');
      return;
    }

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    if (code && code.data) {
      setErrorMessage(null);
      onPayloadDetected(code.data);
    } else {
      setErrorMessage('QR Code tidak terdeteksi pada gambar. Pastikan gambar jelas dan tidak buram.');
    }
  }, [onPayloadDetected]);

  // Handle File Upload / Dropped File
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap unggah file gambar (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => decodeQrFromImage(img);
      img.onerror = () => setErrorMessage('Gagal memuat gambar.');
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [decodeQrFromImage]);

  // Global Clipboard Paste Listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            handleFile(blob);
            break;
          }
        } else if (item.type === 'text/plain') {
          item.getAsString((text) => {
            const trimmed = text.trim();
            if (trimmed.startsWith('000201') || trimmed.includes('ID.DANA.WWW')) {
              onPayloadDetected(trimmed);
            }
          });
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFile, onPayloadDetected]);

  // Camera Scanning Logic
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (cameraActive) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.setAttribute('playsinline', 'true');
            videoRef.current.play();

            const scanLoop = () => {
              if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'attemptBoth',
                  });
                  if (code && code.data) {
                    setCameraActive(false);
                    onPayloadDetected(code.data);
                    return;
                  }
                }
              }
              animationFrameRef.current = requestAnimationFrame(scanLoop);
            };

            animationFrameRef.current = requestAnimationFrame(scanLoop);
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
          setCameraActive(false);
        });
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive, onPayloadDetected]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = textInput.trim();
    if (!trimmed) {
      setErrorMessage('Silakan tempel string QRIS terlebih dahulu.');
      return;
    }
    setErrorMessage(null);
    onPayloadDetected(trimmed);
  };

  const handleSampleClick = () => {
    setTextInput(SAMPLE_DANA_PAYLOAD);
    onPayloadDetected(SAMPLE_DANA_PAYLOAD);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-dana-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tabs */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'upload'
                ? 'bg-dana-500 text-white shadow-md shadow-dana-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Upload / Scan Gambar
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'text'
                ? 'bg-dana-500 text-white shadow-md shadow-dana-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Tempel String / Teks
          </button>
        </div>

        {/* Quick Sample Button */}
        <button
          type="button"
          onClick={handleSampleClick}
          className="text-xs text-dana-400 hover:text-dana-300 font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dana-500/10 border border-dana-500/20 hover:bg-dana-500/20 transition"
        >
          <Sparkles className="w-3 h-3" />
          <span>Contoh QRIS DANA</span>
        </button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 text-red-200 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tab 1: Upload / Dropzone */}
      {activeTab === 'upload' && (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[200px] ${
              dragOver
                ? 'border-dana-400 bg-dana-500/10'
                : 'border-slate-700/80 hover:border-dana-500/60 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 rounded-2xl bg-dana-500/10 text-dana-400 flex items-center justify-center mb-3 ring-1 ring-dana-500/20 group-hover:scale-105 transition">
              <Upload className="w-6 h-6" />
            </div>

            <p className="font-semibold text-slate-200 text-sm mb-1">
              Drag & Drop gambar QRIS DANA di sini atau <span className="text-dana-400 underline">Pilih File</span>
            </p>
            <p className="text-xs text-slate-400 max-w-sm mb-3">
              Mendukung PNG, JPG, JPEG, WEBP. Bisa juga langsung tekan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 font-mono text-[10px]">Ctrl + V</kbd> untuk paste screenshot!
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCameraActive(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <Camera className="w-3.5 h-3.5 text-dana-400" />
                Scan via Kamera HP / Web
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manual Text */}
      {activeTab === 'text' && (
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              String Payload QRIS (Dimulai dengan 000201...)
            </label>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Contoh: 00020101021126570011ID.DANA.WWW011893600915..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-dana-500/50 focus:border-dana-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !textInput.trim()}
            className="w-full py-2.5 px-4 bg-dana-600 hover:bg-dana-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-dana-600/25 transition flex items-center justify-center gap-2"
          >
            {isLoading ? 'Memproses...' : 'Ekstraksi & Konversi Payload'}
          </button>
        </form>
      )}

      {/* Camera Modal */}
      {cameraActive && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full relative">
            <button
              onClick={() => setCameraActive(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-dana-400" />
              Scan QRIS Menggunakan Kamera
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Arahkan kamera ke barcode QRIS DANA sampai terbaca secara otomatis.
            </p>

            <div className="relative rounded-xl overflow-hidden bg-black aspect-square max-h-[340px] flex items-center justify-center border border-slate-800">
              <video ref={videoRef} className="w-full h-full object-cover" />
              {/* Scan target box indicator */}
              <div className="absolute inset-10 border-2 border-dana-400/80 rounded-2xl pointer-events-none animate-pulse" />
            </div>

            <button
              onClick={() => setCameraActive(false)}
              className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition"
            >
              Tutup Kamera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
