import React from 'react';
import { motion } from 'motion/react';
import EditableText from '../EditableText';
import type { Skill, Experience, Education, EditableTexts, GlobalSettings, Theme } from '../../../types/portfolio';

interface MobileAboutPageProps {
  isEditing: boolean;
  editableTexts: EditableTexts;
  onTextChange: (id: string, html: string) => void;
  userPhoto: string | null;
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  lang: string;
  globalSettings: GlobalSettings;
  theme: Theme;
}

const MobileAboutPage: React.FC<MobileAboutPageProps> = ({
  isEditing, editableTexts, onTextChange, userPhoto,
  skills, experiences, education, lang, globalSettings, theme,
}) => {
  const role = lang === 'en' ? globalSettings.roleEn : globalSettings.role;
  const hello = lang === 'en' ? globalSettings.helloEn : globalSettings.hello;
  const skillsTitle = lang === 'en' ? globalSettings.skillsTitleEn : globalSettings.skillsTitle;
  const educationTitle = lang === 'en' ? globalSettings.educationTitleEn : globalSettings.educationTitle;
  const experiencesTitle = lang === 'en' ? globalSettings.experiencesTitleEn : globalSettings.experiencesTitle;
  const bioPlaceholder = lang === 'en' ? globalSettings.bioDefaultEn : globalSettings.bioDefault;

  const savedBio = editableTexts[`about-bio-${lang}`];
  const hasRealContent = savedBio && savedBio.replace(/<[^>]*>/g, '').trim().length > 0;
  const bioValue = hasRealContent ? savedBio : bioPlaceholder;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-5 py-8 flex flex-col gap-12"
    >
      {/* Photo + Bio */}
      <div className="flex flex-col gap-6">
        <div
          className="w-full aspect-[4/5] max-h-[420px] rounded-2xl overflow-hidden border relative flex items-center justify-center"
          style={{ borderColor: theme.border, backgroundColor: '#141414' }}
        >
          {userPhoto ? (
            <img
              src={userPhoto}
              alt="Nath Ferreira"
              className="w-full h-full object-cover pointer-events-none select-none"
              referrerPolicy="no-referrer"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          ) : (
            <div className="font-body text-xs text-center p-5 leading-relaxed" style={{ color: theme.muted }}>
              {lang === 'pt' ? 'Adicione sua foto no painel admin' : 'Add your photo in the admin panel'}
            </div>
          )}
          <div
            className="absolute bottom-3 left-3 font-display text-[9px] tracking-[0.15em] uppercase border px-2.5 py-1 rounded-full"
            style={{ color: theme.muted, borderColor: theme.border, backgroundColor: `${theme.bg}cc` }}
          >
            {role}
          </div>
        </div>
        <div>
          <h2
            className="font-display font-normal leading-[1.08] tracking-tight mb-4"
            style={{ fontSize: 'clamp(26px, 8vw, 36px)', color: theme.fg }}
            dangerouslySetInnerHTML={{ __html: hello }}
          />
          <EditableText
            id={`about-bio-${lang}`}
            isEditing={isEditing}
            value={bioValue}
            onChange={onTextChange}
            className="text-[15px] leading-relaxed"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <div className="font-display text-[10px] font-normal tracking-[0.22em] uppercase mb-5" style={{ color: theme.accent }}>
          — {skillsTitle}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {skills.map((skill) => {
            const isFigma = skill.icon === 'Figma';
            return (
              <div
                key={skill.id}
                className="flex flex-col items-center gap-2 p-3 border rounded-xl font-body text-[10px] tracking-wider uppercase"
                style={{ borderColor: theme.border, color: theme.muted }}
              >
                {skill.iconUrl ? (
                  <img src={skill.iconUrl} alt={skill.name} className="w-7 h-7 object-contain" />
                ) : skill.special ? (
                  isFigma ? (
                    <svg className="w-7 h-7" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#0d0d0d" /><circle cx="22" cy="10" r="4" fill="#a259ff" /><circle cx="16" cy="22" r="3" fill="#0acf83" /><path d="M8 24L16 8l8 16" stroke="#1abcfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                  ) : (
                    <svg className="w-7 h-7" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#141414" /><path d="M16 6l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" fill="#c8f564" /></svg>
                  )
                ) : (
                  <svg className="w-7 h-7" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill={skill.bg} /><text x="5" y="23" fontFamily="sans-serif" fontSize="12" fill={skill.color} fontWeight="bold">{skill.icon}</text></svg>
                )}
                <span className="text-center leading-tight">{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Education */}
      <div>
        <div className="font-display text-[10px] font-normal tracking-[0.22em] uppercase mb-5" style={{ color: theme.accent }}>
          — {educationTitle}
        </div>
        <div className="flex flex-col gap-5">
          {education.length === 0 ? (
            <div className="text-[12px]" style={{ color: theme.muted }}>
              {lang === 'pt' ? 'Nenhuma formação cadastrada.' : 'No education entries yet.'}
            </div>
          ) : (
            education.map((ed) => {
              const course = lang === 'en' && ed.course_en ? ed.course_en : ed.course;
              const desc = lang === 'en' && ed.desc_en ? ed.desc_en : ed.desc;
              return (
                <div key={ed.id} className="pb-5 border-b last:border-0" style={{ borderColor: theme.border }}>
                  <div className="font-display text-[10px] tracking-wide mb-2" style={{ color: theme.muted }}>{ed.period}</div>
                  <div className="font-display text-[15px] font-normal mb-1 tracking-tight" style={{ color: theme.fg }}>{course}</div>
                  <div className="text-xs mb-2 font-medium tracking-wide" style={{ color: theme.accent }}>{ed.school}</div>
                  {desc && <div className="text-[13px] leading-relaxed" style={{ color: `${theme.fg}99` }}>{desc}</div>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Experience */}
      <div className="pb-12">
        <div className="font-display text-[10px] font-normal tracking-[0.22em] uppercase mb-5" style={{ color: theme.accent }}>
          — {experiencesTitle}
        </div>
        <div className="flex flex-col gap-5">
          {experiences.map((exp) => {
            const title = lang === 'en' && exp.title_en ? exp.title_en : exp.title;
            const desc = lang === 'en' && exp.desc_en ? exp.desc_en : exp.desc;
            return (
              <div key={exp.id} className="pb-5 border-b last:border-0" style={{ borderColor: theme.border }}>
                <div className="font-display text-[10px] tracking-wide mb-2" style={{ color: theme.muted }}>{exp.period}</div>
                <div className="font-display text-[15px] font-normal mb-1 tracking-tight" style={{ color: theme.fg }}>{title}</div>
                <div className="text-xs mb-2 font-medium tracking-wide" style={{ color: theme.accent }}>{exp.company}</div>
                <div className="text-[13px] leading-relaxed" style={{ color: `${theme.fg}99` }}>{desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default MobileAboutPage;
