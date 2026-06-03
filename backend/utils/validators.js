import validator from 'validator';

/**
 * Normalize and validate a URL string.
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { valid: false, message: 'URL is required' };
  }

  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  if (!validator.isURL(normalized, { require_protocol: true, require_tld: false })) {
    return { valid: false, message: 'Invalid URL format' };
  }

  return { valid: true, url: normalized };
};
