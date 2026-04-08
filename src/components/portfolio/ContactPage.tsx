import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import EditableText from './EditableText';
import type { EditableTexts, GlobalSettings } from '../../types/portfolio';

interface ContactPageProps {
  isEditing: boolean;
  editableTexts: EditableTexts;
  onTextChange: (id: string, html: string) => void;
  t: Record<string, string>;
  lang: string;
  globalSettings: GlobalSettings;
}

const ContactPage: React.FC<ContactPageProps> = ({ isEditing, editableTexts, onTextChange, t, lang, globalSettings }) => {
  const letsCreate = lang === 'en' ? globalSettings.letsCreateEn : globalSettings.letsCreate;
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center p-16">
      <div className="max-w-lg w-full">
        <h2 className="font-display text-[clamp(40px,5vw,72px)] font-normal leading-none tracking-tight mb-10" dangerouslySetInnerHTML={{ __html: letsCreate }} />
        <div className="flex flex-col">
          {[
            { label: 'Email', id: 'contact-email', default: 'seu@email.com' },
            { label: 'LinkedIn', id: 'contact-linkedin', default: 'linkedin.com/in/nathferreira' },
            { label: 'Instagram', id: 'contact-instagram', default: '@nathferreira' },
            { label: 'Behance', id: 'contact-behance', default: 'behance.net/nathferreira' },
          ].map((link) => (
            <div key={link.id} className="group flex items-center justify-between py-5 border-b border-border transition-colors hover:text-accent">
              <div>
                <div className="font-semibold mb-0.5 text-[13px] tracking-wide uppercase">{link.label}</div>
                <EditableText id={`${link.id}-${lang}`} isEditing={isEditing} value={editableTexts[`${link.id}-${lang}`] || link.default} onChange={onTextChange} className="text-sm text-muted-foreground" />
              </div>
              <ArrowRight className="text-muted-foreground transition-transform duration-200 group-hover:text-accent group-hover:translate-x-1 -rotate-45" size={18} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ContactPage;
