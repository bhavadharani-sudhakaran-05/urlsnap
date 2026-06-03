import { getAnalytics, getGlobalAnalytics as getGlobalAnalyticsService } from '../services/analyticsService.js';

export const getGlobalAnalytics = async (req, res, next) => {
  try {
    const data = await getGlobalAnalyticsService(req.user._id, req.query.period);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getUrlAnalytics = async (req, res, next) => {
  try {
    const data = await getAnalytics(req.params.id, req.user._id);
    res.json({ success: true, data });
  } catch (err) {
    if (err.message === 'URL not found') {
      return res.status(404).json({ success: false, message: err.message });
    }
    next(err);
  }
};
