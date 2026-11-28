export type AboutCtaCopy = {
  services: string[];
  headline: string;
  headlineAccent: string;
  subtext: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  image: string;
};

export type TeamPageCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  closingTitle: string;
  closingText: string;
  closingButtonLabel: string;
  closingButtonHref: string;
};

export type AboutPageCopy = {
  bannerEyebrow: string;
  bannerHeadline: string;
  bannerImageAlt: string;
  founderBadge: string;
  bioEyebrow: string;
  skillsLabel: string;
  journeyLabel: string;
  visionEyebrow: string;
  visionCredit: string;
  teamBadge: string;
  teamTitle: string;
  teamSubtitle: string;
  cta: AboutCtaCopy;
  seoTitle: string;
  seoDescription: string;
  teamPage: TeamPageCopy;
};

export const defaultAboutPageCopy: AboutPageCopy = {
  bannerEyebrow: "About the Studio",
  bannerHeadline: "Behind the Lens",
  bannerImageAlt: "Photographer at work, PixelRoot Studio",
  founderBadge: "Founder",
  bioEyebrow: "The Photographer",
  skillsLabel: "Expertise",
  journeyLabel: "Professional Journey",
  visionEyebrow: "My Vision",
  visionCredit: "Shariful Hira, Founder of PixelRoot Studio",
  teamBadge: "Our Team",
  teamTitle: "The People Behind\nEvery Great Shot",
  teamSubtitle: "A small team with one job: make the pictures worth keeping.",
  cta: {
    services: [
      "Fashion & Editorial",
      "Weddings",
      "Corporate Events",
      "Commercial Product",
      "Cinematic Video",
      "Model Portfolios",
    ],
    headline: "Ready to Create",
    headlineAccent: "Something Extraordinary?",
    subtext: "A wedding, a brand campaign, or a personal portfolio. Let's make pictures that last.",
    primaryLabel: "Book a Session",
    primaryHref: "/contact",
    secondaryLabel: "View Portfolio",
    secondaryHref: "/portfolio",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80&auto=format&fit=crop",
  },
  seoTitle: "About | PixelRoot Studio | Md Shariful Haque Hira",
  seoDescription:
    "Meet Md Shariful Haque Hira, founder of PixelRoot Studio. 15+ years of experience across fashion, weddings, corporate events, product photography, and film.",
  teamPage: {
    eyebrow: "Our Team",
    title: "Meet the Creatives",
    subtitle: "The photographers and filmmakers behind PixelRoot Studio.",
    primaryLabel: "Work With Us",
    primaryHref: "/contact",
    secondaryLabel: "About the Studio",
    secondaryHref: "/about",
    closingTitle: "Ready to create something exceptional?",
    closingText:
      "Our team is ready to bring your vision to life with cinematic precision and modern luxury aesthetics.",
    closingButtonLabel: "Get in Touch",
    closingButtonHref: "/contact",
  },
};

function pickString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function pickStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => String(item).trim()).filter(Boolean);
}

