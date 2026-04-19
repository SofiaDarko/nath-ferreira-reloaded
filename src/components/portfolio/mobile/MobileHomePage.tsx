import React from 'react';
import { motion } from 'motion/react';
import type { Project, GlobalSettings, Theme } from '../../../types/portfolio';

interface MobileHomePageProps {
  projects: Project[];
  onProjectClick: (p: Project) => void;
  lang: string;
  globalSettings: GlobalSettings;
  theme: Theme;
}

const MobileHomePage: React.FC<MobileHomePageProps> = ({ projects, onProjectClick, lang, globalSettings, theme }) => {
  const siteTitle = lang === 'en' ? globalSettings.siteTitleEn : globalSettings.siteTitle;
  const role = lang === 'en' ? globalSettings.roleEn : globalSettings.role;
  const specialist = lang === 'en' ? globalSettings.specialistEn : globalSettings.specialist;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      {/* Header */}
      <div className="px-5 pt-8 pb-6">
        <h1
          className="font-display font-normal leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(40px, 12vw, 56px)', color: theme.titleColor || theme.fg }}
        >
          {siteTitle}
        </h1>
        <p
          className="font-body text-[14px] font-light mt-3 tracking-wide leading-snug"
          style={{ color: theme.subtitleColor || theme.muted }}
        >
          {role} <span style={{ color: theme.accent }}>|</span> {specialist}
        </p>
        <div className="h-px mt-6" style={{ backgroundColor: theme.border }} />
      </div>

      {/* Projects vertical grid */}
      <div className="px-5 pb-12 flex flex-col gap-4">
        {projects.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-2xl flex items-center justify-center font-display text-[10px] uppercase tracking-widest flex-col gap-2"
              style={{ backgroundColor: theme.cardBg || '#161616', color: theme.muted }}
            >
              <div className="text-2xl opacity-50">◼</div>
              <span>{lang === 'pt' ? 'Adicione projetos' : 'Add projects'}</span>
            </div>
          ))
        ) : (
          projects.map((project, i) => {
            const name = lang === 'en' && project.name_en ? project.name_en : project.name;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                onClick={() => onProjectClick(project)}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                style={{ backgroundColor: theme.cardBg || '#161616' }}
                onContextMenu={(e) => e.preventDefault()}
              >
                <img
                  src={project.thumb}
                  alt={name}
                  loading="lazy"
                  className="protected-image absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <div className="image-protect-wrapper absolute inset-0 z-[1]" />
                <div
                  className="absolute inset-[3px] rounded-2xl border-2 z-20 pointer-events-none"
                  style={{ borderColor: theme.cardBorder || theme.accent }}
                />
                {/* Bottom gradient + name */}
                <div
                  className="absolute inset-x-0 bottom-0 p-4 z-10 flex flex-col gap-2"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
                >
                  <div className="font-display text-base font-bold tracking-tight" style={{ color: theme.fg }}>
                    {name}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-body text-[9px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: theme.tagBg || `${theme.accent}26`,
                          color: theme.tagText || theme.accent,
                          borderColor: `${theme.tagText || theme.accent}40`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.section>
  );
};

export default MobileHomePage;
