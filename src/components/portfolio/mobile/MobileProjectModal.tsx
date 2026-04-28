import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import type { Project, Theme } from '../../../types/portfolio';
import { isVideo } from '../../../lib/media';

interface MobileProjectModalProps {
  project: Project;
  onClose: () => void;
  lang: string;
  theme: Theme;
}

const MobileProjectModal: React.FC<MobileProjectModalProps> = ({ project, onClose, lang, theme }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const next = useCallback(
    () => setImgIdx((i) => Math.min(i + 1, project.images.length - 1)),
    [project.images.length]
  );
  const prev = useCallback(() => setImgIdx((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const name = lang === 'en' && project.name_en ? project.name_en : project.name;
  const description = lang === 'en' && project.description_en ? project.description_en : project.description;
  const hasMultiple = project.images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Header */}
      <header
        className="h-14 flex-shrink-0 flex items-center justify-between px-4 border-b z-10"
        style={{ borderColor: theme.border, backgroundColor: theme.bg }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center rounded-full border"
          style={{ borderColor: theme.border, color: theme.fg }}
        >
          <X size={18} />
        </button>
        <div className="font-display text-[10px] tracking-[0.2em] uppercase" style={{ color: theme.muted }}>
          {imgIdx + 1} / {project.images.length}
        </div>
        <div className="w-9 h-9" />
      </header>

      {/* Image area */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden image-protect-wrapper"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIdx}
            src={project.images[imgIdx]}
            alt={`${name} - ${imgIdx + 1}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="max-w-full max-h-full object-contain protected-image px-4"
            referrerPolicy="no-referrer"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </AnimatePresence>

        {hasMultiple && (
          <>
            <button
              aria-label={lang === 'pt' ? 'Imagem anterior' : 'Previous image'}
              onClick={prev}
              disabled={imgIdx === 0}
              className="absolute top-1/2 -translate-y-1/2 left-3 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm border disabled:opacity-30"
              style={{ backgroundColor: `${theme.bg}b3`, borderColor: theme.border, color: theme.fg }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              aria-label={lang === 'pt' ? 'Próxima imagem' : 'Next image'}
              onClick={next}
              disabled={imgIdx === project.images.length - 1}
              className="absolute top-1/2 -translate-y-1/2 right-3 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm border disabled:opacity-30"
              style={{ backgroundColor: `${theme.bg}b3`, borderColor: theme.border, color: theme.fg }}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Collapsible info */}
      <div className="flex-shrink-0 border-t" style={{ borderColor: theme.border, backgroundColor: theme.bg }}>
        <button
          onClick={() => setInfoOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4"
          style={{ color: theme.fg }}
        >
          <div className="flex flex-col items-start min-w-0 flex-1">
            <div className="font-display text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: theme.accent }}>
              — {lang === 'pt' ? 'Projeto' : 'Project'}
            </div>
            <div className="font-display text-base font-normal tracking-tight truncate w-full text-left">
              {name}
            </div>
          </div>
          {infoOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>

        <AnimatePresence initial={false}>
          {infoOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 max-h-[40vh] overflow-y-auto">
                <p
                  className="font-body text-sm leading-relaxed mb-4 whitespace-pre-wrap"
                  style={{ color: `${theme.fg}99` }}
                >
                  {description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full border"
                      style={{
                        backgroundColor: `${theme.accent}26`,
                        color: theme.accent,
                        borderColor: `${theme.accent}40`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MobileProjectModal;
