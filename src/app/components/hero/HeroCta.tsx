import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { readableTextColor } from '@/app/utils/readableTextColor';
import { DEFAULT_CTA_COLOR } from '@/app/components/hero/heroPosition';

const CTA_CLASS =
  'px-8 py-3 rounded-lg transition-opacity hover:opacity-90 font-bold text-sm inline-flex items-center gap-2 group';

interface HeroCtaProps {
  buttonText: string;
  buttonHref?: string;
  buttonColor?: string;
  onShopNowClick: () => void;
}

export function HeroCta({ buttonText, buttonHref, buttonColor, onShopNowClick }: HeroCtaProps) {
  const href = (buttonHref || '').trim();
  const background = buttonColor || DEFAULT_CTA_COLOR;
  const style = { backgroundColor: background, color: readableTextColor(background) };

  const label = (
    <>
      <ShoppingCart className="w-5 h-5" />
      {buttonText}
    </>
  );

  const stopBubble = (e: React.MouseEvent) => e.stopPropagation();

  const handleShopNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShopNowClick();
  };

  if (!href) {
    return (
      <button type="button" onClick={handleShopNow} className={CTA_CLASS} style={style}>
        {label}
      </button>
    );
  }

  if (/^https?:\/\//i.test(href)) {
    return (
      <a
        href={href}
        className={CTA_CLASS}
        style={style}
        rel="noopener noreferrer"
        onClick={stopBubble}
      >
        {label}
      </a>
    );
  }

  return (
    <Link to={href} className={CTA_CLASS} style={style} onClick={stopBubble}>
      {label}
    </Link>
  );
}
