import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence } from 'motion/react';
import PortfolioSidebar from '../components/portfolio/PortfolioSidebar';
import LanguageSwitcher from '../components/portfolio/LanguageSwitcher';
import HomePage from '../components/portfolio/HomePage';
import AboutPage from '../components/portfolio/AboutPage';
import ContactPage from '../components/portfolio/ContactPage';
import ProjectModal from '../components/portfolio/ProjectModal';
import PasswordGate from '../components/portfolio/PasswordGate';
import AdminPanel from '../components/portfolio/AdminPanel';
import MobileLayout from '../components/portfolio/mobile/MobileLayout';
import { TRANSLATIONS } from '../data/translations';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useIsMobile } from '../hooks/use-mobile';
import type { Project, PageId, Lang } from '../types/portfolio';

// Convert hex (#rgb, #rrggbb, #rrggbbaa) to "H S% L%" string for CSS HSL vars
function hexToHsl(hex: string): string {
  if (!hex) return '0 0% 0%';
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length === 8) h = h.slice(0, 6); // ignore alpha
  if (h.length !== 6) return '0 0% 0%';
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0, sat = 0;
  const lum = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = lum > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hue = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hue = (b - r) / d + 2; break;
      case b: hue = (r - g) / d + 4; break;
    }
    hue *= 60;
  }
  return `${Math.round(hue)} ${Math.round(sat * 100)}% ${Math.round(lum * 100)}%`;
}

const Index: React.FC<{ showAdmin?: boolean }> = ({ showAdmin }) => {
  const [lang, setLang] = useState<Lang>('pt');
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const t = TRANSLATIONS[lang];

  const {
    loading,
    projects, setProjects, deleteProject,
    skills, setSkills, deleteSkill,
    experiences, setExperiences, deleteExperience,
    education, setEducation, deleteEducation,
    editableTexts, setEditableTexts,
    userPhoto, setUserPhoto,
    theme, setTheme,
    globalSettings, setGlobalSettings,
    socialLinks, setSocialLinks,
  } = usePortfolioData();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPasswordGateOpen, setIsPasswordGateOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  // Sync isLoggedIn with real auth session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session) {
        setIsAdminOpen(false);
        setIsEditing(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminOpen(false);
    setIsEditing(false);
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.accent, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden font-body" style={{ backgroundColor: theme.bg, color: theme.fg }}>
      {/* Dynamic theme CSS variables — sync hex theme with Tailwind HSL tokens */}
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
          --theme-card-border: ${theme.cardBorder};

          --bg: ${hexToHsl(theme.bg)};
          --background: ${hexToHsl(theme.bg)};
          --card: ${hexToHsl(theme.bg)};
          --popover: ${hexToHsl(theme.bg)};
          --sidebar-background: ${hexToHsl(theme.bg)};

          --fg: ${hexToHsl(theme.fg)};
          --foreground: ${hexToHsl(theme.fg)};
          --card-foreground: ${hexToHsl(theme.fg)};
          --popover-foreground: ${hexToHsl(theme.fg)};
          --secondary-foreground: ${hexToHsl(theme.fg)};
          --sidebar-accent-foreground: ${hexToHsl(theme.fg)};

          --accent: ${hexToHsl(theme.accent)};
          --primary: ${hexToHsl(theme.accent)};
          --ring: ${hexToHsl(theme.accent)};
          --sidebar-ring: ${hexToHsl(theme.accent)};
          --sidebar-primary: ${hexToHsl(theme.accent)};

          --accent2: ${hexToHsl(theme.accent2)};
          --destructive: ${hexToHsl(theme.accent2)};

          --border: ${hexToHsl(theme.border)};
          --input: ${hexToHsl(theme.border)};
          --border-color: ${hexToHsl(theme.border)};
          --sidebar-border: ${hexToHsl(theme.border)};

          --muted-foreground: ${hexToHsl(theme.muted)};
          --sidebar-foreground: ${hexToHsl(theme.muted)};
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
              education={education}
              t={t}
              lang={lang}
              globalSettings={globalSettings}
            />
          )}
          {currentPage === 'contact' && (
            <ContactPage key="contact" isEditing={isEditing} editableTexts={editableTexts} onTextChange={handleTextChange} t={t} lang={lang} globalSettings={globalSettings} socialLinks={socialLinks} />
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
            deleteProject={deleteProject}
            onClose={() => setIsAdminOpen(false)}
            setUserPhoto={setUserPhoto}
            userPhoto={userPhoto}
            skills={skills}
            setSkills={setSkills}
            deleteSkill={deleteSkill}
            experiences={experiences}
            setExperiences={setExperiences}
            deleteExperience={deleteExperience}
            education={education}
            setEducation={setEducation}
            deleteEducation={deleteEducation}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
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
