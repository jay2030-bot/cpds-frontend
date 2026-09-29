/**
 * A scanned QR code contains a full URL, e.g. "https://cpds.example.com/verify/CPDS-XXXX-...".
 * Extract just the token so the frontend can navigate to /verify/:token locally, without caring
 * what domain the QR was generated for. Falls back to treating the raw scanned text as the token
 * itself, in case a code was generated without the URL wrapper.
 */
export function extractTokenFromScan(rawText: string): string {
  const trimmed = rawText.trim();
  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split('/').filter(Boolean);
    const verifyIndex = segments.indexOf('verify');
    if (verifyIndex !== -1 && segments[verifyIndex + 1]) {
      return decodeURIComponent(segments[verifyIndex + 1]);
    }
    // A URL without a recognizable /verify/ segment: fall through to raw text.
  } catch {
    // Not a URL at all — treat the whole scanned string as the token.
  }
  return trimmed;
}
