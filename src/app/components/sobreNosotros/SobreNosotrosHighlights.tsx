import type { AboutPageContent } from '@/types/homeContent';
import { Award, Heart, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';

const ICONS = [Award, Sparkles, Users, Heart];

export function SobreNosotrosHighlights({ about }: { about: AboutPageContent }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14"
      >
        {ICONS.map((Icon, index) => {
          const feature = about.features[index];
          if (!feature) return null;
          return (
            <div key={feature.title} className="bg-gray-50 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-[#0c3c1f]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-[#0c3c1f]" />
              </div>
              <h4 className="text-[#212121] font-bold mb-1">{feature.title}</h4>
              <p className="text-[#717182] text-sm">{feature.description}</p>
            </div>
          );
        })}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#0c3c1f]/5 border-l-4 border-[#0c3c1f] p-6 rounded mb-14"
      >
        <p className="text-[#212121] italic text-lg">&ldquo;{about.quote}&rdquo;</p>
      </motion.div>
    </>
  );
}
