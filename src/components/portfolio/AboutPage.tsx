import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import EditableText from './EditableText';
import type { Skill, Experience, EditableTexts, GlobalSettings } from '../../types/portfolio';

interface AboutPageProps {
  isEditing: boolean;
  editableTexts: EditableTexts;
  onTextChange: (id: string, html: string) => void;
  userPhoto: string | null;
  skills: Skill[];
  experiences: Experience[];
  t: Record<string, string>;
  lang: string;
  globalSettings: GlobalSettings;
}

const AboutPage: React.FC<AboutPageProps> = ({ isEditing, editableTexts, onTextChange, userPhoto, skills, experiences, t, lang, globalSettings }) => {
  const [panel, setPanel] = useState(0);
  const totalPanels = 3;

  const nextPanel = () => setPanel((p) => Math.min(totalPanels - 1, p + 1));
  const prevPanel = () => setPanel((p) => Math.max(0, p - 1));

  const role = lang === 'en' ? globalSettings.roleEn : globalSettings.role;
  const hello = lang === 'en' ? globalSettings.helloEn : globalSettings.hello;
  const skillsTitle = lang === 'en' ? globalSettings.skillsTitleEn : globalSettings.skillsTitle;
  const educationTitle = lang === 'en' ? globalSettings.educationTitleEn : globalSettings.educationTitle;
  const experiencesTitle = lang === 'en' ? globalSettings.experiencesTitleEn : globalSettings.experiencesTitle;
  const bioPlaceholder = lang === 'en' ? globalSettings.bioDefaultEn : globalSettings.bioDefault;

  // Check if saved bio has real content (not just empty HTML tags/whitespace)
  const savedBio = editableTexts[`about-bio-${lang}`];
  const hasRealContent = savedBio && savedBio.replace(/<[^>]*>/g, '').trim().length > 0;
  const bioValue = hasRealContent ? savedBio : bioPlaceholder;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full relative overflow-hidden">
      <div
        className="flex h-full w-max items-stretch transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{ transform: `translateX(-${panel * (100 / totalPanels)}%)` }}
      >
        {/* Panel 1: Photo + Intro */}
        <div className="w-[calc(100vw-64px)] h-full p-20 flex flex-col justify-center overflow-y-auto">
          <div className="flex items-center gap-20">
            <div className="w-80 min-w-[320px] h-[440px] rounded-2xl overflow-hidden border border-border bg-[#141414] relative flex items-center justify-center">
              {userPhoto ? (
                <img src={userPhoto} alt="Nath Ferreira" className="w-full h-full object-cover pointer-events-none select-none" referrerPolicy="no-referrer" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} />
              ) : (
                <div className="font-body text-xs text-[#2a2a2a] text-center p-5 leading-relaxed">
                  {lang === 'pt' ? 'Adicione sua foto no painel admin' : 'Add your photo in the admin panel'}
                  <br />(PNG recomendado)
                </div>
              )}
              <div className="absolute bottom-3.5 left-3.5 font-display text-[9px] tracking-[0.15em] uppercase text-muted-foreground border border-border px-2.5 py-1 rounded-full bg-bg/80">
                {role}
              </div>
            </div>
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(28px,3.5vw,52px)] font-normal leading-[1.08] tracking-tight mb-6" dangerouslySetInnerHTML={{ __html: hello }} />
              <EditableText id={`about-bio-${lang}`} isEditing={isEditing} value={bioValue} onChange={onTextChange} className="text-base leading-relaxed text-fg/70 max-w-[480px]" />
            </div>
          </div>
        </div>

        {/* Panel 2: Skills */}
        <div className="w-[calc(100vw-64px)] h-full p-20 flex flex-col justify-center overflow-y-auto">
          <div className="font-display text-[10px] font-normal tracking-[0.22em] uppercase text-accent mb-9">— {skillsTitle}</div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3.5 max-w-[660px] mb-12">
            {skills.map((skill, i) => {
              const isFigma = skill.icon === 'Figma';
              return (
                <motion.div
                  key={skill.id}
                  initial={isFigma ? undefined : { opacity: 0, scale: 0.8 }}
                  whileInView={isFigma ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={isFigma ? {} : { duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
                  className="flex flex-col items-center gap-2.5 p-4.5 border border-border rounded-xl font-body text-[10px] text-muted-foreground tracking-wider uppercase transition-colors hover:border-accent hover:text-fg"
                >
                  {skill.iconUrl ? (
                    <img src={skill.iconUrl} alt={skill.name} className="w-7 h-7 object-contain" />
                  ) : skill.special ? (
                    skill.icon === 'Figma' ? (
                      <svg className="w-7 h-7" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#0d0d0d" /><circle cx="22" cy="10" r="4" fill="#a259ff" /><circle cx="16" cy="22" r="3" fill="#0acf83" /><path d="M8 24L16 8l8 16" stroke="#1abcfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                    ) : (
                      <svg className="w-7 h-7" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#141414" /><path d="M16 6l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" fill="#c8f564" /></svg>
                    )
                  ) : (
                    <svg className="w-7 h-7" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill={skill.bg} /><text x="5" y="23" fontFamily="sans-serif" fontSize="12" fill={skill.color} fontWeight="bold">{skill.icon}</text></svg>
                  )}
                  {skill.name}
                </motion.div>
              );
            })}
          </div>
          <div className="font-display text-[10px] font-normal tracking-[0.22em] uppercase text-accent mb-9">— {educationTitle}</div>
          <div className="flex flex-col gap-7 max-w-[680px]">
            <div className="grid grid-cols-[130px,1fr] gap-7 pb-7 border-b border-border last:border-0">
              <EditableText id={`edu-period-${lang}`} isEditing={isEditing} value={editableTexts[`edu-period-${lang}`] || t.eduPeriod} onChange={onTextChange} className="font-display text-[10px] text-muted-foreground tracking-wide pt-1" />
              <div>
                <EditableText id={`edu-title-${lang}`} isEditing={isEditing} value={editableTexts[`edu-title-${lang}`] || t.eduTitle} onChange={onTextChange} className="font-display text-[15px] font-normal mb-1 tracking-tight" />
                <EditableText id={`edu-school-${lang}`} isEditing={isEditing} value={editableTexts[`edu-school-${lang}`] || t.eduSchool} onChange={onTextChange} className="text-xs text-accent mb-2 font-medium tracking-wide" />
                <EditableText id={`edu-desc-${lang}`} isEditing={isEditing} value={editableTexts[`edu-desc-${lang}`] || t.eduDesc} onChange={onTextChange} className="text-[13px] leading-relaxed text-fg/55" />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Experience */}
        <div className="w-[calc(100vw-64px)] h-full p-20 flex flex-col justify-center overflow-y-auto">
          <div className="font-display text-[10px] font-normal tracking-[0.22em] uppercase text-accent mb-9">— {experiencesTitle}</div>
          <div className="flex flex-col gap-7 max-w-[680px]">
            {experiences.map((exp) => {
              const title = lang === 'en' && exp.title_en ? exp.title_en : exp.title;
              const desc = lang === 'en' && exp.desc_en ? exp.desc_en : exp.desc;
              return (
                <div key={exp.id} className="group relative grid grid-cols-[130px,1fr] gap-7 pb-7 border-b border-border last:border-0">
                  <div className="font-display text-[10px] text-muted-foreground tracking-wide pt-1">{exp.period}</div>
                  <div>
                    <div className="font-display text-[15px] font-normal mb-1 tracking-tight">{title}</div>
                    <div className="text-xs text-accent mb-2 font-medium tracking-wide">{exp.company}</div>
                    <div className="text-[13px] leading-relaxed text-fg/55">{desc}</div>
                  </div>
                  {isEditing && (
                    <button className="absolute -right-12 top-1 w-8 h-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors opacity-0 group-hover:opacity-100" title="Delete experience">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel dots */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: totalPanels }).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-200 ${panel === i ? 'bg-accent scale-150' : 'bg-border'}`} onClick={() => setPanel(i)} />
        ))}
      </div>
      {/* Nav arrows */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        <button className="w-10 h-10 border border-border rounded-full flex items-center justify-center cursor-pointer text-fg transition-colors hover:border-accent hover:text-accent bg-bg/50 backdrop-blur-sm" onClick={prevPanel}><ArrowLeft size={16} /></button>
        <button className="w-10 h-10 border border-border rounded-full flex items-center justify-center cursor-pointer text-fg transition-colors hover:border-accent hover:text-accent bg-bg/50 backdrop-blur-sm" onClick={nextPanel}><ArrowRight size={16} /></button>
      </div>
    </motion.section>
  );
};

export default AboutPage;
