import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2, Pencil, ArrowUp, ArrowDown } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import type { Project, Skill, Experience, EditableTexts, Theme, GlobalSettings } from '../../types/portfolio';
import { TAG_OPTIONS } from '../../data/translations';

interface AdminPanelProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onClose: () => void;
  setUserPhoto: (s: string) => void;
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  editableTexts: EditableTexts;
  onTextChange: (id: string, html: string) => void;
  t: Record<string, string>;
  lang: string;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  globalSettings: GlobalSettings;
  setGlobalSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  projects, setProjects, onClose, setUserPhoto, skills, setSkills, experiences, setExperiences, t, lang, theme, setTheme, globalSettings, setGlobalSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'about' | 'appearance' | 'globalTexts'>('projects');

  // Project Form
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [desc, setDesc] = useState('');
  const [descEn, setDescEn] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [thumb, setThumb] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // Skill Form
  const [skillName, setSkillName] = useState('');
  const [skillIcon, setSkillIcon] = useState('');
  const [skillColor, setSkillColor] = useState('#ffffff');
  const [skillBg, setSkillBg] = useState('#141414');

  // Experience Form
  const [expPeriod, setExpPeriod] = useState('');
  const [expTitle, setExpTitle] = useState('');
  const [expTitleEn, setExpTitleEn] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expDescEn, setExpDescEn] = useState('');

  const [colorTarget, setColorTarget] = useState<keyof Theme | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { const r = ev.target?.result as string; if (r) setThumb(r); };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).sort((a, b) => a.name.localeCompare(b.name));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => { const r = ev.target?.result as string; if (r) setImages((prev) => [...prev, r]); };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { const r = ev.target?.result as string; if (r) setUserPhoto(r); };
      reader.readAsDataURL(file);
    }
  };

  const clearProjectForm = () => {
    setEditingProjectId(null);
    setName(''); setNameEn(''); setDesc(''); setDescEn('');
    setSelectedTags([]); setThumb(null); setImages([]);
  };

  const editProject = (p: Project) => {
    setEditingProjectId(p.id);
    setName(p.name); setNameEn(p.name_en || '');
    setDesc(p.description); setDescEn(p.description_en || '');
    setSelectedTags(p.tags); setThumb(p.thumb); setImages(p.images);
  };

  const saveProject = () => {
    if (!name) return;
    if (editingProjectId) {
      setProjects((prev) => prev.map((p) => p.id === editingProjectId ? {
        ...p, name, name_en: nameEn || undefined, description: desc, description_en: descEn || undefined,
        tags: selectedTags, thumb: thumb || images[0] || p.thumb, images: images.length > 0 ? images : p.images,
      } : p));
    } else {
      const newProject: Project = {
        id: Date.now().toString(), name, name_en: nameEn || undefined, description: desc, description_en: descEn || undefined,
        tags: selectedTags, thumb: thumb || images[0] || '', images: images.length > 0 ? images : (thumb ? [thumb] : []),
      };
      setProjects((prev) => [newProject, ...prev]);
    }
    clearProjectForm();
  };

  const moveProject = (index: number, direction: -1 | 1) => {
    setProjects((prev) => {
      const arr = [...prev];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const saveSkill = () => {
    if (!skillName) return;
    const newSkill: Skill = { id: Date.now().toString(), name: skillName, icon: skillIcon || skillName.substring(0, 2), color: skillColor, bg: skillBg, special: false };
    setSkills((prev) => [...prev, newSkill]);
    setSkillName(''); setSkillIcon(''); setSkillColor('#ffffff'); setSkillBg('#141414');
  };

  const saveExperience = () => {
    if (!expTitle || !expPeriod) return;
    const newExp: Experience = { id: Date.now().toString(), period: expPeriod, title: expTitle, title_en: expTitleEn || undefined, company: expCompany, desc: expDesc, desc_en: expDescEn || undefined };
    setExperiences((prev) => [...prev, newExp]);
    setExpPeriod(''); setExpTitle(''); setExpTitleEn(''); setExpCompany(''); setExpDesc(''); setExpDescEn('');
  };

  const tabs = [
    { id: 'projects' as const, label: lang === 'pt' ? 'Projetos' : 'Projects' },
    { id: 'about' as const, label: lang === 'pt' ? 'Sobre' : 'About' },
    { id: 'appearance' as const, label: t.appearance },
    { id: 'globalTexts' as const, label: t.globalTexts },
  ];

  const inputClass = "w-full bg-[#111] border border-border rounded-lg text-fg font-body text-sm p-3 outline-none focus:border-accent transition-colors";
  const labelClass = "font-body text-[11px] tracking-widest uppercase text-muted-foreground";
  const hintClass = "font-body text-[10px] text-muted-foreground/50 mt-0.5";

  // Global text fields config with char suggestions
  const globalTextFields: { key: keyof GlobalSettings; label: string; chars: number }[] = [
    { key: 'siteTitle', label: `${t.siteTitle} (PT)`, chars: 25 },
    { key: 'siteTitleEn', label: `${t.siteTitle} (EN)`, chars: 25 },
    { key: 'role', label: 'Role (PT)', chars: 30 },
    { key: 'roleEn', label: 'Role (EN)', chars: 30 },
    { key: 'specialist', label: 'Specialist (PT)', chars: 80 },
    { key: 'specialistEn', label: 'Specialist (EN)', chars: 80 },
    { key: 'hello', label: `${t.helloText} (PT)`, chars: 120 },
    { key: 'helloEn', label: `${t.helloText} (EN)`, chars: 120 },
    { key: 'letsCreate', label: `${t.letsCreateText} (PT)`, chars: 80 },
    { key: 'letsCreateEn', label: `${t.letsCreateText} (EN)`, chars: 80 },
    { key: 'navHome', label: 'Nav Home (PT)', chars: 10 },
    { key: 'navHomeEn', label: 'Nav Home (EN)', chars: 10 },
    { key: 'navAbout', label: 'Nav Sobre (PT)', chars: 10 },
    { key: 'navAboutEn', label: 'Nav About (EN)', chars: 10 },
    { key: 'navContact', label: 'Nav Contato (PT)', chars: 10 },
    { key: 'navContactEn', label: 'Nav Contact (EN)', chars: 10 },
    { key: 'skillsTitle', label: lang === 'pt' ? 'Título Habilidades (PT)' : 'Skills Title (PT)', chars: 35 },
    { key: 'skillsTitleEn', label: lang === 'pt' ? 'Título Habilidades (EN)' : 'Skills Title (EN)', chars: 35 },
    { key: 'educationTitle', label: lang === 'pt' ? 'Título Formação (PT)' : 'Education Title (PT)', chars: 30 },
    { key: 'educationTitleEn', label: lang === 'pt' ? 'Título Formação (EN)' : 'Education Title (EN)', chars: 30 },
    { key: 'experiencesTitle', label: lang === 'pt' ? 'Título Experiências (PT)' : 'Experiences Title (PT)', chars: 25 },
    { key: 'experiencesTitleEn', label: lang === 'pt' ? 'Título Experiências (EN)' : 'Experiences Title (EN)', chars: 25 },
    { key: 'dragHint', label: lang === 'pt' ? 'Dica de arrastar (PT)' : 'Drag Hint (PT)', chars: 25 },
    { key: 'dragHintEn', label: lang === 'pt' ? 'Dica de arrastar (EN)' : 'Drag Hint (EN)', chars: 25 },
    { key: 'bioDefault', label: 'Bio Padrão (PT)', chars: 200 },
    { key: 'bioDefaultEn', label: 'Bio Default (EN)', chars: 200 },
    { key: 'contactEmail', label: 'Email', chars: 40 },
    { key: 'contactLinkedin', label: 'LinkedIn', chars: 50 },
    { key: 'contactInstagram', label: 'Instagram', chars: 30 },
    { key: 'contactBehance', label: 'Behance', chars: 50 },
  ];

  // Color fields config
  const colorFields: { key: keyof Theme; label: string }[] = [
    { key: 'bg', label: t.bg },
    { key: 'fg', label: t.fg },
    { key: 'accent', label: t.accent_label },
    { key: 'accent2', label: t.accent2_label },
    { key: 'border', label: t.border_label },
    { key: 'muted', label: t.muted_label },
    { key: 'titleColor', label: lang === 'pt' ? 'Cor do Título' : 'Title Color' },
    { key: 'subtitleColor', label: lang === 'pt' ? 'Cor do Subtítulo' : 'Subtitle Color' },
    { key: 'cardBg', label: lang === 'pt' ? 'Fundo dos Cards' : 'Card Background' },
    { key: 'tagBg', label: lang === 'pt' ? 'Fundo das Tags' : 'Tag Background' },
    { key: 'tagText', label: lang === 'pt' ? 'Texto das Tags' : 'Tag Text' },
    { key: 'hoverBorder', label: lang === 'pt' ? 'Borda Hover' : 'Hover Border' },
    { key: 'linkColor', label: lang === 'pt' ? 'Cor dos Links' : 'Link Color' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-8" style={{ backgroundColor: `${theme.bg}80` }} onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-border overflow-hidden backdrop-blur-2xl" style={{ backgroundColor: `${theme.bg}cc` }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border flex-shrink-0">
          <h2 className="font-display text-[11px] tracking-[0.2em] uppercase text-accent">— {t.admin} —</h2>
          <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center cursor-pointer text-fg transition-colors hover:border-accent hover:text-accent" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-8 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`font-display text-[10px] tracking-[0.15em] uppercase py-4 px-6 border-b-2 transition-colors ${activeTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-fg'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'projects' && (
            <div className="max-w-2xl">
              <h3 className="font-display text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-6">
                {editingProjectId ? (lang === 'pt' ? 'Editando Projeto' : 'Editing Project') : t.addProject}
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>{t.projectName} (PT)</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Branding Studio X" className={inputClass} />
                  <span className={hintClass}>~30 caracteres</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>{t.projectName} (EN)</label>
                  <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Ex: Branding Studio X" className={inputClass} />
                  <span className={hintClass}>~30 caracteres</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>{t.projectDesc} (PT)</label>
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descreva o projeto..." className={`${inputClass} min-h-[80px] resize-y`} />
                  <span className={hintClass}>~120 caracteres</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>{t.projectDesc} (EN)</label>
                  <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder="Describe the project..." className={`${inputClass} min-h-[80px] resize-y`} />
                  <span className={hintClass}>~120 caracteres</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>{t.tags}</label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {TAG_OPTIONS.map((tag) => (
                      <div key={tag} onClick={() => toggleTag(tag)} className={`font-body text-[11px] tracking-wide uppercase px-3 py-1.5 rounded-full border border-border cursor-pointer transition-all ${selectedTags.includes(tag) ? 'bg-accent text-bg border-accent font-semibold' : 'text-muted-foreground hover:text-fg'}`}>
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>{t.thumb}</label>
                  <div className="border border-dashed border-border rounded-xl p-7 text-center cursor-pointer hover:border-accent transition-all relative">
                    <input type="file" accept="image/*" onChange={handleThumbUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{lang === 'pt' ? 'Clique ou arraste' : 'Click or drag'}<br /><span className="text-accent font-medium">{lang === 'pt' ? 'imagem de capa' : 'cover image'}</span></p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">{lang === 'pt' ? 'Tamanho ideal: 600 × 800 px' : 'Ideal size: 600 × 800 px'}</p>
                  </div>
                  {thumb && (
                    <div className="mt-2.5 relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                      <img src={thumb} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 w-4 h-4 bg-accent2/90 rounded-full flex items-center justify-center cursor-pointer text-fg text-[10px] font-bold" onClick={() => setThumb(null)}>✕</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>{t.images}</label>
                  <div className="border border-dashed border-border rounded-xl p-7 text-center cursor-pointer hover:border-accent transition-all relative">
                    <input type="file" accept="image/*" multiple onChange={handleImagesUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{lang === 'pt' ? 'Clique ou arraste' : 'Click or drag'}<br /><span className="text-accent font-medium">{lang === 'pt' ? 'múltiplas imagens' : 'multiple images'}</span></p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">{lang === 'pt' ? 'Tamanho ideal: 1200 × 800 px' : 'Ideal size: 1200 × 800 px'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 mt-2.5">
                    {images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                        <img src={img} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 w-4 h-4 bg-accent2/90 rounded-full flex items-center justify-center cursor-pointer text-fg text-[10px] font-bold" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}>✕</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="bg-accent text-bg border-none rounded-lg py-3.5 px-7 font-display text-[10px] font-bold tracking-[0.14em] uppercase cursor-pointer transition-opacity hover:opacity-80 mt-1" onClick={saveProject}>
                    {editingProjectId
                      ? (lang === 'pt' ? 'Salvar Alterações →' : 'Save Changes →')
                      : (lang === 'pt' ? 'Publicar Projeto →' : 'Publish Project →')}
                  </button>
                  {editingProjectId && (
                    <button className="border border-border text-muted-foreground rounded-lg py-3.5 px-7 font-display text-[10px] font-bold tracking-[0.14em] uppercase cursor-pointer transition-opacity hover:opacity-80 mt-1" onClick={clearProjectForm}>
                      {lang === 'pt' ? 'Cancelar' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>

              {/* Published projects list */}
              <h3 className="font-display text-[10px] tracking-[0.18em] uppercase text-muted-foreground mt-10 mb-5">{lang === 'pt' ? 'Projetos Publicados' : 'Published Projects'}</h3>
              <div className="flex flex-col gap-2.5">
                {projects.length === 0 ? (
                  <p className="text-xs text-muted-foreground">{lang === 'pt' ? 'Nenhum projeto publicado ainda.' : 'No projects published yet.'}</p>
                ) : (
                  projects.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-3.5 p-3.5 border border-border rounded-xl transition-colors hover:border-muted">
                      <img src={p.thumb} className="w-12 h-12 rounded-lg object-cover bg-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-[13px] font-normal mb-1 tracking-tight truncate">{p.name}</h4>
                        <p className="text-[11px] text-muted-foreground tracking-wide">{p.images.length} img · {p.tags.slice(0, 2).join(', ') || '—'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button className="w-7 h-7 border border-border rounded-md flex items-center justify-center text-muted-foreground hover:text-fg hover:border-fg transition-colors" onClick={() => moveProject(idx, -1)} title="▲"><ArrowUp size={12} /></button>
                        <button className="w-7 h-7 border border-border rounded-md flex items-center justify-center text-muted-foreground hover:text-fg hover:border-fg transition-colors" onClick={() => moveProject(idx, 1)} title="▼"><ArrowDown size={12} /></button>
                        <button className="w-7 h-7 border border-accent/40 rounded-md flex items-center justify-center text-accent hover:bg-accent/10 transition-colors" onClick={() => editProject(p)} title={t.edit}><Pencil size={12} /></button>
                        <button className="w-7 h-7 border border-accent2/40 rounded-md flex items-center justify-center text-accent2 hover:bg-accent2/10 transition-colors" onClick={() => setProjects((prev) => prev.filter((proj) => proj.id !== p.id))}><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl">
              <h3 className="font-display text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-6">{lang === 'pt' ? 'Foto de Perfil' : 'Profile Photo'}</h3>
              <div className="border border-dashed border-border rounded-xl p-7 text-center cursor-pointer hover:border-accent transition-all relative mb-10">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                <p className="text-[13px] text-muted-foreground">{lang === 'pt' ? 'Clique para enviar foto' : 'Click to upload photo'}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-2">{lang === 'pt' ? 'Tamanho ideal: 500 × 500 px' : 'Ideal size: 500 × 500 px'}</p>
              </div>

              <h3 className="font-display text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-6">{t.addSkill}</h3>
              <div className="flex flex-col gap-3 mb-8">
                <input type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Nome da skill" className={inputClass} />
                <input type="text" value={skillIcon} onChange={(e) => setSkillIcon(e.target.value)} placeholder="Ícone (ex: Ps, Ai)" className={inputClass} />
                <div className="flex gap-3">
                  <input type="text" value={skillColor} onChange={(e) => setSkillColor(e.target.value)} placeholder="Cor do ícone" className={inputClass} />
                  <input type="text" value={skillBg} onChange={(e) => setSkillBg(e.target.value)} placeholder="Cor de fundo" className={inputClass} />
                </div>
                <button className="bg-accent text-bg rounded-lg py-2.5 px-5 font-display text-[10px] font-bold tracking-widest uppercase cursor-pointer hover:opacity-80 w-fit" onClick={saveSkill}>
                  <Plus size={12} className="inline mr-1" />{t.addSkill}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                {skills.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-full text-[11px] text-muted-foreground">
                    {s.name}
                    <button className="text-accent2 hover:text-accent2" onClick={() => setSkills((prev) => prev.filter((sk) => sk.id !== s.id))}><Trash2 size={10} /></button>
                  </div>
                ))}
              </div>

              <h3 className="font-display text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-6">{t.addExp}</h3>
              <div className="flex flex-col gap-3">
                <input type="text" value={expPeriod} onChange={(e) => setExpPeriod(e.target.value)} placeholder="2023 — Presente" className={inputClass} />
                <input type="text" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder="Título (PT)" className={inputClass} />
                <input type="text" value={expTitleEn} onChange={(e) => setExpTitleEn(e.target.value)} placeholder="Title (EN)" className={inputClass} />
                <input type="text" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="Empresa" className={inputClass} />
                <textarea value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="Descrição (PT)" className={`${inputClass} min-h-[60px] resize-y`} />
                <textarea value={expDescEn} onChange={(e) => setExpDescEn(e.target.value)} placeholder="Description (EN)" className={`${inputClass} min-h-[60px] resize-y`} />
                <button className="bg-accent text-bg rounded-lg py-2.5 px-5 font-display text-[10px] font-bold tracking-widest uppercase cursor-pointer hover:opacity-80 w-fit" onClick={saveExperience}>
                  <Plus size={12} className="inline mr-1" />{t.addExp}
                </button>
              </div>

              <div className="flex flex-col gap-2.5 mt-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between p-3 border border-border rounded-xl">
                    <div>
                      <div className="font-display text-[12px] tracking-tight">{exp.title}</div>
                      <div className="text-[10px] text-muted-foreground">{exp.company} · {exp.period}</div>
                    </div>
                    <button className="text-accent2" onClick={() => setExperiences((prev) => prev.filter((e) => e.id !== exp.id))}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="max-w-xl">
              <h3 className="font-display text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-6">{t.colors}</h3>
              <div className="grid grid-cols-2 gap-4">
                {colorFields.map((item) => (
                  <div key={item.key} className="flex flex-col gap-2">
                    <label className={labelClass}>{item.label}</label>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setColorTarget(colorTarget === item.key ? null : item.key)}>
                      <div className="w-8 h-8 rounded-lg border border-border" style={{ backgroundColor: theme[item.key] }} />
                      <span className="text-xs text-muted-foreground font-mono">{theme[item.key]}</span>
                    </div>
                    {colorTarget === item.key && (
                      <div className="mt-2">
                        <HexColorPicker color={theme[item.key]} onChange={(color) => setTheme((prev) => ({ ...prev, [item.key]: color }))} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'globalTexts' && (
            <div className="max-w-2xl flex flex-col gap-4">
              <h3 className="font-display text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">{t.globalTexts}</h3>
              {globalTextFields.map((item) => (
                <div key={item.key} className="flex flex-col gap-1">
                  <label className={labelClass}>{item.label}</label>
                  {item.chars > 100 ? (
                    <textarea
                      value={globalSettings[item.key]}
                      onChange={(e) => setGlobalSettings((prev) => ({ ...prev, [item.key]: e.target.value }))}
                      className={`${inputClass} min-h-[80px] resize-y`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={globalSettings[item.key]}
                      onChange={(e) => setGlobalSettings((prev) => ({ ...prev, [item.key]: e.target.value }))}
                      className={inputClass}
                    />
                  )}
                  <span className={hintClass}>~{item.chars} caracteres</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
