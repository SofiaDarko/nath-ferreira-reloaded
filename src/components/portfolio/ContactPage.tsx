import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import EditableText from './EditableText';
import type { EditableTexts, GlobalSettings, SocialLink } from '../../types/portfolio';

interface ContactPageProps {
  isEditing: boolean;
  editableTexts: EditableTexts;
  onTextChange: (id: string, html: string) => void;
  t: Record<string, string>;
  lang: string;
  globalSettings: GlobalSettings;
  socialLinks?: SocialLink[];
}

const ContactPage: React.FC<ContactPageProps> = ({ isEditing, editableTexts, onTextChange, t, lang, globalSettings, socialLinks }) => {
  const letsCreate = lang === 'en' ? globalSettings.letsCreateEn : globalSettings.letsCreate;
  
  // Use socialLinks if provided, otherwise fallback to old globalSettings
  const links = socialLinks || [
    { id: 'email', label: 'Email', url: 'mailto:' + globalSettings.contactEmail, text: globalSettings.contactEmail },
    { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/seu', text: globalSettings.contactLinkedin },
    { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/seu', text: globalSettings.contactInstagram },
    { id: 'behance', label: 'Behance', url: 'https://behance.net/seu', text: globalSettings.contactBehance },
  ];
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center p-16">
      <div className="max-w-lg w-full">
        <h2 className="font-display text-[clamp(40px,5vw,72px)] font-normal leading-none tracking-tight mb-10" dangerouslySetInnerHTML={{ __html: letsCreate }} />
        <div className="flex flex-col">
          {links.map((link) => (
            <div key={link.id} className="group flex items-center justify-between py-5 border-b border-border transition-colors hover:text-accent">
              <a href={link.url} target={link.url.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className="flex-1 cursor-pointer">
                <div className="font-semibold mb-0.5 text-[13px] tracking-wide uppercase">{link.label}</div>
                <EditableText id={`${link.id}-text-${lang}`} isEditing={isEditing} value={editableTexts[`${link.id}-text-${lang}`] || link.text || ''} onChange={onTextChange} className="text-sm text-muted-foreground" />
              </a>
              <ArrowRight className="text-muted-foreground transition-transform duration-200 group-hover:text-accent group-hover:translate-x-1 -rotate-45" size={18} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ContactPage;
