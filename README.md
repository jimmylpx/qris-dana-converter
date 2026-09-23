# DANA QRIS to Static & Dynamic Payload Converter

Web App modern & responsif untuk mengekstrak barcode QRIS DANA Bisnis menjadi **Payload Statis EMVCo (`QRIS_BASE_PAYLOAD`)** dan dilengkapi **Simulator QRIS Dinamis**. Siap dideploy ke **Vercel** (`*.vercel.app`) secara gratis dengan satu klik!

---

## 🌟 Fitur Utama

- ⚡ **Multi-Input QRIS**:
  - Drag & Drop gambar barcode QRIS (PNG, JPG, JPEG, WEBP).
  - Paste screenshot langsung dari clipboard (<kbd>Ctrl + V</kbd>).
  - Scan langsung melalui kamera HP / Webcam.
  - Input teks / string QRIS manual.
- 🏪 **Deteksi Otomatis DANA Bisnis**:
  - Membaca Nama Toko / Merchant (Tag 59).
  - Kota & Kode Pos (Tag 60 & 61).
  - Merchant PAN / NNS DANA (Tag 26 & 51).
  - Validasi Checksum CRC-16 (Tag 63) standar CCITT-FALSE.
- 📋 **Konversi ke Payload Statis Bersih (`QRIS_BASE_PAYLOAD`)**:
  - Memastikan Tag 01 diset ke Statis (`010211`).
  - Menghilangkan nominal Tag 54 lama agar bersih.
  - Tombol **1-Click Copy** untuk variabel `.env` bot Telegram.
- 📱 **Simulator QRIS Dinamis (Real-time Preview)**:
  - Masukkan nominal Rupiah (misal: Rp 25.000).
  - Otomatis mengubah Tag 01 menjadi Dinamis (`010212`) & menyisipkan Tag 54.
  - Menampilkan gambar QR Code Dinamis baru yang bisa langsung di-scan menggunakan aplikasi DANA untuk pengujian transaksi.
  - Tombol unduh QR Code (PNG) & salin string payload dinamis.
- 🔒 **100% Client-Side Privacy**:
  - Semua decoding QR dan komputasi CRC-16 berjalan di browser pengguna. Tidak ada data QRIS atau gambar yang dikirim ke server pihak ketiga.

---

## 🚀 Panduan Deploy ke Vercel (`.vercel.app`)

Aplikasi ini sudah dilengkapi konfigurasi `vercel.json` dan siap dipublikasikan ke domain `*.vercel.app`.

### Metode 1: Menggunakan GitHub + Vercel Dashboard (Paling Direkomendasikan)

1. Buat repository baru di [GitHub](https://github.com/new) (misal: `dana-qris-converter`).
2. Masuk ke folder proyek ini di terminal:
   ```bash
   cd qris-dana-converter
   git init
   git add .
   git commit -m "Initial commit DANA QRIS Converter"
   git branch -M main
   git remote add origin https://github.com/USERNAME/dana-qris-converter.git
   git push -u origin main
   ```
3. Buka [vercel.com](https://vercel.com) dan login (bisa menggunakan akun GitHub).
4. Klik tombol **"Add New..."** lalu pilih **"Project"**.
5. Pilih repository `dana-qris-converter` yang baru Anda buat, lalu klik **"Import"**.
6. Vercel akan otomatis mengenali framework **Vite**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Klik **"Deploy"**. Dalam ~30 detik, web app Anda akan aktif di URL seperti:
   ```
   https://dana-qris-converter.vercel.app
   ```

---

### Metode 2: Menggunakan Terminal / Vercel CLI

Jika Anda ingin langsung mendeploy tanpa push ke GitHub terlebih dahulu:

1. Buka terminal di dalam folder `qris-dana-converter`:
   ```bash
   cd qris-dana-converter
   ```
2. Jalankan perintah Vercel CLI:
   ```bash
   npx vercel
   ```
3. Ikuti instruksi di layar:
   - Login ke akun Vercel Anda.
   - Set up and deploy? Ketik `y`.
   - Link to existing project? Ketik `n`.
   - Project name? Tekan Enter untuk default atau ketik nama yang diinginkan.
   - In which directory is your code located? Tekan Enter (`./`).
   - Want to modify settings? Ketik `n`.
4. Untuk deploy langsung ke production domain utama:
   ```bash
   npx vercel --prod
   ```

---

## 💻 Menjalankan Secara Lokal (Development)

Jika ingin mencoba atau mengedit secara lokal di komputer:

```bash
# Masuk ke folder proyek
cd qris-dana-converter

# Install dependencies jika belum
npm install

# Jalankan server dev lokal
npm run dev
```

Buka URL yang ditampilkan (biasanya `http://localhost:5173`) di browser Anda.

---

## 🤖 Cara Integrasi ke Bot Telegram (`bottele`)

1. Buka web app converter Anda di browser.
2. Upload gambar QRIS DANA Bisnis Anda.
3. Klik tombol **"Salin Format .env"**.
4. Buka file `.env` pada folder bot Telegram Anda (`g:\bottele\.env`):
   ```env
   QRIS_BASE_PAYLOAD=00020101021126570011ID.DANA.WWW...6304XXXX
   ```
5. Simpan file `.env` dan restart bot Telegram Anda. Setiap kali pembeli melakukan checkout, bot akan otomatis membuat QRIS Dinamis dengan nominal unik!
