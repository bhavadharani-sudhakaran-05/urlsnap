import geoip from 'geoip-lite';

/**
 * Resolve country and city from IP address.
 */
export const getGeoFromIp = (ip) => {
  const cleanIp = (ip || '').replace('::ffff:', '');
  const lookup = geoip.lookup(cleanIp);

  if (!lookup) {
    return { country: 'Unknown', city: 'Unknown' };
  }

  return {
    country: lookup.country || 'Unknown',
    city: lookup.city || lookup.region || 'Unknown',
  };
};
