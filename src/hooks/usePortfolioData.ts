import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Project, Skill, Experience, EditableTexts, Theme, GlobalSettings, SocialLink } from '../types/portfolio';
import {
  DEFAULT_THEME,
  DEFAULT_GLOBAL_SETTINGS,
  DEFAULT_SKILLS,
  DEFAULT_EXPERIENCES,
  DEFAULT_PROJECTS,
  DEFAULT_SOCIAL_LINKS,
} from '../data/defaults';

/* ── DB ↔ TS mappers ─────────────────────────────────────────── */

function dbToProject(r: any): Project {
  return {
    id: r.id,
    name: r.name,
    name_en: r.name_en ?? undefined,
    description: r.description,
    description_en: r.description_en ?? undefined,
    tags: r.tags ?? [],
    thumb: r.thumb,
    images: r.images ?? [],
  };
}

function projectToDb(p: Project, sortOrder: number) {
  return {
    id: p.id,
    name: p.name,
    name_en: p.name_en ?? null,
    description: p.description,
    description_en: p.description_en ?? null,
    tags: p.tags,
    thumb: p.thumb,
    images: p.images,
    sort_order: sortOrder,
  };
}

function dbToSkill(r: any): Skill {
  return {
    id: r.id,
    name: r.name,
    icon: r.icon,
    color: r.color,
    bg: r.bg,
    special: r.special ?? false,
    iconUrl: r.icon_url ?? undefined,
  };
}

function skillToDb(s: Skill, sortOrder: number) {
  return {
    id: s.id,
    name: s.name,
    icon: s.icon,
    color: s.color,
    bg: s.bg,
    special: s.special ?? false,
    icon_url: s.iconUrl ?? null,
    sort_order: sortOrder,
  };
}

function dbToExperience(r: any): Experience {
  return {
    id: r.id,
    period: r.period,
    title: r.title,
    title_en: r.title_en ?? undefined,
    company: r.company,
    desc: r.description,
    desc_en: r.description_en ?? undefined,
  };
}

function experienceToDb(e: Experience, sortOrder: number) {
  return {
    id: e.id,
    period: e.period,
    title: e.title,
    title_en: e.title_en ?? null,
    company: e.company,
    description: e.desc,
    description_en: e.desc_en ?? null,
    sort_order: sortOrder,
  };
}

/* ── Hook ─────────────────────────────────────────────────────── */

