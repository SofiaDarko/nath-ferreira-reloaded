import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import PortfolioSidebar from '../components/portfolio/PortfolioSidebar';
import LanguageSwitcher from '../components/portfolio/LanguageSwitcher';
import HomePage from '../components/portfolio/HomePage';
import AboutPage from '../components/portfolio/AboutPage';
import ContactPage from '../components/portfolio/ContactPage';
import ProjectModal from '../components/portfolio/ProjectModal';
import PasswordGate from '../components/portfolio/PasswordGate';
import AdminPanel from '../components/portfolio/AdminPanel';
import { TRANSLATIONS } from '../data/translations';
import { DEFAULT_THEME, DEFAULT_GLOBAL_SETTINGS, DEFAULT_SKILLS, DEFAULT_EXPERIENCES, DEFAULT_PROJECTS } from '../data/defaults';
import type { Project, Skill, Experience, EditableTexts, Theme, GlobalSettings, PageId, Lang } from '../types/portfolio';

function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

const Index: React.FC<{ showAdmin?: boolean }> = ({ showAdmin }) => {
  const [lang, setLang] = useState<Lang>('pt');
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const t = TRANSLATIONS[lang];

  const [projects, setProjects] = useState<Project[]>(() => loadState('nf_projects', DEFAULT_PROJECTS));
  const [skills, setSkills] = useState<Skill[]>(() => loadState('nf_skills', DEFAULT_SKILLS));
  const [experiences, setExperiences] = useState<Experience[]>(() => loadState('nf_experiences', DEFAULT_EXPERIENCES));
  const [editableTexts, setEditableTexts] = useState<EditableTexts>(() => loadState('nf_texts', {}));
  const [userPhoto, setUserPhoto] = useState<string | null>(() => loadState('nf_photo', null));
  const [theme, setTheme] = useState<Theme>(() => loadState('nf_theme', DEFAULT_THEME));
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => loadState('nf_settings', DEFAULT_GLOBAL_SETTINGS));

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPasswordGateOpen, setIsPasswordGateOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('nf_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('nf_skills', JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem('nf_experiences', JSON.stringify(experiences)); }, [experiences]);
  useEffect(() => { localStorage.setItem('nf_texts', JSON.stringify(editableTexts)); }, [editableTexts]);
  useEffect(() => { localStorage.setItem('nf_photo', JSON.stringify(userPhoto)); }, [userPhoto]);
  useEffect(() => { localStorage.setItem('nf_theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('nf_settings', JSON.stringify(globalSettings)); }, [globalSettings]);

  // SEO — dynamic head updates per language
  useEffect(() => {
    const isEn = lang === 'en';
    document.documentElement.lang = isEn ? 'en-GB' : 'pt-BR';
    document.title = isEn
      ? 'Nath Ferreira — Graphic Designer | Visual Identity & Branding Freelancer UK'
      : 'Nath Ferreira — Designer Gráfica | Identidade Visual, Branding & Freelancer';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', isEn
        ? 'Nath Ferreira is a freelance graphic designer specialising in visual identity, branding, logos and campaigns for companies and agencies. Based in the UK, available worldwide.'
        : 'Nath Ferreira é designer gráfica freelancer especialista em identidade visual, branding, logotipos e campanhas para empresas e agências. Portfólio completo e contato para orçamentos.'
      );
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', isEn
        ? 'graphic designer, visual identity, branding, logo design, freelance designer UK, brand creation, agency designer, design portfolio, Nath Ferreira'
        : 'designer gráfica, identidade visual, branding, logotipo, criação de marca, design freelancer, designer para agências, portfólio design gráfico, designer freelancer Brasil, Nath Ferreira'
      );
    }

    const geoRegion = document.querySelector('meta[name="geo.region"]');
    if (geoRegion) geoRegion.setAttribute('content', isEn ? 'GB' : 'BR');
    const geoPlace = document.querySelector('meta[name="geo.placename"]');
    if (geoPlace) geoPlace.setAttribute('content', isEn ? 'United Kingdom' : 'Brasil');

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', isEn
      ? 'Nath Ferreira — Graphic Designer | Visual Identity & Branding'
      : 'Nath Ferreira — Designer Gráfica | Identidade Visual & Branding'
    );
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', isEn
      ? 'Freelance graphic designer specialising in visual identity, branding and design for companies and agencies in the UK.'
      : 'Designer gráfica freelancer especialista em identidade visual, branding e design para empresas e agências no Brasil.'
    );
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', isEn ? 'en_GB' : 'pt_BR');
  }, [lang]);

  const handleTextChange = (id: string, html: string) => {
    setEditableTexts((prev) => ({ ...prev, [id]: html }));
  };

  const handleLogout = () => {
    setIsAdminOpen(false);
    setIsEditing(false);
    setIsLoggedIn(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-body" style={{ backgroundColor: theme.bg, color: theme.fg }}>
      {/* Dynamic theme CSS variables */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --theme-bg: ${theme.bg};
          --theme-fg: ${theme.fg};
          --theme-accent: ${theme.accent};
          --theme-accent2: ${theme.accent2};
          --theme-border: ${theme.border};
          --theme-muted: ${theme.muted};
          --theme-title-color: ${theme.titleColor};
          --theme-subtitle-color: ${theme.subtitleColor};
          --theme-card-bg: ${theme.cardBg};
          --theme-tag-bg: ${theme.tagBg};
          --theme-tag-text: ${theme.tagText};
          --theme-hover-border: ${theme.hoverBorder};
          --theme-link-color: ${theme.linkColor};
        }
      `}} />

      <PortfolioSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onAdminClick={() => {
          if (isLoggedIn) {
            setIsAdminOpen(true);
          } else {
            setIsPasswordGateOpen(true);
          }
        }}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        t={t}
        showAdminButton={!!showAdmin || isLoggedIn}
        lang={lang}
        globalSettings={globalSettings}
      />

      <LanguageSwitcher lang={lang} setLang={setLang} />

      <main className="flex-1 relative overflow-hidden pl-[40px]">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <HomePage key="home" projects={projects} onProjectClick={setSelectedProject} t={t} lang={lang} globalSettings={globalSettings} />
          )}
          {currentPage === 'about' && (
            <AboutPage
              key="about"
              isEditing={isEditing}
              editableTexts={editableTexts}
              onTextChange={handleTextChange}
              userPhoto={userPhoto}
              skills={skills}
              experiences={experiences}
              t={t}
              lang={lang}
              globalSettings={globalSettings}
            />
          )}
          {currentPage === 'contact' && (
            <ContactPage key="contact" isEditing={isEditing} editableTexts={editableTexts} onTextChange={handleTextChange} t={t} lang={lang} globalSettings={globalSettings} />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} lang={lang} />}
        {isPasswordGateOpen && (
          <PasswordGate
            onSuccess={() => {
              setIsPasswordGateOpen(false);
              setIsAdminOpen(true);
              setIsEditing(true);
              setIsLoggedIn(true);
            }}
            onClose={() => setIsPasswordGateOpen(false)}
          />
        )}
        {isAdminOpen && (
          <AdminPanel
            projects={projects}
            setProjects={setProjects}
            onClose={() => setIsAdminOpen(false)}
            setUserPhoto={setUserPhoto}
            skills={skills}
            setSkills={setSkills}
            experiences={experiences}
            setExperiences={setExperiences}
            editableTexts={editableTexts}
            onTextChange={handleTextChange}
            t={t}
            lang={lang}
            theme={theme}
            setTheme={setTheme}
            globalSettings={globalSettings}
            setGlobalSettings={setGlobalSettings}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
