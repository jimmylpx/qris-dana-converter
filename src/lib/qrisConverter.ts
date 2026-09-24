import { calculateCrc16, validateQrisCrc } from './crc16';
import { parseTlv } from './emvco';

export interface QrisMetadata {
  merchantName: string;
  merchantCity: string;
  postalCode: string;
  currency: string;
  acquirerName: string;
  acquirerInfo: string;
  nationalMerchantId: string;
  pointOfInitiation: 'static' | 'dynamic' | 'unknown';
  amount?: string;
  originalCrc: string;
  calculatedCrc: string;
  isCrcValid: boolean;
  rawPayload: string;
}

/**
 * Deteksi nama acquirer/penyedia dari tag merchant account information
 */
function detectAcquirer(raw: string, accountValue: string): string {
  const combined = (raw + ' ' + accountValue).toUpperCase();
  if (combined.includes('ID.DANA.WWW') || combined.includes('93600915')) return 'DANA';
  if (combined.includes('ID.GOPAY') || combined.includes('GO-JEK') || combined.includes('93600914')) return 'GoPay';
  if (combined.includes('ID.OVO') || combined.includes('93600912')) return 'OVO';
  if (combined.includes('ID.SHOPEE') || combined.includes('93600918')) return 'ShopeePay';
  if (combined.includes('ID.LINKAJA') || combined.includes('93600911')) return 'LinkAja';
  if (combined.includes('BCA') || combined.includes('ID.CO.BCA')) return 'BCA';
  if (combined.includes('MANDIRI')) return 'Mandiri';
  if (combined.includes('BRI')) return 'BRI';
  if (combined.includes('BNI')) return 'BNI';
  if (combined.includes('NOBU')) return 'Nobu Bank';
  if (combined.includes('CIMB')) return 'CIMB Niaga';
  return 'QRIS Nasional';
}

/**
 * Ekstraksi informasi metadata dari string QRIS EMVCo
 */
export function extractQrisMetadata(rawInput: string): QrisMetadata {
  const raw = rawInput.trim();
  const tags = parseTlv(raw);

  let merchantName = '-';
  let merchantCity = '-';
  let postalCode = '-';
  let currency = 'IDR (360)';
  let acquirerName = 'QRIS Nasional';
  let acquirerInfo = '-';
  let nationalMerchantId = '-';
  let pointOfInitiation: 'static' | 'dynamic' | 'unknown' = 'unknown';
  let amount: string | undefined = undefined;
  let originalCrc = '';

  for (const tag of tags) {
    if (tag.id === '01') {
      if (tag.value === '11') pointOfInitiation = 'static';
      else if (tag.value === '12') pointOfInitiation = 'dynamic';
    } else if (parseInt(tag.id, 10) >= 26 && parseInt(tag.id, 10) <= 45) {
      acquirerInfo = tag.value;
      if (tag.subTags) {
        const idSub = tag.subTags.find(s => s.id === '01' || s.id === '02');
        if (idSub) acquirerInfo = idSub.value;
      }
      acquirerName = detectAcquirer(raw, tag.value);
    } else if (tag.id === '51') {
      nationalMerchantId = tag.value;
      if (tag.subTags) {
        const idSub = tag.subTags.find(s => s.id === '02');
        if (idSub) nationalMerchantId = idSub.value;
      }
    } else if (tag.id === '53') {
      currency = tag.value === '360' ? 'IDR (360)' : tag.value;
    } else if (tag.id === '54') {
      amount = tag.value;
    } else if (tag.id === '59') {
      merchantName = tag.value;
    } else if (tag.id === '60') {
      merchantCity = tag.value;
    } else if (tag.id === '61') {
      postalCode = tag.value;
    } else if (tag.id === '63') {
      originalCrc = tag.value.toUpperCase();
    }
  }

  const isCrcValid = validateQrisCrc(raw);
  let calculatedCrc = '';
  const tag63Pos = raw.lastIndexOf('6304');
  if (tag63Pos !== -1) {
    calculatedCrc = calculateCrc16(raw.substring(0, tag63Pos + 4));
  }

  return {
    merchantName,
    merchantCity,
    postalCode,
    currency,
    acquirerName,
    acquirerInfo,
    nationalMerchantId,
    pointOfInitiation,
    amount,
    originalCrc,
    calculatedCrc,
    isCrcValid,
    rawPayload: raw,
  };
}

