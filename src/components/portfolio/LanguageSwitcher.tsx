import React from 'react';
import type { Lang } from '../../types/portfolio';

interface LanguageSwitcherProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang, setLang }) => {
  return (
    <div className="fixed top-6 right-8 z-[100] flex gap-3">
      <button
        onClick={() => setLang('pt')}
        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${lang === 'pt' ? 'border-accent' : 'border-transparent opacity-50'}`}
        title="Português"
      >
        <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="w-full h-full object-cover" />
      </button>
      <button
        onClick={() => setLang('en')}
        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${lang === 'en' ? 'border-accent' : 'border-transparent opacity-50'}`}
        title="English (UK)"
      >
        <img src="https://flagcdn.com/w40/gb.png" alt="United Kingdom" className="w-full h-full object-cover" />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
