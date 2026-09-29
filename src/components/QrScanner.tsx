import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

const ELEMENT_ID = "cpds-qr-reader";

interface Props {
  onDetected: (rawText: string) => void;
  /** Called when the camera can't be used at all, so the parent can offer manual entry. */
  onUnavailable: (reason: string) => void;
}

/**
 * Thin wrapper around html5-qrcode. Starts the back camera on mount, stops and tears
 * down cleanly on unmount (important: leaving a camera stream open after navigating
 * away is a common bug with browser QR libraries).
 */
export function QrScanner({ onDetected, onUnavailable }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [starting, setStarting] = useState(true);
  const hasDetectedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const scanner = new Html5Qrcode(ELEMENT_ID, {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false,
    });
    scannerRef.current = scanner;

    const startPromise = scanner.start(
      { facingMode: "environment" },
      { fps: 10 },
      (decodedText) => {
        if (hasDetectedRef.current) return; // ignore extra frames while we're stopping
        hasDetectedRef.current = true;
        onDetected(decodedText);
      },
      () => {
        // Per-frame "no QR code found" callback — expected constantly while aiming the camera, not an error.
      },
    );

    startPromise
      .then(() => {
        if (!cancelled) setStarting(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Camera access is unavailable in this browser.";
        onUnavailable(message);
      });

    return () => {
      cancelled = true;
      const current = scannerRef.current;
      if (current) {
        void startPromise
          .then(
            async () => {
              await current.stop();
              current.clear();
            },
            () => {
              current.clear();
            },
          )
          .catch(() => {
            // The scanner may already have stopped while navigating after a detection.
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-sm">
      <div id={ELEMENT_ID} className="overflow-hidden rounded-xl bg-black" />
      {starting && (
        <p className="mt-3 text-center text-sm text-slate-500">
          Requesting camera access…
        </p>
      )}
    </div>
  );
}
