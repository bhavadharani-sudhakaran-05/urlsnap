import { getPublicStats } from '../services/analyticsService.js';

export const getPublicStatistics = async (req, res, next) => {
  try {
    const data = await getPublicStats(req.params.shortCode);
    res.json({ success: true, data });
  } catch (err) {
    if (err.message === 'URL not found' || err.message.includes('expired')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};
