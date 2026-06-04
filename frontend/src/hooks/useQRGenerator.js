/* src/hooks/useQRGenerator.js
   Hook that handles QR generation, options, and actions.
   Uses qr-code-styling for rich customization.
*/
import QRCodeStyling from 'qr-code-styling';
import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_OPTIONS = {
  content: '',
  type: 'url',
  bgColor: '#FFFFFF',
  fgColor: '#000000',
  margin: 2,
  size: 256,
  format: 'png', // png | svg | jpeg | webp
  style: 'square', // square | dots | rounded | classy | extra-rounded
  logoFile: null,
  logoDataUrl: null,
  errorCorrectionLevel: 'M',
};

export function useQRGenerator() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const qrRef = useRef(null);
  const debounceRef = useRef(null);

  // Build the actual string to encode based on type and options
  const buildQRContent = useCallback((opts) => {
    switch (opts.type) {
      case 'url':
        return opts.content || 'https://snipra.io';
      case 'twitter': {
        const handle = opts.content?.startsWith('@') ? opts.content.slice(1) : opts.content;
        return `https://twitter.com/${handle}`;
      }
      case 'facebook':
        return opts.content || '';
      case 'instagram': {
        const handle = opts.content?.startsWith('@') ? opts.content.slice(1) : opts.content;
        return `https://instagram.com/${handle}`;
      }
      case 'linkedin':
        return opts.content || '';
      case 'whatsapp': {
        const phone = opts.content?.replace(/[^0-9+]/g, '');
        const msg = encodeURIComponent(opts.whatsappMessage || '');
        return `https://wa.me/${phone}${msg ? `?text=${msg}` : ''}`;
      }
      case 'email': {
        const subject = encodeURIComponent(opts.emailSubject || '');
        const body = encodeURIComponent(opts.emailBody || '');
        let mailto = `mailto:${opts.content}`;
        if (subject) mailto += `?subject=${subject}`;
        if (body) mailto += `${subject ? '&' : '?'}body=${body}`;
        return mailto;
      }
      case 'phone':
        return `tel:${opts.content?.replace(/[^0-9+]/g, '')}`;
      case 'sms': {
        const smsBody = encodeURIComponent(opts.smsMessage || '');
        return `sms:${opts.content?.replace(/[^0-9+]/g, '')}${smsBody ? `?body=${smsBody}` : ''}`;
      }
      case 'wifi': {
        const sec = opts.wifiSecurity || 'nopass';
        const hidden = opts.wifiHidden ? 'true' : 'false';
        return `WIFI:T:${sec};S:${opts.wifiSSID};P:${opts.wifiPassword};H:${hidden};;`;
      }
      case 'vcard': {
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${opts.vcardFirst} ${opts.vcardLast}\nEMAIL:${opts.vcardEmail}\nTEL:${opts.vcardPhone}\nORG:${opts.vcardCompany}\nTITLE:${opts.vcardTitle}\nURL:${opts.vcardWebsite}\nADR:;;${opts.vcardAddress};;;;\nEND:VCARD`;
      }
      case 'text':
        return opts.content || '';
      default:
        return opts.content || '';
    }
  }, []);

  const generateQR = useCallback(async (opts = options) => {
    const content = buildQRContent(opts);
    if (!content) {
      setQrDataUrl(null);
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const qrCode = new QRCodeStyling({
        width: opts.size,
        height: opts.size,
        data: content,
        margin: opts.margin * 4,
        qrOptions: { errorCorrectionLevel: opts.errorCorrectionLevel },
        image: opts.logoDataUrl || undefined,
        imageOptions: { crossOrigin: 'anonymous', margin: 4, imageSize: 0.3 },
        backgroundOptions: { color: opts.bgColor },
        dotsOptions: { color: opts.fgColor, type: opts.style },
        cornersSquareOptions: { color: opts.fgColor, type: 'square' },
        cornersDotOptions: { color: opts.fgColor, type: opts.style === 'dots' ? 'dot' : 'square' },
      });
      // Store instance for later download/share
      qrRef.current = qrCode;
      // Get Blob and convert to base64 data URL
      const blob = await qrCode.getRawData(opts.format === 'svg' ? 'svg' : 'png');
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrDataUrl(reader.result);
        setIsGenerating(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('QR generation error:', err);
      setError('Failed to generate QR code. Please check your input.');
      setIsGenerating(false);
    }
  }, [options, buildQRContent]);

  // Debounced regeneration when options change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => generateQR(options), 350);
    return () => clearTimeout(debounceRef.current);
  }, [options, generateQR]);

  const updateOption = useCallback((key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateMultiple = useCallback((updates) => {
    setOptions(prev => ({ ...prev, ...updates }));
  }, []);

  const applyTemplate = useCallback((template, index) => {
    setSelectedTemplate(index);
    updateMultiple({ bgColor: template.bg, fgColor: template.fg });
  }, [updateMultiple]);

  const downloadQR = useCallback(async (format = options.format, size = options.size) => {
    if (!qrRef.current) return;
    const snippet = buildQRContent(options).slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `snipra-qr-${snippet}-${size}px`;
    await qrRef.current.download({ name: filename, extension: format });
  }, [options, buildQRContent]);

  const copyToClipboard = useCallback(async () => {
    if (!qrDataUrl) return false;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return true;
    } catch {
      return false;
    }
  }, [qrDataUrl]);

  return {
    options,
    qrDataUrl,
    isGenerating,
    error,
    selectedTemplate,
    updateOption,
    updateMultiple,
    applyTemplate,
    downloadQR,
    copyToClipboard,
    buildQRContent,
    generateQR,
  };
}
