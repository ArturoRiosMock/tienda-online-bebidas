import { useState } from 'react';
import { HeaderAnnouncementBar } from '@/app/components/HeaderAnnouncementBar';
import { HeaderDesktopNav } from '@/app/components/HeaderDesktopNav';
import { HeaderMobileNav } from '@/app/components/HeaderMobileNav';
import { HeaderToolbar } from '@/app/components/HeaderToolbar';
import { SearchDrawer } from '@/app/components/SearchDrawer';
import { useHeaderNav } from '@/app/components/useHeaderNav';
import { useMobileMenuLock } from '@/app/components/useMobileMenuLock';

interface HeaderProps {
  onCartClick: () => void;
  onWishlistClick?: () => void;
  onCategoryClick: (collectionHandle: string) => void;
  searchDrawerOpen: boolean;
  onSearchDrawerChange: (open: boolean) => void;
}

export const Header = ({
  onCartClick,
  onWishlistClick,
  onCategoryClick,
  searchDrawerOpen,
  onSearchDrawerChange,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobile = () => setMobileMenuOpen(false);
  const { desktopNavItems, collectionsLoading, goToNavEntry, handleCategoryClick } = useHeaderNav(
    onCategoryClick,
    closeMobile
  );

  useMobileMenuLock(mobileMenuOpen, closeMobile);

  return (
    <header className="bg-white text-[#212121] sticky top-0 z-40 shadow-md">
      <HeaderAnnouncementBar />
      <HeaderToolbar
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((open) => !open)}
        onOpenSearch={() => onSearchDrawerChange(true)}
        onCartClick={onCartClick}
        onWishlistClick={onWishlistClick}
        onCloseMenu={closeMobile}
      />
      <HeaderDesktopNav
        collectionsLoading={collectionsLoading}
        desktopNavItems={desktopNavItems}
        onCategoryClick={handleCategoryClick}
        onNavEntry={goToNavEntry}
      />
      <HeaderMobileNav
        open={mobileMenuOpen}
        collectionsLoading={collectionsLoading}
        desktopNavItems={desktopNavItems}
        onClose={closeMobile}
        onOpenSearch={() => onSearchDrawerChange(true)}
        onCategoryClick={handleCategoryClick}
        onNavEntry={goToNavEntry}
      />
      <SearchDrawer
        isOpen={searchDrawerOpen}
        onClose={() => onSearchDrawerChange(false)}
        onOpenCart={onCartClick}
      />
    </header>
  );
};
