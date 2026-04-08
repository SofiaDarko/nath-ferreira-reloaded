import React from 'react';
import { Settings, LogOut, LogIn } from 'lucide-react';
import type { PageId } from '../../types/portfolio';

interface SidebarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  onAdminClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  t: Record<string, string>;
}

const PortfolioSidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onAdminClick, isLoggedIn, onLogout, t }) => {
  return (
    <aside className="w-16 h-full border-r border-border flex flex-col items-center justify-between py-5 flex-shrink-0 bg-bg relative z-50">
      <div className="font-display text-[9px] font-bold tracking-[0.2em] uppercase text-accent">NF</div>

      <nav className="flex flex-col -my-px">
        {([
          { id: 'home' as PageId, label: t.home },
          { id: 'about' as PageId, label: t.about },
          { id: 'contact' as PageId, label: t.contact },
        ]).map((page) => (
          <div
            key={page.id}
            className={`writing-vertical transform rotate-180 font-display text-[10px] font-normal tracking-[0.18em] uppercase cursor-pointer py-6 px-3.5 transition-all border border-b-0 last:border-b ${
              currentPage === page.id
                ? 'bg-accent text-[#2a2a2a] border-accent z-10'
                : 'text-muted-foreground border-border hover:bg-accent hover:text-[#2a2a2a] hover:border-accent hover:z-10'
            }`}
            onClick={() => setCurrentPage(page.id)}
            role="button"
          >
            {page.label}
          </div>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-3">
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
        <div className="w-px h-10 bg-border" />
      </div>
    </aside>
  );
};

export default PortfolioSidebar;
