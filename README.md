# QRIS to Static & Dynamic Payload Converter

Aplikasi web untuk mengekstrak dan mengonversi payload QRIS (standar EMVCo) dari berbagai bank dan e-wallet menjadi payload statis murni (`QRIS_BASE_PAYLOAD`), serta dilengkapi simulator QRIS dinamis.

Proyek ini dibangun menggunakan Vite, React, dan Tailwind CSS, serta siap dideploy langsung ke Vercel (`*.vercel.app`).

## Fitur

- **Input Multi-Format**: Mendukung upload file gambar QRIS (PNG, JPG, WEBP), paste dari clipboard (`Ctrl + V`), scan kamera, atau input teks langsung.
- **Parser EMVCo**: Membaca Tag-Length-Value (TLV), informasi merchant/acquirer (BCA, Mandiri, BRI, BNI, DANA, GoPay, OVO, ShopeePay, dll), kota, kode pos, dan memvalidasi checksum CRC-16 CCITT-FALSE.
- **Ekstraksi Payload Statis**: Menormalisasi tag inisiasi menjadi statis (`010211`), membersihkan tag nominal bawaan, dan menghitung ulang CRC-16 agar sesuai untuk integrasi sistem pembayaran atau kasir.
- **Simulator Dinamis**: Menguji konversi ke QRIS dinamis dengan menyisipkan nominal (Tag 54) dan merender barcode QR secara langsung di canvas untuk di-scan dan diuji coba.
- **Client-Side**: Seluruh proses decode gambar dan perhitungan CRC berjalan 100% di browser tanpa mengirim data ke server eksternal.

## Deployment ke Vercel

Proyek sudah menyertakan konfigurasi `vercel.json` untuk framework Vite.

### Opsi 1: Lewat Dashboard Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Pilih **Add New Project** lalu import repository ini.
3. Vercel akan otomatis mendeteksi konfigurasi:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Klik **Deploy**.

### Opsi 2: Menggunakan Vercel CLI

Jalankan perintah berikut di root direktori proyek:

```bash
npx vercel
```

Untuk deploy langsung ke production:

```bash
npx vercel --prod
```

## Pengembangan Lokal

Pastikan Node.js (versi 18+) sudah terpasang di komputer.

```bash
# Install dependensi
npm install

# Jalankan server development
npm run dev

# Build untuk produksi
npm run build
```

## Penggunaan Payload

String payload statis yang dihasilkan dapat langsung digunakan pada variabel konfigurasi sistem pembayaran Anda (misalnya `.env`):

```env
QRIS_BASE_PAYLOAD=00020101021126...6304XXXX
```

Pada saat checkout/transaksi, sistem dapat menyisipkan nominal dinamis (Tag 54) dan menghasilkan barcode QRIS unik untuk setiap pelanggan.