/**
 * Konversi QRIS menjadi QRIS_BASE_PAYLOAD Statis Murni (standar EMVCo).
 * 1. Memastikan Tag 01 = '010211' (Statis)
 * 2. Menghapus Tag 54 (Transaction Amount) agar dapat disisipkan dinamis
 * 3. Menghitung ulang Checksum CRC-16 CCITT-FALSE
 */
export function convertToStaticBasePayload(rawQris: string): string {
  let qris = rawQris.trim();
  if (!qris) return '';

  // 1. Buang CRC lama di akhir string jika ada (format: 6304XXXX)
  if (qris.length >= 8 && qris.substring(qris.length - 8, qris.length - 4) === '6304') {
    qris = qris.substring(0, qris.length - 8);
  }

  // 2. Ubah Point of Initiation Method ke Statis (010211)
  if (qris.includes('010212')) {
    qris = qris.replace('010212', '010211');
  } else if (!qris.includes('010211')) {
    // Sisipkan setelah Tag 00 jika belum ada
    if (qris.startsWith('000201')) {
      qris = '000201010211' + qris.substring(6);
    }
  }

  // 3. Hapus Tag 54 (Nominal) jika ada pada payload statis
  const tag54Regex = /54(\d{2})([0-9.]+)/;
  const match54 = qris.match(tag54Regex);
  if (match54) {
    const len = parseInt(match54[1], 10);
    const fullTag54 = '54' + match54[1] + match54[2].substring(0, len);
    qris = qris.replace(fullTag54, '');
  }

  // 4. Tambahkan header Tag 63 dan hitung CRC16 baru
  qris += '6304';
  const crc = calculateCrc16(qris);
  return qris + crc;
}

/**
 * Generator QRIS Dinamis dari Static Payload (standar EMVCo).
 */
export function generateDynamicQris(baseQris: string, amount: number | string): string {
  let qris = baseQris.trim();
  if (!qris) return '';

  // 1. Hapus CRC lama di akhir jika ada (6304XXXX)
  if (qris.length >= 8 && qris.substring(qris.length - 8, qris.length - 4) === '6304') {
    qris = qris.substring(0, qris.length - 8);
  }

  // 2. Ubah Point of Initiation Method dari Statis (010211) ke Dinamis (010212)
  qris = qris.replace('010211', '010212');

  // 3. Format nominal angka (Tag 54)
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount) || numAmount <= 0) {
    qris += '6304';
    return qris + calculateCrc16(qris);
  }

  const amountStr = Math.floor(numAmount).toString();
  const lenStr = amountStr.length.toString().padStart(2, '0');
  const tag54 = `54${lenStr}${amountStr}`;

  // 4. Sisipkan atau ganti Tag 54 setelah Tag 53 (5303360 untuk IDR)
  const pos = qris.indexOf('5303360');
  if (pos !== -1) {
    const after53 = qris.substring(pos + 7);
    if (after53.startsWith('54')) {
      const oldLen = parseInt(after53.substring(2, 4), 10);
      const after54 = after53.substring(4 + oldLen);
      qris = qris.substring(0, pos + 7) + tag54 + after54;
    } else {
      qris = qris.substring(0, pos + 7) + tag54 + after53;
    }
  } else {
    qris += tag54;
  }

  // 5. Tambahkan header Tag 63 dan hitung CRC16 baru
  qris += '6304';
  const crc = calculateCrc16(qris);
  return qris + crc;
}
