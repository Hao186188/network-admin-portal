// src/app/(routes)/about/types/index.ts

import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  image: string;
  code: string;
}

export interface JournalEntry {
  id: number;
  title: string;
  date: string;
  readTime: string;
}

export interface Exploration {
  id: number;
  title: string;
  color: string;
  icon: LucideIcon;
  description: string;
  status: string;
  code: string;
}

export interface StatData {
  label: string;
  value: string;
  desc: string;
  icon: LucideIcon;
  color: string;
}

export interface SocialLink {
  name: string;
  icon: IconType;
  href: string;
  color: string;
  bg: string;
}

export interface QuickLink {
  name: string;
  href: string;
}
