export interface Project {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  tags: string[];
  thumb: string;
  images: string[];
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  special?: boolean;
}

export interface Experience {
  id: string;
  period: string;
  title: string;
  title_en?: string;
  company: string;
  desc: string;
  desc_en?: string;
}

export interface EditableTexts {
  [key: string]: string;
}

export interface Theme {
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
  border: string;
  muted: string;
}

export interface GlobalSettings {
  siteTitle: string;
  siteTitleEn: string;
  role: string;
  roleEn: string;
  specialist: string;
  specialistEn: string;
  hello: string;
  helloEn: string;
  letsCreate: string;
  letsCreateEn: string;
}

export type PageId = 'home' | 'about' | 'contact';
export type Lang = 'pt' | 'en';
