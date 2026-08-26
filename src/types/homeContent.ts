export type HeroPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface HeroSlide {
  imageMobile: string;
  imageDesktop: string;
  title: string;
  subtitle: string;
  badge: string;
  buttonText: string;
  /** Destino del CTA. Vacío = scroll a productos (comportamiento legacy). */
  buttonHref?: string;
  /** Si es true, solo muestra la imagen sin overlay de texto */
  imageOnly?: boolean;
  /** Color de las franjas alrededor de la imagen (la imagen se muestra completa, sin recortar). */
  bgColor?: string;
  /** Color de fondo del botón. El texto se calcula para que contraste. */
  buttonColor?: string;
  /** Dónde se coloca el bloque de contenido (botón y textos) sobre la imagen. */
  buttonPosition?: HeroPosition;
}

export interface HeroContent {
  slides: HeroSlide[];
}

export interface RegisterBannerContent {
  imageMobile: string;
  imageDesktop: string;
  title: string;
  description: string;
  buttonText: string;
  /** Destino del CTA. Vacío = /cotizar-evento. */
  buttonHref?: string;
}

export interface AboutFeature {
  title: string;
  description: string;
}

export interface AboutContent {
  image: string;
  imageAlt: string;
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  statValue: string;
  statLabel: string;
  features: AboutFeature[];
  quote: string;
}

export interface AboutPageContact {
  email: string;
  shippingTitle: string;
  shippingDescription: string;
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface AboutPageContent {
  tagline: string;
  badge: string;
  headline: string;
  image: string;
  imageAlt: string;
  storyTitle: string;
  paragraphs: string[];
  features: AboutFeature[];
  quote: string;
  contact: AboutPageContact;
}

export interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

export interface CarouselsContent {
  featuredTitle: string;
  newArrivalsTitle: string;
}

export interface HomeContent {
  hero: HeroContent;
  registerBanner: RegisterBannerContent;
  about: AboutContent;
  aboutPage: AboutPageContent;
  benefits: BenefitItem[];
  carousels: CarouselsContent;
}
