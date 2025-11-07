export interface Student {
  name: string;
  registrationNumber: string;
  year: string;
  department: string;
  section: string;
}

export interface Faculty {
  name: string;
  department: string;
}

export type ProjectType = 'Personal' | 'College';

export interface DocumentFile {
  name: string;
  url: string;
}

export interface Project {
  id: string;
  students: Student[];
  projectTitle: string;
  description: string;
  githubLink?: string;
  publicationLink?: string;
  documents?: DocumentFile[];
  technologies?: string[];
  skills?: string[];
  keywords?: string[];
  // Primary classification for filtering
  year: string;
  department: string;
  section: string;
  submissionDate: Date;
  faculty: Faculty[];
  projectType: ProjectType;
}

export interface FilterOptions {
  year: string;
  department: string;
  section: string;
}

export type SortOption = 'newest' | 'oldest' | 'title';

export enum Tab {
    ALL_PROJECTS = 'All Projects',
    RECENT = 'Recent Projects',
    BEST_PROJECTS = "Projects of the Month"
}