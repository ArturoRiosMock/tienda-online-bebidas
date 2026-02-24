import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import bannersConfig from '@/data/banners-config.json';

interface ImageLinkSlot {
  enabled: boolean;
  type: 'image_link';
  format?: string;
  image: string;
  link: string;
  targetBlank?: boolean;
  gridPosition?: number;
}

interface ImageTextCtaSlot {
  enabled: boolean;
  type: 'image_text_cta';
  format?: string;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgColor?: string;
  textColor?: string;
  targetBlank?: boolean;
  gridPosition?: number;
}

type BannerSlot = ImageLinkSlot | ImageTextCtaSlot;

interface BannerFormat {
  width: number;
  height: number;
  label: string;
}

const formats = bannersConfig.formats as Record<string, BannerFormat>;
const slots = bannersConfig.slots as Record<string, BannerSlot>;

const trackImpression = (slotId: string) => {
  console.log(`[AdBanner] impression: ${slotId}`, { timestamp: Date.now() });
};

const trackClick = (slotId: string) => {
  console.log(`[AdBanner] click: ${slotId}`, { timestamp: Date.now() });
};

type AdBannerVariant = 'default' | 'inline-card' | 'sidebar' | 'leaderboard';

interface AdBannerProps {
  slotId: string;
  className?: string;
  variant?: AdBannerVariant;
}

const adLabel = (
  <span className="absolute top-1.5 right-1.5 bg-black/40 text-white text-[8px] px-1 py-0.5 rounded uppercase tracking-wider z-10">
    Ad
  </span>
);

