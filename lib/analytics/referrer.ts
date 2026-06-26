export function categorizeReferrer(referrer: string | null | undefined, siteHost?: string): string {
  if (!referrer?.trim()) return "Direct";

  try {
    const url = new URL(referrer);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (siteHost && host === siteHost.replace(/^www\./, "").toLowerCase()) {
      return "Internal";
    }

    if (host.includes("google.")) return "Google";
    if (host.includes("facebook.com") || host === "fb.com" || host === "m.facebook.com") return "Facebook";
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("youtube.com") || host === "youtu.be") return "YouTube";
    if (host.includes("linkedin.com")) return "LinkedIn";
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("twitter.com") || host === "x.com" || host === "t.co") return "X (Twitter)";
    if (host.includes("bing.com")) return "Bing";
    if (host.includes("yahoo.")) return "Yahoo";
    if (host.includes("duckduckgo.com")) return "DuckDuckGo";
    if (host.includes("pinterest.")) return "Pinterest";
    if (host.includes("whatsapp.com") || host === "wa.me") return "WhatsApp";

    return host;
  } catch {
    return "Direct";
  }
}

export function parseUserAgent(ua: string | null | undefined): { device: string; browser: string } {
  if (!ua) return { device: "unknown", browser: "unknown" };

  const lower = ua.toLowerCase();
  let device = "desktop";
  if (/tablet|ipad/i.test(ua)) device = "tablet";
  else if (/mobile|iphone|android/i.test(ua)) device = "mobile";

  let browser = "Other";
  if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("chrome/") && !lower.includes("chromium")) browser = "Chrome";
  else if (lower.includes("firefox/")) browser = "Firefox";
  else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "Safari";
  else if (lower.includes("opera") || lower.includes("opr/")) browser = "Opera";

  return { device, browser };
}
