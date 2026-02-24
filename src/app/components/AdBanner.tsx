import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import bannersConfig from '@/data/banners-config.json';

interface ImageLinkSlot {
  enabled: boolean;
  type: 'image_link';
  image: string;
  link: string;
  targetBlank?: boolean;
}

interface ImageTextCtaSlot {
  enabled: boolean;
  type: 'image_text_cta';
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgColor?: string;
  textColor?: string;
  targetBlank?: boolean;
}

type BannerSlot = ImageLinkSlot | ImageTextCtaSlot;

const slots = bannersConfig.slots as Record<string, BannerSlot>;

const trackImpression = (slotId: string) => {
  console.log(`[AdBanner] impression: ${slotId}`, { timestamp: Date.now() });
};

const trackClick = (slotId: string) => {
  console.log(`[AdBanner] click: ${slotId}`, { timestamp: Date.now() });
};

interface AdBannerProps {
  slotId: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotId, className = '' }) => {
  const slot = slots[slotId];
  const tracked = useRef(false);

  useEffect(() => {
    if (slot?.enabled && !tracked.current) {
      trackImpression(slotId);
      tracked.current = true;
    }
  }, [slotId, slot?.enabled]);

  if (!slot || !slot.enabled) return null;

  const handleClick = () => trackClick(slotId);

  const adLabel = (
    <span className="absolute top-2 right-2 bg-black/40 text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider z-10">
      Publicidad
    </span>
  );

  if (slot.type === 'image_link') {
    const isExternal = slot.link.startsWith('http');
    const img = (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative w-full overflow-hidden rounded-xl group ${className}`}
        onClick={handleClick}
      >
        {adLabel}
        <img
          src={slot.image}
          alt="Banner publicitario"
          className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </motion.div>
    );

    if (isExternal) {
      return (
        <a href={slot.link} target={slot.targetBlank ? '_blank' : '_self'} rel="noopener noreferrer">
          {img}
        </a>
      );
    }
    return <Link to={slot.link}>{img}</Link>;
  }

  if (slot.type === 'image_text_cta') {
    const isExternal = slot.ctaLink.startsWith('http');
    const bgColor = slot.bgColor || '#0c3c1f';
    const textColor = slot.textColor || '#ffffff';

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative overflow-hidden rounded-xl ${className}`}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {adLabel}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 p-5 md:p-8">
          <div className="w-full md:w-2/5 shrink-0">
            <img
              src={slot.image}
              alt={slot.title}
              className="w-full h-40 md:h-52 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg md:text-2xl font-bold mb-2">{slot.title}</h3>
            <p className="text-sm md:text-base opacity-85 mb-4 leading-relaxed">{slot.description}</p>
            {isExternal ? (
              <a
                href={slot.ctaLink}
                target={slot.targetBlank ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={handleClick}
                className="inline-block px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: textColor, color: bgColor }}
              >
                {slot.ctaText}
              </a>
            ) : (
              <Link
                to={slot.ctaLink}
                onClick={handleClick}
                className="inline-block px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: textColor, color: bgColor }}
              >
                {slot.ctaText}
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export { slots as bannerSlots };
export type { BannerSlot, ImageLinkSlot, ImageTextCtaSlot };
