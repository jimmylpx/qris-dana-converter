# qris-dana-converter

Aplikasi web untuk mengekstrak dan mengonversi payload QRIS DANA Bisnis (standar EMVCo) menjadi payload statis murni (`QRIS_BASE_PAYLOAD`), serta dilengkapi simulator QRIS dinamis.

Proyek ini dibangun menggunakan Vite, React, dan Tailwind CSS, serta siap dideploy langsung ke Vercel (`*.vercel.app`).

## Fitur

- **Input Multi-Format**: Mendukung upload file gambar (PNG, JPG, WEBP), paste dari clipboard (`Ctrl + V`), scan kamera, atau input teks langsung.
- **Parser EMVCo**: Membaca Tag-Length-Value (TLV), informasi merchant DANA Bisnis, kota, kode pos, dan memvalidasi checksum CRC-16 CCITT-FALSE.
- **Ekstraksi Payload Statis**: Menormalisasi tag inisiasi menjadi statis (`010211`), membersihkan tag nominal, dan menghitung ulang CRC-16 agar sesuai untuk konfigurasi bot atau sistem kasir.
- **Simulator Dinamis**: Menguji konversi ke QRIS dinamis dengan menyisipkan nominal (Tag 54) dan merender barcode QR secara langsung di canvas.
- **Client-Side**: Seluruh proses decode gambar dan perhitungan CRC berjalan di browser tanpa mengirim data ke server eksternal.

## Deployment ke Vercel

Proyek sudah menyertakan konfigurasi `vercel.json` untuk framework Vite.

### Opsi 1: Lewat Dashboard Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Pilih **Add New Project** lalu import repository ini (`qris-dana-converter`).
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

## Integrasi dengan bottele

String payload statis yang dihasilkan dapat langsung digunakan pada file `.env` sistem bot:

```env
QRIS_BASE_PAYLOAD=00020101021126570011ID.DANA.WWW...6304XXXX
```

Pada saat transaksi berlangsung, modul generator akan otomatis mengubah payload tersebut menjadi QRIS dinamis sesuai nominal tagihan pembeli.
