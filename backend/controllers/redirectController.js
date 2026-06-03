import ShortUrl from '../models/ShortUrl.js';
import { recordVisit } from '../services/analyticsService.js';

export const redirectToOriginal = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const shortUrl = await ShortUrl.findOne({ shortCode });

    if (!shortUrl) {
      return res.status(404).send(renderHtml('Link Not Found', 'This short link does not exist.'));
    }

    if (shortUrl.expiryDate && new Date() > shortUrl.expiryDate) {
      return res
        .status(410)
        .send(renderHtml('Link Expired', 'This short link has expired and is no longer available.'));
    }

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';
    const userAgent = req.headers['user-agent'] || '';

    await recordVisit(shortUrl, { ip, userAgent });

    return res.redirect(302, shortUrl.originalUrl);
  } catch (err) {
    next(err);
  }
};

const renderHtml = (title, message) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:linear-gradient(135deg,#1e3a8a,#7c3aed);color:#fff}
.card{background:rgba(255,255,255,.1);backdrop-filter:blur(10px);padding:2rem 3rem;border-radius:1rem;text-align:center}</style>
</head><body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`;