export function mergeAboutPageCopy(raw: unknown, shortName?: string | null): AboutPageCopy {
  let parsed: Partial<AboutPageCopy> = {};
  if (typeof raw === "string" && raw.trim()) {
    try {
      const json = JSON.parse(raw);
      if (json && typeof json === "object") parsed = json;
    } catch {
      parsed = {};
    }
  } else if (raw && typeof raw === "object") {
    parsed = raw as Partial<AboutPageCopy>;
  }

  const cta = (parsed.cta || {}) as Partial<AboutCtaCopy>;
  const teamPage = (parsed.teamPage || {}) as Partial<TeamPageCopy>;
  const hasVisionCredit = Object.prototype.hasOwnProperty.call(parsed, "visionCredit");
  const creditFallback =
    !hasVisionCredit && shortName?.trim()
      ? `${shortName.trim()}, Founder of PixelRoot Studio`
      : defaultAboutPageCopy.visionCredit;

  return {
    bannerEyebrow: pickString(parsed.bannerEyebrow, defaultAboutPageCopy.bannerEyebrow),
    bannerHeadline: pickString(parsed.bannerHeadline, defaultAboutPageCopy.bannerHeadline),
    bannerImageAlt: pickString(parsed.bannerImageAlt, defaultAboutPageCopy.bannerImageAlt),
    founderBadge: pickString(parsed.founderBadge, defaultAboutPageCopy.founderBadge),
    bioEyebrow: pickString(parsed.bioEyebrow, defaultAboutPageCopy.bioEyebrow),
    skillsLabel: pickString(parsed.skillsLabel, defaultAboutPageCopy.skillsLabel),
    journeyLabel: pickString(parsed.journeyLabel, defaultAboutPageCopy.journeyLabel),
    visionEyebrow: pickString(parsed.visionEyebrow, defaultAboutPageCopy.visionEyebrow),
    visionCredit: pickString(parsed.visionCredit, creditFallback),
    teamBadge: pickString(parsed.teamBadge, defaultAboutPageCopy.teamBadge),
    teamTitle: pickString(parsed.teamTitle, defaultAboutPageCopy.teamTitle),
    teamSubtitle: pickString(parsed.teamSubtitle, defaultAboutPageCopy.teamSubtitle),
    seoTitle: pickString(parsed.seoTitle, defaultAboutPageCopy.seoTitle),
    seoDescription: pickString(parsed.seoDescription, defaultAboutPageCopy.seoDescription),
    cta: {
      services: pickStringList(cta.services, defaultAboutPageCopy.cta.services),
      headline: pickString(cta.headline, defaultAboutPageCopy.cta.headline),
      headlineAccent: pickString(cta.headlineAccent, defaultAboutPageCopy.cta.headlineAccent),
      subtext: pickString(cta.subtext, defaultAboutPageCopy.cta.subtext),
      primaryLabel: pickString(cta.primaryLabel, defaultAboutPageCopy.cta.primaryLabel),
      primaryHref: pickString(cta.primaryHref, defaultAboutPageCopy.cta.primaryHref),
      secondaryLabel: pickString(cta.secondaryLabel, defaultAboutPageCopy.cta.secondaryLabel),
      secondaryHref: pickString(cta.secondaryHref, defaultAboutPageCopy.cta.secondaryHref),
      image: pickString(cta.image, defaultAboutPageCopy.cta.image),
    },
    teamPage: {
      eyebrow: pickString(teamPage.eyebrow, defaultAboutPageCopy.teamPage.eyebrow),
      title: pickString(teamPage.title, defaultAboutPageCopy.teamPage.title),
      subtitle: pickString(teamPage.subtitle, defaultAboutPageCopy.teamPage.subtitle),
      primaryLabel: pickString(teamPage.primaryLabel, defaultAboutPageCopy.teamPage.primaryLabel),
      primaryHref: pickString(teamPage.primaryHref, defaultAboutPageCopy.teamPage.primaryHref),
      secondaryLabel: pickString(teamPage.secondaryLabel, defaultAboutPageCopy.teamPage.secondaryLabel),
      secondaryHref: pickString(teamPage.secondaryHref, defaultAboutPageCopy.teamPage.secondaryHref),
      closingTitle: pickString(teamPage.closingTitle, defaultAboutPageCopy.teamPage.closingTitle),
      closingText: pickString(teamPage.closingText, defaultAboutPageCopy.teamPage.closingText),
      closingButtonLabel: pickString(
        teamPage.closingButtonLabel,
        defaultAboutPageCopy.teamPage.closingButtonLabel
      ),
      closingButtonHref: pickString(
        teamPage.closingButtonHref,
        defaultAboutPageCopy.teamPage.closingButtonHref
      ),
    },
  };
}

export function applyPageCopyPatch(
  current: AboutPageCopy,
  patch: Partial<AboutPageCopy>
): AboutPageCopy {
  const next: AboutPageCopy = { ...current, ...stripUndefined(patch) };
  if (patch.cta) next.cta = { ...current.cta, ...stripUndefined(patch.cta) };
  if (patch.teamPage) next.teamPage = { ...current.teamPage, ...stripUndefined(patch.teamPage) };
  return next;
}

function stripUndefined<T extends object>(value: T): Partial<T> {
  const next: Partial<T> = {};
  for (const key of Object.keys(value) as (keyof T)[]) {
    if (value[key] !== undefined) next[key] = value[key];
  }
  return next;
}
