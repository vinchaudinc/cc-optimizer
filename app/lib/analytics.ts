export async function trackEvent(
  eventName: string,
  eventData?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;

  const win = window as Window & { fbq?: (...args: unknown[]) => void };

  if (typeof win.fbq === "function") {
    win.fbq("trackCustom", eventName, eventData ?? {});
  }

  // Also log to backend
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: eventName, data: eventData }),
  }).catch(console.error);
}
