import React from 'react';
import { motion } from 'motion/react';
import type { PolicyBlock } from '@/content/mrbrown/policies';

interface PolicyDocumentPageProps {
  title: string;
  blocks: PolicyBlock[];
}

export const PolicyDocumentPage: React.FC<PolicyDocumentPageProps> = ({ title, blocks }) => {
  return (
    <>
      <section className="bg-gradient-to-r from-[#0c3c1f] to-[#1a5c35] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-bold text-white"
          >
            {title}
          </motion.h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {blocks.map((block, i) => (
            <div key={i}>
              {block.title && (
                <h2 className="text-lg font-bold text-[#212121] mb-2">{block.title}</h2>
              )}
              {block.body.split('\n\n').map((paragraph, j) => (
                <p key={j} className="text-[#717182] leading-relaxed mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </motion.div>
      </section>
    </>
  );
};
