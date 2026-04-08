import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Project } from '../../types/portfolio';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  lang: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, lang }) => {
  const [imgIdx, setImgIdx] = useState(0);

  const next = () => setImgIdx((i) => (i + 1) % project.images.length);
  const prev = () => setImgIdx((i) => (i - 1 + project.images.length) % project.images.length);

  const name = lang === 'en' && project.name_en ? project.name_en : project.name;
  const description = lang === 'en' && project.description_en ? project.description_en : project.description;

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
            <h3 className="font-display text-3xl font-normal tracking-tight mb-5 leading-tight">{name}</h3>
            <p className="font-body text-sm leading-relaxed text-fg/60 mb-8 whitespace-pre-wrap">{description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="font-body text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right image area */}
        <div className="flex-1 flex items-center justify-center p-10 relative overflow-hidden">
          <div className="w-full h-full relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                src={project.images[imgIdx]}
                alt={`${name} - ${imgIdx + 1}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="max-w-full max-h-full rounded-xl object-contain shadow-2xl pointer-events-none select-none"
                referrerPolicy="no-referrer"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </AnimatePresence>
          </div>
          {project.images.length > 1 && (
            <>
              <div className="absolute bottom-11 left-10 font-display text-[10px] tracking-widest text-muted-foreground">
                {imgIdx + 1} / {project.images.length}
              </div>
              <div className="absolute bottom-9 right-10 flex gap-2.5 z-10">
                <button className="w-10 h-10 border border-border rounded-full flex items-center justify-center cursor-pointer text-fg transition-colors hover:border-accent hover:text-accent bg-bg/70 backdrop-blur-md" onClick={prev}>
                  <ArrowLeft size={16} />
                </button>
                <button className="w-10 h-10 border border-border rounded-full flex items-center justify-center cursor-pointer text-fg transition-colors hover:border-accent hover:text-accent bg-bg/70 backdrop-blur-md" onClick={next}>
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectModal;
