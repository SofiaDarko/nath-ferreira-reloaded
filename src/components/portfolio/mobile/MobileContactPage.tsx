import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import EditableText from '../EditableText';
import type { EditableTexts, GlobalSettings, SocialLink, Theme } from '../../../types/portfolio';

interface MobileContactPageProps {
  isEditing: boolean;
  editableTexts: EditableTexts;
  onTextChange: (id: string, html: string) => void;
  lang: string;
  globalSettings: GlobalSettings;
  socialLinks?: SocialLink[];
  theme: Theme;
}

const MobileContactPage: React.FC<MobileContactPageProps> = ({
  isEditing, editableTexts, onTextChange, lang, globalSettings, socialLinks, theme,
}) => {
  const letsCreate = lang === 'en' ? globalSettings.letsCreateEn : globalSettings.letsCreate;

  const links = socialLinks || [
    { id: 'email', label: 'Email', url: `mailto:${globalSettings.contactEmail}`, text: globalSettings.contactEmail },
    { id: 'linkedin', label: 'LinkedIn', url: globalSettings.contactLinkedin, text: globalSettings.contactLinkedin },
    { id: 'instagram', label: 'Instagram', url: `https://instagram.com/${globalSettings.contactInstagram.replace(/^@/, '')}`, text: globalSettings.contactInstagram },
    { id: 'behance', label: 'Behance', url: globalSettings.contactBehance, text: globalSettings.contactBehance },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-5 py-10"
    >
      <h2
        className="font-display font-normal leading-[1.05] tracking-tight mb-8"
        style={{ fontSize: 'clamp(38px, 11vw, 56px)', color: theme.fg }}
        dangerouslySetInnerHTML={{ __html: letsCreate }}
      />
      <div className="flex flex-col">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target={link.url.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-6 border-b active:opacity-70 transition-opacity"
            style={{ borderColor: theme.border }}
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold mb-1 text-[12px] tracking-wide uppercase" style={{ color: theme.fg }}>
                {link.label}
              </div>
              <EditableText
                id={`${link.id}-text-${lang}`}
                isEditing={isEditing}
                value={editableTexts[`${link.id}-text-${lang}`] || link.text || ''}
                onChange={onTextChange}
                className="text-sm truncate"
              />
            </div>
            <ArrowRight className="-rotate-45 ml-3 flex-shrink-0" size={20} style={{ color: theme.accent }} />
          </a>
        ))}
      </div>
    </motion.section>
  );
};

export default MobileContactPage;
