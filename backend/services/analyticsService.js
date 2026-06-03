import Visit from '../models/Visit.js';
import ShortUrl from '../models/ShortUrl.js';

/**
 * Record a visit and increment click count.
 */
export const recordVisit = async (shortUrl, { ip, userAgent }) => {
  const { parseUserAgent } = await import('../utils/parseUserAgent.js');
  const { getGeoFromIp } = await import('../utils/getGeoFromIp.js');

  const { browser, device } = parseUserAgent(userAgent);
  const { country, city } = getGeoFromIp(ip);

  await Visit.create({
    shortUrlId: shortUrl._id,
    ipAddress: ip,
    browser,
    device,
    country,
    city,
  });

  shortUrl.clickCount += 1;
  await shortUrl.save();
};

/**
 * Aggregate analytics for a short URL owned by user.
 */
export const getAnalytics = async (shortUrlId, userId) => {
  const shortUrl = await ShortUrl.findOne({ _id: shortUrlId, userId });
  if (!shortUrl) {
    throw new Error('URL not found');
  }

  const visits = await Visit.find({ shortUrlId }).sort({ timestamp: -1 }).lean();
  const lastVisit = visits[0]?.timestamp || null;

  const dailyMap = {};
  const browserMap = {};
  const deviceMap = {};
  const countryMap = {};
  const cityMap = {};

  for (const v of visits) {
    const day = new Date(v.timestamp).toISOString().split('T')[0];
    dailyMap[day] = (dailyMap[day] || 0) + 1;
    browserMap[v.browser] = (browserMap[v.browser] || 0) + 1;
    deviceMap[v.device] = (deviceMap[v.device] || 0) + 1;
    countryMap[v.country] = (countryMap[v.country] || 0) + 1;
    cityMap[v.city] = (cityMap[v.city] || 0) + 1;
  }

  const toSortedArray = (map) =>
    Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

  const dailyClicks = Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const topBrowser = toSortedArray(browserMap)[0] || { name: 'N/A', count: 0 };
  const topDevice = toSortedArray(deviceMap)[0] || { name: 'N/A', count: 0 };

  return {
    shortUrl: {
      id: shortUrl._id,
      originalUrl: shortUrl.originalUrl,
      shortCode: shortUrl.shortCode,
      clickCount: shortUrl.clickCount,
      createdAt: shortUrl.createdAt,
      expiryDate: shortUrl.expiryDate,
    },
    totalClicks: shortUrl.clickCount,
    lastVisit,
    dailyClicks,
    browserAnalytics: toSortedArray(browserMap),
    deviceAnalytics: toSortedArray(deviceMap),
    countryAnalytics: toSortedArray(countryMap),
    cityAnalytics: toSortedArray(cityMap),
    topBrowser,
    topDevice,
    recentVisits: visits.slice(0, 50).map((v) => ({
      timestamp: v.timestamp,
      ipAddress: v.ipAddress,
      device: v.device,
      browser: v.browser,
      country: v.country,
      city: v.city,
    })),
  };
};

/**
 * Public stats (limited info, no auth).
 */
export const getPublicStats = async (shortCode) => {
  const shortUrl = await ShortUrl.findOne({ shortCode }).select(
    'shortCode clickCount createdAt expiryDate originalUrl'
  );
  if (!shortUrl) throw new Error('URL not found');

  if (shortUrl.expiryDate && new Date() > shortUrl.expiryDate) {
    throw new Error('This link has expired');
  }

  const visitCount = await Visit.countDocuments({ shortUrlId: shortUrl._id });
  const lastVisit = await Visit.findOne({ shortUrlId: shortUrl._id })
    .sort({ timestamp: -1 })
    .select('timestamp');

  return {
    shortCode: shortUrl.shortCode,
    clickCount: shortUrl.clickCount,
    totalVisits: visitCount,
    createdAt: shortUrl.createdAt,
    lastVisit: lastVisit?.timestamp || null,
    isExpired: false,
  };
};

export const getGlobalAnalytics = async (userId, period = 30) => {
  const urls = await ShortUrl.find({ userId });
  const urlIds = urls.map(u => u._id);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  const visits = await Visit.find({ 
    shortUrlId: { $in: urlIds },
    timestamp: { $gte: startDate }
  }).lean();

  const dailyMap = {};
  const deviceMap = {};
  
  for(let i = parseInt(period) - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.toISOString().split('T')[0];
    dailyMap[day] = 0;
  }

  for (const v of visits) {
    const day = new Date(v.timestamp).toISOString().split('T')[0];
    if (dailyMap[day] !== undefined) {
      dailyMap[day]++;
    }
    deviceMap[v.device] = (deviceMap[v.device] || 0) + 1;
  }

  const dailyTrend = Object.entries(dailyMap).map(([date, clicks]) => ({ date, clicks }));
  
  const devices = Object.entries(deviceMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalClicks = urls.reduce((sum, u) => sum + (u.clickCount || 0), 0);
  const avgClicksPerLink = urls.length > 0 ? Math.round(totalClicks / urls.length) : 0;

  const today = new Date();
  today.setHours(0,0,0,0);
  const linksCreatedToday = urls.filter(u => new Date(u.createdAt) >= today).length;

  let mostClickedLink = '—';
  let maxClicks = -1;
  let expiringSoon = 0;

  urls.forEach(u => {
    if (u.clickCount > maxClicks) {
      maxClicks = u.clickCount;
      mostClickedLink = u.shortCode;
    }
    if (u.expiryDate) {
      const diff = new Date(u.expiryDate).getTime() - new Date().getTime();
      const days = diff / (1000 * 3600 * 24);
      if (days > 0 && days <= 7) expiringSoon++;
    }
  });

  return {
    dailyTrend,
    devices,
    totalClicks,
    avgClicksPerLink,
    linksCreatedToday,
    mostClickedLink: maxClicks > 0 ? mostClickedLink : '—',
    expiringSoon
  };
};