const renderImageLink = (
  slot: ImageLinkSlot,
  slotId: string,
  variant: AdBannerVariant,
  className: string
) => {
  const isExternal = slot.link.startsWith('http');
  const handleClick = () => trackClick(slotId);

  const aspectMap: Record<AdBannerVariant, string> = {
    'default': '',
    'inline-card': 'aspect-[3/4]',
    'sidebar': 'aspect-[1/2]',
    'leaderboard': 'aspect-[728/90] sm:aspect-auto',
  };

  const img = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative w-full overflow-hidden rounded-xl group ${aspectMap[variant]} ${className}`}
      onClick={handleClick}
    >
      {adLabel}
      <img
        src={slot.image}
        alt="Banner publicitario"
        className={`w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02] ${
          variant === 'inline-card' || variant === 'sidebar' ? 'h-full absolute inset-0' : 'h-auto'
        }`}
        loading="lazy"
      />
    </motion.div>
  );

  if (isExternal) {
    return (
      <a href={slot.link} target={slot.targetBlank ? '_blank' : '_self'} rel="noopener noreferrer" className={variant === 'inline-card' ? 'block h-full' : ''}>
        {img}
      </a>
    );
  }
  return <Link to={slot.link} className={variant === 'inline-card' ? 'block h-full' : ''}>{img}</Link>;
};

const renderImageTextCtaInlineCard = (
  slot: ImageTextCtaSlot,
  slotId: string,
  className: string
) => {
  const isExternal = slot.ctaLink.startsWith('http');
  const bgColor = slot.bgColor || '#0c3c1f';
  const textColor = slot.textColor || '#ffffff';
  const handleClick = () => trackClick(slotId);

  const cta = isExternal ? (
    <a
      href={slot.ctaLink}
      target={slot.targetBlank ? '_blank' : '_self'}
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-block px-3 py-1.5 rounded-md font-bold text-xs transition-all hover:scale-105"
      style={{ backgroundColor: textColor, color: bgColor }}
    >
      {slot.ctaText}
    </a>
  ) : (
    <Link
      to={slot.ctaLink}
      onClick={handleClick}
      className="inline-block px-3 py-1.5 rounded-md font-bold text-xs transition-all hover:scale-105"
      style={{ backgroundColor: textColor, color: bgColor }}
    >
      {slot.ctaText}
    </Link>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-xl flex flex-col h-full ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {adLabel}
      <div className="w-full aspect-[4/3] overflow-hidden">
        <img
          src={slot.image}
          alt={slot.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="text-sm font-bold mb-1 line-clamp-1">{slot.title}</h4>
          <p className="text-[11px] opacity-80 mb-2 line-clamp-2">{slot.description}</p>
        </div>
        {cta}
      </div>
    </motion.div>
  );
};

const renderImageTextCtaDefault = (
  slot: ImageTextCtaSlot,
  slotId: string,
  variant: AdBannerVariant,
  className: string
) => {
  const isExternal = slot.ctaLink.startsWith('http');
  const bgColor = slot.bgColor || '#0c3c1f';
  const textColor = slot.textColor || '#ffffff';
  const handleClick = () => trackClick(slotId);

  const isSidebar = variant === 'sidebar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {adLabel}
      <div className={`flex ${isSidebar ? 'flex-col' : 'flex-col md:flex-row'} items-center ${isSidebar ? 'gap-3 p-4' : 'gap-4 md:gap-8 p-5 md:p-8'}`}>
        <div className={`w-full ${isSidebar ? '' : 'md:w-2/5'} shrink-0`}>
          <img
            src={slot.image}
            alt={slot.title}
            className={`w-full ${isSidebar ? 'h-32' : 'h-40 md:h-52'} object-cover rounded-lg`}
            loading="lazy"
          />
        </div>
        <div className={`flex-1 ${isSidebar ? 'text-center' : 'text-center md:text-left'}`}>
          <h3 className={`${isSidebar ? 'text-sm' : 'text-lg md:text-2xl'} font-bold mb-1.5`}>{slot.title}</h3>
          <p className={`${isSidebar ? 'text-xs' : 'text-sm md:text-base'} opacity-85 mb-3 leading-relaxed`}>{slot.description}</p>
          {isExternal ? (
            <a
              href={slot.ctaLink}
              target={slot.targetBlank ? '_blank' : '_self'}
              rel="noopener noreferrer"
              onClick={handleClick}
              className={`inline-block ${isSidebar ? 'px-4 py-2 text-xs' : 'px-6 py-2.5 text-sm'} rounded-lg font-bold transition-all hover:scale-105`}
              style={{ backgroundColor: textColor, color: bgColor }}
            >
              {slot.ctaText}
            </a>
          ) : (
            <Link
              to={slot.ctaLink}
              onClick={handleClick}
              className={`inline-block ${isSidebar ? 'px-4 py-2 text-xs' : 'px-6 py-2.5 text-sm'} rounded-lg font-bold transition-all hover:scale-105`}
              style={{ backgroundColor: textColor, color: bgColor }}
            >
              {slot.ctaText}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const AdBanner: React.FC<AdBannerProps> = ({ slotId, className = '', variant = 'default' }) => {
  const slot = slots[slotId];
  const tracked = useRef(false);

  useEffect(() => {
    if (slot?.enabled && !tracked.current) {
      trackImpression(slotId);
      tracked.current = true;
    }
  }, [slotId, slot?.enabled]);

  if (!slot || !slot.enabled) return null;

  if (slot.type === 'image_link') {
    return renderImageLink(slot, slotId, variant, className);
  }

  if (slot.type === 'image_text_cta') {
    if (variant === 'inline-card') {
      return renderImageTextCtaInlineCard(slot, slotId, className);
    }
    return renderImageTextCtaDefault(slot, slotId, variant, className);
  }

  return null;
};

export const getInlineAdSlots = (page: 'home' | 'collection'): Array<{ slotId: string; position: number }> => {
  const prefix = page === 'home' ? 'home-grid-inline' : 'collection-grid-inline';
  const result: Array<{ slotId: string; position: number }> = [];

  for (const [key, slot] of Object.entries(slots)) {
    if (key.startsWith(prefix) && slot.enabled && slot.gridPosition) {
      result.push({ slotId: key, position: slot.gridPosition });
    }
  }

  return result.sort((a, b) => a.position - b.position);
};

export { formats as bannerFormats, slots as bannerSlots };
export type { BannerSlot, ImageLinkSlot, ImageTextCtaSlot, BannerFormat, AdBannerVariant };
