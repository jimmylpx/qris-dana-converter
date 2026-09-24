import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { Upload, Camera, FileText, Image as ImageIcon, AlertCircle, X } from 'lucide-react';

interface QrUploaderProps {
  onPayloadDetected: (payload: string) => void;
  isLoading: boolean;
}

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
            if (trimmed.startsWith('000201')) {
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

  return (
    <div className="card-brutal p-5 sm:p-7">
      {/* Tabs */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-black dark:border-white pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase transition-all ${
              activeTab === 'upload'
                ? 'btn-brutal bg-brand-500 text-white'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Upload / Scan Gambar
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase transition-all ${
              activeTab === 'text'
                ? 'btn-brutal bg-brand-500 text-white'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Tempel String
          </button>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-400 text-black border-2 border-black shadow-brutal-sm text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-black hover:text-white transition">
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
            className={`border-2 border-dashed border-black dark:border-white p-8 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] shadow-brutal-sm dark:shadow-brutal-sm-dark ${
              dragOver
                ? 'bg-brand-100 dark:bg-brand-950/60'
                : 'bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
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

            <div className="w-14 h-14 bg-brand-500 text-white border-2 border-black dark:border-white shadow-brutal-sm dark:shadow-brutal-sm-dark flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 stroke-[2.5]" />
            </div>

            <p className="font-black text-black dark:text-white text-sm sm:text-base mb-1 uppercase tracking-tight">
              Drag & Drop gambar QRIS di sini atau <span className="underline decoration-2 text-brand-600 dark:text-brand-400">Pilih File</span>
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mb-4 font-medium">
              Mendukung PNG, JPG, JPEG, WEBP. Bisa langsung tekan <kbd className="px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black font-mono text-[10px] font-bold">Ctrl + V</kbd> untuk paste screenshot!
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCameraActive(true);
              }}
              className="btn-brutal bg-white dark:bg-black text-black dark:text-white px-4 py-2 text-xs flex items-center gap-1.5 uppercase"
            >
              <Camera className="w-3.5 h-3.5 text-brand-500" />
              Scan via Kamera
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Manual Text */}
      {activeTab === 'text' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black dark:text-white mb-2">
              String Payload QRIS (Dimulai dengan 000201...)
            </label>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Tempel string payload QRIS Anda di sini..."
              className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-white p-3 text-xs font-mono text-black dark:text-white shadow-brutal-sm dark:shadow-brutal-sm-dark focus:outline-none focus:ring-0"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !textInput.trim()}
            className="btn-brutal w-full py-3 bg-brand-500 hover:bg-brand-400 text-white text-xs uppercase tracking-wider"
          >
            {isLoading ? 'Memproses...' : 'Ekstraksi & Konversi Payload'}
          </button>
        </form>
      )}

      {/* Camera Modal */}
      {cameraActive && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="card-brutal max-w-md w-full p-5 relative">
            <button
              onClick={() => setCameraActive(false)}
              className="absolute top-4 right-4 btn-brutal bg-neutral-200 dark:bg-neutral-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-sm text-black dark:text-white mb-2 uppercase flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-500" />
              Scan QRIS via Kamera
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 font-medium">
              Arahkan kamera ke barcode QRIS hingga terbaca otomatis.
            </p>

            <div className="relative border-2 border-black dark:border-white bg-black aspect-square max-h-[320px] flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <div className="absolute inset-8 border-2 border-white pointer-events-none animate-pulse" />
            </div>

            <button
              onClick={() => setCameraActive(false)}
              className="btn-brutal w-full mt-4 py-2.5 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white text-xs uppercase"
            >
              Tutup Kamera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
