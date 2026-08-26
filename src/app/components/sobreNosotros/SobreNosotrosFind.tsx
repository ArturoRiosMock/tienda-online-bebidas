import type { AboutPageContent } from '@/types/homeContent';
import { ExternalLink, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { formatLicense, hasLicenseInfo, LICENSE_AUTHORITY } from '@/content/mrbrown/business-info';

const SOCIALS = ['facebook', 'instagram', 'tiktok'] as const;
const SOCIAL_LABEL: Record<(typeof SOCIALS)[number], string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
};

export function SobreNosotrosFind({ about }: { about: AboutPageContent }) {
  const { contact } = about;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <h2 className="text-2xl font-bold text-[#212121] mb-6">Encuéntranos</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-5">
          <MapPin className="w-5 h-5 text-[#0c3c1f] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-[#212121] mb-1">{contact.shippingTitle}</h4>
            <p className="text-[#717182] text-sm">{contact.shippingDescription}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-5">
          <Mail className="w-5 h-5 text-[#0c3c1f] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-[#212121] mb-1">Email</h4>
            <a href={`mailto:${contact.email}`} className="text-[#0c3c1f] text-sm hover:underline">
              {contact.email}
            </a>
          </div>
        </div>
        {hasLicenseInfo() && (
          <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-5 md:col-span-2">
            <ShieldCheck className="w-5 h-5 text-[#0c3c1f] mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-[#212121] mb-1">Licencia para venta de bebidas alcohólicas</h4>
              <p className="text-[#717182] text-sm">{formatLicense()}</p>
              {LICENSE_AUTHORITY && (
                <p className="text-[#717182] text-xs mt-1">Emitida por {LICENSE_AUTHORITY}.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-6">
        {SOCIALS.map((key) => (
          <a
            key={key}
            href={contact[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#0c3c1f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a3019] transition-colors"
          >
            {SOCIAL_LABEL[key]}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ))}
      </div>
    </motion.div>
  );
}
