import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../../types/portfolio';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  lang: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, lang }) => {
  const [imgIdx, setImgIdx] = useState(0);

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

  const name = lang === 'en' && project.name_en ? project.name_en : project.name;
  const description = lang === 'en' && project.description_en ? project.description_en : project.description;
  const hasMultiple = project.images.length > 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-bg/95 backdrop-blur-xl flex" onClick={onClose}>
      <div className="flex h-full w-full" onClick={(e) => e.stopPropagation()}>
        {/* Left info panel */}
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="w-[360px] min-w-[360px] h-full border-r border-border p-10 flex flex-col justify-between">
          <div>
            <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center cursor-pointer text-fg transition-colors hover:border-accent hover:text-accent mb-10" onClick={onClose}>
              <X size={16} />
            </button>
            <div className="font-display text-[10px] tracking-[0.2em] uppercase text-accent mb-5">— {lang === 'pt' ? 'Projeto' : 'Project'}</div>
            <h3 className="font-display text-3xl font-normal tracking-tight mb-5 leading-tight text-fg">{name}</h3>
            <p className="font-body text-sm leading-relaxed text-fg/60 mb-8 whitespace-pre-wrap">{description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="font-body text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5 text-fg/40 font-body text-xs">
              <Images size={14} />
              <span>
                {project.images.length} {project.images.length === 1 ? (lang === 'pt' ? 'imagem' : 'image') : (lang === 'pt' ? 'imagens' : 'images')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right image area */}
        <div className="flex-1 flex items-center justify-center p-10 relative overflow-hidden">
          <div className="w-full h-full relative flex items-center justify-center image-protect-wrapper">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                src={project.images[imgIdx]}
                alt={`${name} - ${imgIdx + 1}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="max-w-full max-h-full rounded-xl object-contain shadow-2xl protected-image"
                referrerPolicy="no-referrer"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </AnimatePresence>
          </div>

          {hasMultiple && (
            <>
              <button
                aria-label={lang === 'pt' ? 'Imagem anterior' : 'Previous image'}
                className="absolute top-1/2 -translate-y-1/2 left-6 z-10 w-12 h-12 rounded-full flex items-center justify-center bg-bg/70 backdrop-blur-sm border border-border text-fg transition-all hover:border-accent hover:text-accent hover:bg-bg disabled:opacity-30 disabled:pointer-events-none"
                onClick={prev}
                disabled={imgIdx === 0}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                aria-label={lang === 'pt' ? 'Próxima imagem' : 'Next image'}
                className="absolute top-1/2 -translate-y-1/2 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center bg-bg/70 backdrop-blur-sm border border-border text-fg transition-all hover:border-accent hover:text-accent hover:bg-bg disabled:opacity-30 disabled:pointer-events-none"
                onClick={next}
                disabled={imgIdx === project.images.length - 1}
              >
                <ChevronRight size={22} />
              </button>
              <div className="absolute bottom-11 left-10 font-display text-[10px] tracking-widest text-muted-foreground">
                {imgIdx + 1} / {project.images.length}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectModal;
