/**
 * Menghitung checksum CRC-16 CCITT-FALSE (Polynomial 0x1021, Initial 0xFFFF).
 * Algoritma ini sesuai standar EMVCo QRIS dan sama persis dengan implementasi backend.
 */
export function calculateCrc16(text: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < text.length; i++) {
    crc ^= text.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Validasi apakah string QRIS memiliki CRC16 yang sah.
 */
export function validateQrisCrc(rawQris: string): boolean {
  const trimmed = rawQris.trim();
  if (trimmed.length < 8) return false;
  const tag63Pos = trimmed.lastIndexOf("6304");
  if (tag63Pos === -1 || tag63Pos + 8 !== trimmed.length) return false;

  const contentWithoutCrc = trimmed.substring(0, tag63Pos + 4);
  const expectedCrc = trimmed.substring(tag63Pos + 4).toUpperCase();
  const calculated = calculateCrc16(contentWithoutCrc);
  return expectedCrc === calculated;
}
