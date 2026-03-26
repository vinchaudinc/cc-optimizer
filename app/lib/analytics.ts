export function trackEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const win = window as Window & { fbq?: (...args: unknown[]) => void };

  if (typeof win.fbq === "function") {
    win.fbq("trackCustom", eventName, eventData ?? {});
  }
}
