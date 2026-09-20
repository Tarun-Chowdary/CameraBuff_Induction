import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { filenameFor } from '../data/event';

export default function useTicketDownload() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const download = useCallback(async (node, name) => {
    if (!node) return false;
    try {
      setDownloading(true);
      setError('');
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#2A0710',
      });
      const link = document.createElement('a');
      link.download = filenameFor(name);
      link.href = dataUrl;
      link.click();
      return true;
    } catch (err) {
      console.error(err);
      setError('THE PROJECTOR GOT STUCK. TRY AGAIN.');
      return false;
    } finally {
      setDownloading(false);
    }
  }, []);

  return { downloading, error, download };
}
