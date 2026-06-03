import QRCode from 'qrcode';

/**
 * Generate QR code as base64 data URL for a short link.
 */
export const generateQrCode = async (shortUrl) => {
  return QRCode.toDataURL(shortUrl, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 300,
    color: { dark: '#1e3a8a', light: '#ffffff' },
  });
};
