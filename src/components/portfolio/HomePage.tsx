import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Project, GlobalSettings } from '../../types/portfolio';

interface HomePageProps {
  projects: Project[];
  onProjectClick: (p: Project) => void;
  t: Record<string, string>;
  lang: string;
  globalSettings: GlobalSettings;
}

function ProjectCard({ project, onClick, index, lang }: { project: Project; onClick: () => void; index: number; lang: string }) {
  const name = lang === 'en' && project.name_en ? project.name_en : project.name;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative rounded-2xl cursor-pointer bg-[#161616] min-h-[160px] min-w-[280px] max-w-[380px] h-full transition-all duration-300"
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Border overlay visible on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent transition-colors duration-300 z-20 pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl overflow-hidden image-protect-wrapper">
        <img
          src={project.thumb}
          alt={name}
          className="w-full h-full object-cover block transition-all duration-500 group-hover:blur-sm group-hover:brightness-[0.45] group-hover:scale-105 protected-image"
          referrerPolicy="no-referrer"
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-start justify-end p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
        <div className="font-display text-sm font-bold text-fg mb-2 tracking-tight">{name}</div>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="font-body text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const HomePage: React.FC<HomePageProps> = ({ projects, onProjectClick, t, lang, globalSettings }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollInterval = useRef<number | null>(null);

  const checkScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft: sl, scrollWidth, clientWidth } = trackRef.current;
    setShowRightArrow(sl < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = trackRef.current;
    if (el) el.addEventListener('scroll', checkScroll);
    return () => { if (el) el.removeEventListener('scroll', checkScroll); };
  }, [checkScroll, projects]);

  const startAutoScroll = () => {
    if (scrollInterval.current) return;
    scrollInterval.current = window.setInterval(() => {
      if (trackRef.current) {
        trackRef.current.scrollLeft += 4;
      }
    }, 16);
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (trackRef.current?.offsetLeft || 0));
    setScrollLeft(trackRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (trackRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (trackRef.current) trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const siteTitle = lang === 'en' ? globalSettings.siteTitleEn : globalSettings.siteTitle;
  const role = lang === 'en' ? globalSettings.roleEn : globalSettings.role;
  const specialist = lang === 'en' ? globalSettings.specialistEn : globalSettings.specialist;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
      <div className="px-15 pt-10 flex-shrink-0 relative z-10">
        <h1 className="font-display text-[100px] font-normal leading-[0.95] tracking-tight text-fg">{siteTitle}</h1>
        <p className="font-body text-[20px] font-light text-fg/55 mt-3.5 tracking-wide">
          {role} &nbsp;<span className="text-accent">|</span>&nbsp; {specialist}
        </p>
        <div className="h-px bg-border mt-7 -ml-[40px]" style={{ width: 'calc(100% + 40px)' }} />
      </div>

      <div className="flex-1 relative">
        <div
          className="absolute inset-0 overflow-x-auto overflow-y-hidden px-15 py-7 cursor-grab active:cursor-grabbing no-scrollbar"
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { handleMouseUp(); stopAutoScroll(); }}
        >
          <div className="flex gap-5 h-full w-max items-stretch">
            {projects.length === 0
              ? Array.from({ length: 7 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative rounded-2xl overflow-hidden bg-[#161616] min-h-[160px] min-w-[220px] max-w-[380px] flex items-center justify-center font-display text-[10px] text-[#252525] uppercase tracking-widest flex-col gap-2.5"
                    style={{ flex: i % 3 === 0 ? '2.2' : '1' }}
                  >
                    <div className="text-2xl text-[#222]">◼</div>
                    <span>{lang === 'pt' ? 'Adicione projetos' : 'Add projects'}</span>
                  </motion.div>
                ))
              : projects.map((proj, i) => (
                  <ProjectCard key={proj.id} project={proj} onClick={() => onProjectClick(proj)} index={i} lang={lang} />
                ))}
          </div>
        </div>

        {/* Right edge scroll zone */}
        {showRightArrow && (
          <div
            className="absolute top-0 right-0 w-16 h-full z-20 flex items-center justify-center cursor-pointer"
            onMouseEnter={startAutoScroll}
            onMouseLeave={stopAutoScroll}
          >
            <div className="bg-gradient-to-l from-background/80 to-transparent absolute inset-0" />
            <span className="relative text-accent text-2xl animate-arrow-pulse">→</span>
          </div>
        )}

        <div className="absolute bottom-5 right-7 flex items-center gap-2 font-body text-[11px] text-muted-foreground tracking-widest uppercase opacity-50 pointer-events-none z-10">
          <span className="animate-arrow-pulse">→</span>
          <span>{t.drag}</span>
        </div>
      </div>
    </motion.section>
  );
};

export default HomePage;
