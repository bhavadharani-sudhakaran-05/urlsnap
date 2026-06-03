import { useEffect, useState } from 'react';
import { checkApiHealth } from '../api/healthApi';

export function useApiHealth() {
  const [status, setStatus] = useState('checking'); // checking | online | offline

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      try {
        await checkApiHealth();
        if (!cancelled) setStatus('online');
      } catch {
        if (!cancelled) setStatus('offline');
      }
    };

    ping();
    const interval = setInterval(ping, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}
