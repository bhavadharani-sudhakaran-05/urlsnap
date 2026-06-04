import ShortUrl from '../models/ShortUrl.js';
import { generateShortCode, isValidAlias } from '../utils/generateShortCode.js';
import { validateUrl } from '../utils/validators.js';
import { generateQrCode } from './qrService.js';

const RESERVED_CODES = new Set(['api', 'auth', 'login', 'register', 'dashboard', 'public']);

const getBaseUrl = () => {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  if (process.env.NODE_ENV === 'production') return 'https://urlsnap-pydi.onrender.com';
  return `http://localhost:${process.env.PORT || 5000}`;
};

export const buildShortUrl = (shortCode) => `${getBaseUrl()}/${shortCode}`;

/**
 * Create a unique short code, retrying on collision.
 */
const createUniqueCode = async (preferredCode = null) => {
  if (preferredCode) {
    if (RESERVED_CODES.has(preferredCode.toLowerCase())) {
      throw new Error('This alias is reserved');
    }
    if (!isValidAlias(preferredCode)) {
      throw new Error('Alias must be 3-32 characters (letters, numbers, - and _)');
    }
    const exists = await ShortUrl.findOne({ shortCode: preferredCode });
    if (exists) throw new Error('Custom alias already taken');
    return preferredCode;
  }

  let attempts = 0;
  while (attempts < 10) {
    const code = generateShortCode();
    const exists = await ShortUrl.findOne({ shortCode: code });
    if (!exists) return code;
    attempts++;
  }
  throw new Error('Could not generate unique short code');
};

/**
 * Create a new shortened URL for a user.
 */
export const createShortUrl = async (userId, { originalUrl, customAlias, expiryDate }) => {
  const validation = validateUrl(originalUrl);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const shortCode = await createUniqueCode(customAlias || null);
  const shortUrlString = buildShortUrl(shortCode);
  const qrCode = await generateQrCode(shortUrlString);

  const doc = await ShortUrl.create({
    userId,
    originalUrl: validation.url,
    shortCode,
    customAlias: customAlias || null,
    qrCode,
    expiryDate: expiryDate ? new Date(expiryDate) : null,
  });

  return {
    ...doc.toObject(),
    shortUrl: shortUrlString,
  };
};

/**
 * Bulk create URLs from parsed CSV rows.
 */
export const bulkCreateShortUrls = async (userId, rows) => {
  const results = { created: [], failed: [] };

  for (const row of rows) {
    try {
      const created = await createShortUrl(userId, {
        originalUrl: row.originalUrl || row.url,
        customAlias: row.customAlias || row.alias || null,
        expiryDate: row.expiryDate || row.expiry || null,
      });
      results.created.push(created);
    } catch (err) {
      results.failed.push({
        originalUrl: row.originalUrl || row.url,
        error: err.message,
      });
    }
  }

  return results;
};
