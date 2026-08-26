import type { AboutPageContent } from '@/types/homeContent';
import { TextField } from '@/app/components/edicion/fields/TextField';

type Props = {
  page: AboutPageContent;
  set: (patch: Partial<AboutPageContent>) => void;
};

export function AboutPageContactFields({ page, set }: Props) {
  const contact = page.contact;
  const setContact = (patch: Partial<typeof contact>) => {
    set({ contact: { ...contact, ...patch } });
  };

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Encuéntranos</p>
      <TextField
        label="Título del envío"
        value={contact.shippingTitle}
        onChange={(v) => setContact({ shippingTitle: v })}
      />
      <TextField
        label="Texto del envío"
        value={contact.shippingDescription}
        onChange={(v) => setContact({ shippingDescription: v })}
        multiline
      />
      <TextField label="Email" value={contact.email} onChange={(v) => setContact({ email: v })} />
      <TextField
        label="Facebook"
        value={contact.facebook}
        onChange={(v) => setContact({ facebook: v })}
      />
      <TextField
        label="Instagram"
        value={contact.instagram}
        onChange={(v) => setContact({ instagram: v })}
      />
      <TextField label="TikTok" value={contact.tiktok} onChange={(v) => setContact({ tiktok: v })} />
    </>
  );
}
