import type { AboutPageContent } from '@/types/homeContent';
import { motion } from 'motion/react';

export function SobreNosotrosStory({ about }: { about: AboutPageContent }) {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-start mb-14">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <img
            src={about.image || '/sobre_nosotros.jpg'}
            alt={about.imageAlt || about.storyTitle}
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c3c1f]/60 to-transparent" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-[#212121]">{about.storyTitle}</h2>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-[#717182] leading-relaxed">
            {paragraph}
          </p>
        ))}
      </motion.div>
    </div>
  );
}
