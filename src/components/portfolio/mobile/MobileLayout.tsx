import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Settings, LogOut, LogIn } from 'lucide-react';
import MobileHomePage from './MobileHomePage';
import MobileAboutPage from './MobileAboutPage';
import MobileContactPage from './MobileContactPage';
import MobileProjectModal from './MobileProjectModal';
import PasswordGate from '../PasswordGate';
import AdminPanel from '../AdminPanel';
import type {
  Project, PageId, Lang, Skill, Experience, Education,
  EditableTexts, GlobalSettings, SocialLink, Theme,
} from '../../../types/portfolio';

interface MobileLayoutProps {
  // page state
  currentPage: PageId;
  setCurrentPage: (p: PageId) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Record<string, string>;
  // data
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  deleteProject: (id: string) => Promise<void>;
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  deleteSkill: (id: string) => Promise<void>;
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  deleteExperience: (id: string) => Promise<void>;
  education: Education[];
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>;
  deleteEducation: (id: string) => Promise<void>;
  editableTexts: EditableTexts;
  onTextChange: (id: string, html: string) => void;
  userPhoto: string | null;
  setUserPhoto: React.Dispatch<React.SetStateAction<string | null>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  globalSettings: GlobalSettings;
  setGlobalSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  socialLinks: SocialLink[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>>;
  // auth
  isLoggedIn: boolean;
  showAdmin?: boolean;
  onLogout: () => Promise<void> | void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = (props) => {
  const {
    currentPage, setCurrentPage, lang, setLang, t,
    projects, setProjects, deleteProject,
    skills, setSkills, deleteSkill,
    experiences, setExperiences, deleteExperience,
    education, setEducation, deleteEducation,
    editableTexts, onTextChange, userPhoto, setUserPhoto,
    theme, setTheme, globalSettings, setGlobalSettings,
    socialLinks, setSocialLinks,
    isLoggedIn, showAdmin, onLogout, isEditing, setIsEditing,
  } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPasswordGateOpen, setIsPasswordGateOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: lang === 'en' ? (globalSettings.navHomeEn || t.home) : (globalSettings.navHome || t.home) },
    { id: 'about', label: lang === 'en' ? (globalSettings.navAboutEn || t.about) : (globalSettings.navAbout || t.about) },
    { id: 'contact', label: lang === 'en' ? (globalSettings.navContactEn || t.contact) : (globalSettings.navContact || t.contact) },
  ];

  const goTo = (p: PageId) => {
    setCurrentPage(p);
    setMenuOpen(false);
  };

  const handleAdminClick = () => {
    setMenuOpen(false);
    if (isLoggedIn) {
      setIsAdminOpen(true);
    } else {
      setIsPasswordGateOpen(true);
    }
  };

  const showAdminButton = !!showAdmin || isLoggedIn;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-body" style={{ backgroundColor: theme.bg, color: theme.fg }}>
      {/* Top bar */}
      <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 border-b z-30 relative" style={{ borderColor: theme.border, backgroundColor: theme.bg }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center font-display text-xs font-bold tracking-tight"
            style={{ backgroundColor: theme.accent, color: theme.bg }}
          >
            NF
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language switcher inline */}
          <button
            onClick={() => setLang('pt')}
            className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${lang === 'pt' ? 'opacity-100' : 'opacity-50'}`}
            style={{ borderColor: lang === 'pt' ? theme.accent : 'transparent' }}
            title="Português"
          >
            <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="w-full h-full object-cover" />
          </button>
          <button
            onClick={() => setLang('en')}
            className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${lang === 'en' ? 'opacity-100' : 'opacity-50'}`}
            style={{ borderColor: lang === 'en' ? theme.accent : 'transparent' }}
            title="English (UK)"
          >
            <img src="https://flagcdn.com/w40/gb.png" alt="United Kingdom" className="w-full h-full object-cover" />
          </button>

          <button
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-md border ml-1"
            style={{ borderColor: theme.border, color: theme.fg }}
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-[78%] max-w-[320px] z-50 flex flex-col p-6"
              style={{ backgroundColor: theme.bg, borderLeft: `1px solid ${theme.border}` }}
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-display text-[10px] tracking-[0.22em] uppercase" style={{ color: theme.accent }}>— Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 flex items-center justify-center rounded-full border"
                  style={{ borderColor: theme.border, color: theme.fg }}
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goTo(item.id)}
                      className="text-left py-4 px-3 rounded-lg font-display text-2xl tracking-tight transition-colors"
                      style={{
                        color: active ? theme.accent : theme.fg,
                        backgroundColor: active ? `${theme.accent}14` : 'transparent',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {showAdminButton && (
                <div className="mt-auto pt-6 border-t flex flex-col gap-2" style={{ borderColor: theme.border }}>
                  {isLoggedIn && (
                    <button
                      onClick={() => { onLogout(); setMenuOpen(false); }}
                      className="flex items-center gap-3 py-3 px-3 rounded-lg text-sm"
                      style={{ color: theme.fg, border: `1px solid ${theme.border}` }}
                    >
                      <LogOut size={16} />
                      <span>{lang === 'pt' ? 'Sair' : 'Log out'}</span>
                    </button>
                  )}
                  <button
                    onClick={handleAdminClick}
                    className="flex items-center gap-3 py-3 px-3 rounded-lg text-sm"
                    style={{ color: theme.bg, backgroundColor: theme.accent }}
                  >
                    {isLoggedIn ? <Settings size={16} /> : <LogIn size={16} />}
                    <span>{isLoggedIn ? (lang === 'pt' ? 'Painel admin' : 'Admin panel') : (lang === 'pt' ? 'Entrar' : 'Log in')}</span>
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <MobileHomePage
              key="m-home"
              projects={projects}
              onProjectClick={setSelectedProject}
              lang={lang}
              globalSettings={globalSettings}
              theme={theme}
            />
          )}
          {currentPage === 'about' && (
            <MobileAboutPage
              key="m-about"
              isEditing={isEditing}
              editableTexts={editableTexts}
              onTextChange={onTextChange}
              userPhoto={userPhoto}
              skills={skills}
              experiences={experiences}
              education={education}
              lang={lang}
              globalSettings={globalSettings}
              theme={theme}
            />
          )}
          {currentPage === 'contact' && (
            <MobileContactPage
              key="m-contact"
              isEditing={isEditing}
              editableTexts={editableTexts}
              onTextChange={onTextChange}
              lang={lang}
              globalSettings={globalSettings}
              socialLinks={socialLinks}
              theme={theme}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedProject && (
          <MobileProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            lang={lang}
            theme={theme}
          />
        )}
        {isPasswordGateOpen && (
          <PasswordGate
            onSuccess={() => {
              setIsPasswordGateOpen(false);
              setIsAdminOpen(true);
              setIsEditing(true);
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
            onTextChange={onTextChange}
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

export default MobileLayout;
