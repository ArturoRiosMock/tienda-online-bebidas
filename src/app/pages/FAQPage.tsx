import React, { useEffect } from 'react';
import { FAQ } from '@/app/components/FAQ';

export const FAQPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <FAQ />
    </main>
  );
};
