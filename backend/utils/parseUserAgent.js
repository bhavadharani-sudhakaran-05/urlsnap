import { UAParser } from 'ua-parser-js';

/**
 * Extract device and browser from User-Agent header.
 */
export const parseUserAgent = (userAgent = '') => {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const device = parser.getDevice();
  const os = parser.getOS();

  const browserName = browser.name
    ? `${browser.name}${browser.version ? ` ${browser.version.split('.')[0]}` : ''}`
    : 'Unknown';

  let deviceType = 'Desktop';
  if (device.type === 'mobile') deviceType = 'Mobile';
  else if (device.type === 'tablet') deviceType = 'Tablet';
  else if (device.type) deviceType = device.type;

  const deviceLabel = device.vendor
    ? `${device.vendor} ${device.model || deviceType}`.trim()
    : os.name
      ? `${os.name} (${deviceType})`
      : deviceType;

  return {
    browser: browserName,
    device: deviceLabel,
  };
};
