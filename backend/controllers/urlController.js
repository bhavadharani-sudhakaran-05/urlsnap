import { parse } from 'csv-parse/sync';
import ShortUrl from '../models/ShortUrl.js';
import { createShortUrl, bulkCreateShortUrls, buildShortUrl } from '../services/urlService.js';
import { generateQrCode } from '../services/qrService.js';
import { validateUrl } from '../utils/validators.js';
import { isValidAlias } from '../utils/generateShortCode.js';

const formatUrl = (doc) => ({
  id: doc._id,
  _id: doc._id,
  originalUrl: doc.originalUrl,
  shortCode: doc.shortCode,
  shortUrl: buildShortUrl(doc.shortCode),
  customAlias: doc.customAlias,
  qrCode: doc.qrCode,
  clickCount: doc.clickCount,
  expiryDate: doc.expiryDate,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const createUrl = async (req, res, next) => {
  try {
    const created = await createShortUrl(req.user._id, req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllUrls = async (req, res, next) => {
  try {
    const urls = await ShortUrl.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: urls.length,
      data: urls.map(formatUrl),
    });
  } catch (err) {
    next(err);
  }
};

export const getUrlById = async (req, res, next) => {
  try {
    const url = await ShortUrl.findOne({ _id: req.params.id, userId: req.user._id });
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    res.json({ success: true, data: formatUrl(url) });
  } catch (err) {
    next(err);
  }
};

export const updateUrl = async (req, res, next) => {
  try {
    const url = await ShortUrl.findOne({ _id: req.params.id, userId: req.user._id });
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    const { originalUrl, customAlias, expiryDate } = req.body;

    if (originalUrl !== undefined) {
      const validation = validateUrl(originalUrl);
      if (!validation.valid) {
        return res.status(400).json({ success: false, message: validation.message });
      }
      url.originalUrl = validation.url;
    }

    if (customAlias !== undefined && customAlias !== url.shortCode) {
      if (!isValidAlias(customAlias)) {
        return res.status(400).json({
          success: false,
          message: 'Alias must be 3-32 characters (letters, numbers, - and _)',
        });
      }
      const taken = await ShortUrl.findOne({ shortCode: customAlias, _id: { $ne: url._id } });
      if (taken) {
        return res.status(400).json({ success: false, message: 'Custom alias already taken' });
      }
      url.shortCode = customAlias;
      url.customAlias = customAlias;
      url.qrCode = await generateQrCode(buildShortUrl(customAlias));
    }

    if (expiryDate !== undefined) {
      url.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }

    await url.save();
    res.json({ success: true, data: formatUrl(url) });
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    const url = await ShortUrl.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    res.json({ success: true, message: 'URL deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const bulkUploadCsv = async (req, res, next) => {
  try {
    const { csv } = req.body;
    if (!csv || typeof csv !== 'string') {
      return res.status(400).json({ success: false, message: 'CSV content is required' });
    }

    const rows = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    if (!rows.length) {
      return res.status(400).json({ success: false, message: 'No valid rows in CSV' });
    }

    const results = await bulkCreateShortUrls(req.user._id, rows);
    res.status(201).json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};
