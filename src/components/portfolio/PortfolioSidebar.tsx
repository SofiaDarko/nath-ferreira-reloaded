import React from 'react';
import { Settings, LogOut, LogIn } from 'lucide-react';
import type { PageId, GlobalSettings } from '../../types/portfolio';

interface SidebarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  onAdminClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  t: Record<string, string>;
  showAdminButton?: boolean;
  lang: string;
  globalSettings: GlobalSettings;
}

const PortfolioSidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onAdminClick, isLoggedIn, onLogout, t, showAdminButton = false, lang, globalSettings }) => {
  const navItems = [
    { id: 'home' as PageId, label: (lang === 'en' ? globalSettings.navHomeEn : globalSettings.navHome) || t.home || 'Home' },
    { id: 'about' as PageId, label: (lang === 'en' ? globalSettings.navAboutEn : globalSettings.navAbout) || t.about || 'Sobre' },
    { id: 'contact' as PageId, label: (lang === 'en' ? globalSettings.navContactEn : globalSettings.navContact) || t.contact || 'Contato' },
  ];

  return (
    <aside className="w-16 h-full border-r border-border flex flex-col justify-between py-5 flex-shrink-0 bg-bg relative z-50" style={{ backgroundColor: 'hsl(var(--bg))' }}>
      <div className="flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-2 border-accent flex items-center justify-center">
          <span className="font-display text-[9px] font-bold tracking-[0.2em] uppercase text-accent">NF</span>
        </div>
      </div>

      <nav className="flex flex-col overflow-visible border-t border-border">
        {navItems.map((page) => (
          <div
            key={page.id}
            className={`writing-vertical transform rotate-180 font-display text-[11px] font-normal tracking-[0.18em] uppercase cursor-pointer transition-all border-l border-r border-b border-border px-0 py-[28px] flex items-center justify-center overflow-visible whitespace-nowrap ${
              currentPage === page.id
                ? 'bg-accent text-[#2a2a2a]'
                : 'text-muted-foreground hover:bg-accent hover:text-[#2a2a2a]'
            }`}
            style={{ width: '100%', color: currentPage !== page.id ? 'hsl(var(--muted-foreground))' : undefined }}
            onClick={() => setCurrentPage(page.id)}
            role="button"
          >
            {page.label}
          </div>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-3">
        {showAdminButton && (
          <>
            {isLoggedIn && (
              <button
                className="w-8 h-8 border border-accent rounded-md flex items-center justify-center cursor-pointer transition-colors text-accent hover:bg-accent hover:text-bg"
                onClick={onLogout}
                title={t.logout}
              >
                <LogOut size={14} />
              </button>
            )}
            <button
              className={`w-8 h-8 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                isLoggedIn
                  ? 'border-accent text-accent hover:bg-accent/10'
                  : 'border-border text-muted-foreground hover:border-accent hover:text-accent'
              }`}
              onClick={onAdminClick}
              title={isLoggedIn ? t.admin : t.login}
            >
              {isLoggedIn ? <Settings size={14} /> : <LogIn size={14} />}
            </button>
          </>
        )}
        <div className="w-px h-10 bg-border" />
      </div>
    </aside>
  );
};

export default PortfolioSidebar;
