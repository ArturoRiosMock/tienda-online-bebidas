import type { HeroContent, HeroSlide, HomeContent } from '@/types/homeContent';
import homeContentDefault from '@/data/home-content.json';

type LegacyHero = {
  imageMobile?: string;
  imageDesktop?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  buttonText?: string;
};

const DEFAULTS = homeContentDefault as HomeContent;

function legacySlide(legacy: LegacyHero, base: HeroSlide): HeroSlide {
  return {
    imageMobile: legacy.imageMobile ?? '',
    imageDesktop: legacy.imageDesktop ?? '',
    title: legacy.title ?? base.title,
    subtitle: legacy.subtitle ?? base.subtitle,
    badge: legacy.badge ?? base.badge,
    buttonText: legacy.buttonText ?? base.buttonText,
  };
}

function migrateHero(hero: Partial<HeroContent> & Record<string, unknown>): HeroContent {
  const defaults = DEFAULTS.hero;

  if (Array.isArray(hero.slides) && hero.slides.length > 0) {
    return { slides: hero.slides as HeroSlide[] };
  }

  const legacy = hero as LegacyHero;
  if (!legacy.title && !legacy.imageDesktop && !legacy.imageMobile) return defaults;

  return {
    slides: [legacySlide(legacy, defaults.slides[0]), ...defaults.slides.slice(1)],
  };
}

export function mergeContent(remote: Partial<HomeContent>): HomeContent {
  return {
    ...DEFAULTS,
    ...remote,
    hero: migrateHero((remote.hero ?? {}) as Partial<HeroContent> & Record<string, unknown>),
    registerBanner: { ...DEFAULTS.registerBanner, ...remote.registerBanner },
    about: {
      ...DEFAULTS.about,
      ...remote.about,
      features: remote.about?.features ?? DEFAULTS.about.features,
    },
    aboutPage: {
      ...DEFAULTS.aboutPage,
      ...remote.aboutPage,
      paragraphs: remote.aboutPage?.paragraphs ?? DEFAULTS.aboutPage.paragraphs,
      features: remote.aboutPage?.features ?? DEFAULTS.aboutPage.features,
      contact: { ...DEFAULTS.aboutPage.contact, ...remote.aboutPage?.contact },
    },
    benefits: remote.benefits ?? DEFAULTS.benefits,
    carousels: { ...DEFAULTS.carousels, ...remote.carousels },
  };
}