export function usePortfolioData() {
  const [loading, setLoading] = useState(true);

  const [projects, setProjectsLocal] = useState<Project[]>(DEFAULT_PROJECTS);
  const [skills, setSkillsLocal] = useState<Skill[]>(DEFAULT_SKILLS);
  const [experiences, setExperiencesLocal] = useState<Experience[]>(DEFAULT_EXPERIENCES);
  const [editableTexts, setEditableTextsLocal] = useState<EditableTexts>({});
  const [userPhoto, setUserPhotoLocal] = useState<string | null>(null);
  const [theme, setThemeLocal] = useState<Theme>(DEFAULT_THEME);
  const [globalSettings, setGlobalSettingsLocal] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS);
  const [socialLinks, setSocialLinksLocal] = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);

  /* ── Load ────────────────────────────────────────────────── */

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [projRes, skillRes, expRes, settRes] = await Promise.all([
          supabase.from('projects').select('*').order('sort_order'),
          supabase.from('skills').select('*').order('sort_order'),
          supabase.from('experiences').select('*').order('sort_order'),
          supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        ]);

        if (cancelled) return;

        // --- Seed if empty ---
        let needsSeed = false;

        if (!projRes.error && projRes.data && projRes.data.length > 0) {
          setProjectsLocal(projRes.data.map(dbToProject));
        } else {
          needsSeed = true;
        }

        if (!skillRes.error && skillRes.data && skillRes.data.length > 0) {
          setSkillsLocal(skillRes.data.map(dbToSkill));
        } else {
          needsSeed = true;
        }

        if (!expRes.error && expRes.data && expRes.data.length > 0) {
          setExperiencesLocal(expRes.data.map(dbToExperience));
        } else {
          needsSeed = true;
        }

        if (!settRes.error && settRes.data) {
          const d = settRes.data as any;
          if (d.theme && Object.keys(d.theme).length > 0) setThemeLocal({ ...DEFAULT_THEME, ...d.theme });
          if (d.global_settings && Object.keys(d.global_settings).length > 0) setGlobalSettingsLocal({ ...DEFAULT_GLOBAL_SETTINGS, ...d.global_settings });
          if (d.social_links && Array.isArray(d.social_links) && d.social_links.length > 0) setSocialLinksLocal(d.social_links);
          if (d.editable_texts && Object.keys(d.editable_texts).length > 0) setEditableTextsLocal(d.editable_texts);
          if (d.user_photo) setUserPhotoLocal(d.user_photo);
        } else {
          needsSeed = true;
        }

        // Seed defaults into DB for first load (requires auth — skip if anon)
        if (needsSeed) {
          seedDefaults();
        }
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  async function seedDefaults() {
    // Insert default projects
    const projInserts = DEFAULT_PROJECTS.map((p, i) => projectToDb(p, i));
    await supabase.from('projects').upsert(projInserts, { onConflict: 'id' });

    // Insert default skills
    const skillInserts = DEFAULT_SKILLS.map((s, i) => skillToDb(s, i));
    await supabase.from('skills').upsert(skillInserts, { onConflict: 'id' });

    // Insert default experiences
    const expInserts = DEFAULT_EXPERIENCES.map((e, i) => experienceToDb(e, i));
    await supabase.from('experiences').upsert(expInserts, { onConflict: 'id' });

    // Insert default settings
    await supabase.from('site_settings').upsert({
      id: 1,
      theme: DEFAULT_THEME as any,
      global_settings: DEFAULT_GLOBAL_SETTINGS as any,
      social_links: DEFAULT_SOCIAL_LINKS as any,
      editable_texts: {} as any,
      user_photo: null,
    }, { onConflict: 'id' });
  }

  /* ── Persist helpers ─────────────────────────────────────── */

  const saveSettings = useCallback(async (patch: {
    theme?: Theme;
    global_settings?: GlobalSettings;
    social_links?: SocialLink[];
    editable_texts?: EditableTexts;
    user_photo?: string | null;
  }) => {
    await supabase.from('site_settings').upsert({
      id: 1,
      ...patch,
      updated_at: new Date().toISOString(),
    } as any, { onConflict: 'id' });
  }, []);

  /* ── Public setters (update local + DB) ──────────────────── */

  const setProjects: React.Dispatch<React.SetStateAction<Project[]>> = useCallback((action) => {
    setProjectsLocal((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      // Persist to DB
      const rows = next.map((p, i) => projectToDb(p, i));
      supabase.from('projects').upsert(rows as any, { onConflict: 'id' }).then();
      return next;
    });
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setProjectsLocal((prev) => prev.filter((p) => p.id !== id));
    await supabase.from('projects').delete().eq('id', id);
  }, []);

  const setSkills: React.Dispatch<React.SetStateAction<Skill[]>> = useCallback((action) => {
    setSkillsLocal((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      const rows = next.map((s, i) => skillToDb(s, i));
      supabase.from('skills').upsert(rows as any, { onConflict: 'id' }).then();
      return next;
    });
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    setSkillsLocal((prev) => prev.filter((s) => s.id !== id));
    await supabase.from('skills').delete().eq('id', id);
  }, []);

  const setExperiences: React.Dispatch<React.SetStateAction<Experience[]>> = useCallback((action) => {
    setExperiencesLocal((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      const rows = next.map((e, i) => experienceToDb(e, i));
      supabase.from('experiences').upsert(rows as any, { onConflict: 'id' }).then();
      return next;
    });
  }, []);

  const deleteExperience = useCallback(async (id: string) => {
    setExperiencesLocal((prev) => prev.filter((e) => e.id !== id));
    await supabase.from('experiences').delete().eq('id', id);
  }, []);

  const setTheme: React.Dispatch<React.SetStateAction<Theme>> = useCallback((action) => {
    setThemeLocal((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveSettings({ theme: next });
      return next;
    });
  }, [saveSettings]);

  const setGlobalSettings: React.Dispatch<React.SetStateAction<GlobalSettings>> = useCallback((action) => {
    setGlobalSettingsLocal((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveSettings({ global_settings: next });
      return next;
    });
  }, [saveSettings]);

  const setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>> = useCallback((action) => {
    setSocialLinksLocal((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveSettings({ social_links: next });
      return next;
    });
  }, [saveSettings]);

  const setEditableTexts: React.Dispatch<React.SetStateAction<EditableTexts>> = useCallback((action) => {
    setEditableTextsLocal((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveSettings({ editable_texts: next });
      return next;
    });
  }, [saveSettings]);

  const setUserPhoto = useCallback((photo: string | null) => {
    setUserPhotoLocal(photo);
    saveSettings({ user_photo: photo });
  }, [saveSettings]);

  return {
    loading,
    projects, setProjects, deleteProject,
    skills, setSkills, deleteSkill,
    experiences, setExperiences, deleteExperience,
    editableTexts, setEditableTexts,
    userPhoto, setUserPhoto,
    theme, setTheme,
    globalSettings, setGlobalSettings,
    socialLinks, setSocialLinks,
  };
}
