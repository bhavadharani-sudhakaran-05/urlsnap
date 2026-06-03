import crypto from 'crypto';

const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generate a random short code of given length.
 */
export const generateShortCode = (length = 7) => {
  const bytes = crypto.randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARSET[bytes[i] % CHARSET.length];
  }
  return code;
};

/**
 * Validate custom alias format (alphanumeric, hyphens, underscores).
 */
export const isValidAlias = (alias) => /^[a-zA-Z0-9_-]{3,32}$/.test(alias);
