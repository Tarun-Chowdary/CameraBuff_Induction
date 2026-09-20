import { useState, useCallback } from "react";
import { renderTicketToDataUrl } from "../utils/renderTicket";
import { filenameFor } from "../data/event";

/**
 * Downloads the ticket as a PNG. Renders it natively via Canvas 2D
 * (see utils/renderTicket.js) rather than capturing the live DOM, which
 * was unreliable on mobile Safari/WebKit.
 */
export default function useTicketDownload() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const download = useCallback(async (name, ticketId) => {
    try {
      setDownloading(true);
      setError("");
      const dataUrl = await renderTicketToDataUrl({ name, ticketId });
      const link = document.createElement("a");
      link.download = filenameFor(name);
      link.href = dataUrl;
      link.click();
      return true;
    } catch (err) {
      console.error(err);
      setError("THE PROJECTOR GOT STUCK. TRY AGAIN.");
      return false;
    } finally {
      setDownloading(false);
    }
  }, []);

  return { downloading, error, download };
}
