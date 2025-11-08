export interface Student {
  name: string;
  registrationNumber: string;
  year: string;
  department: string;
  section: string;
  contribution?: string;
}

export interface Faculty {
  name: string;
  department: string;
}

export type ProjectType = 'Personal' | 'College';
export type ProjectStatus = 'In Progress' | 'Completed' | 'On Hold';
export type ProjectCategory = 'Web Development' | 'AI / ML' | 'Internet of Things (IoT)' | 'Mobile Development' | 'Hardware & Robotics' | 'Data Science' | 'Other';


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
  status: ProjectStatus;
  category: ProjectCategory;
  viewCount?: number;
}

export interface FilterOptions {
  year: string;
  department: string;
  section: string;
  status: string;
  category: string;
}

export type SortOption = 'newest' | 'oldest' | 'title';

export enum Tab {
    ALL_PROJECTS = 'All Projects',
    RECENT = 'Recent Projects',
    MOST_VIEWED = 'Most Viewed',
    BEST_PROJECTS = "Projects of the Month",
    AI_IDEA_HUB = "AI Idea Hub"
}

// Types for the AI Idea Generator
export interface GeneratedIdea {
  title: string;
  description: string;
  technologies: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CollaborationSuggestion {
  projectId: string;
  reason: string;
}

export interface IdeaGenerationResult {
  newIdeas: GeneratedIdea[];
  collaborationSuggestions: CollaborationSuggestion[];
}