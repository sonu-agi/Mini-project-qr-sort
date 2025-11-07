import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Project, FilterOptions, Tab, SortOption } from './types';
import { MOCK_PROJECTS } from './constants';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import FilterControls from './components/FilterControls';
import AddProjectForm from './components/AddProjectForm';
import BestProjects from './components/BestProjects';
import Tabs from './components/Tabs';

const filterAndSortProjects = (
  projects: Project[],
  filters: FilterOptions,
  searchTerm: string,
  sortOption: SortOption
): Project[] => {
  const lowercasedSearchTerm = searchTerm.toLowerCase();

  const filtered = projects.filter(p => {
    // Academic filters
    const academicFilterPass =
      (filters.year === 'all' || p.year === filters.year) &&
      (filters.department === 'all' || p.department === filters.department) &&
      (filters.section === 'all' || p.section === filters.section);

    if (!academicFilterPass) return false;

    // Search filter
    if (lowercasedSearchTerm) {
      const searchIn = [
        p.projectTitle,
        p.description,
        ...(p.keywords || []),
        ...(p.technologies || []),
        ...(p.skills || []),
      ].join(' ').toLowerCase();
      return searchIn.includes(lowercasedSearchTerm);
    }
    
    return true;
  });

  // Sorting
  const sorted = [...filtered];
  switch (sortOption) {
    case 'newest':
      return sorted.sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime());
    case 'oldest':
      return sorted.sort((a, b) => a.submissionDate.getTime() - b.submissionDate.getTime());
    case 'title':
      return sorted.sort((a, b) => a.projectTitle.localeCompare(b.projectTitle));
    default:
      return sorted;
  }
};


const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [filters, setFilters] = useState<FilterOptions>({
    year: 'all',
    department: 'all',
    section: 'all',
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ALL_PROJECTS);
  const [showQrOnHover, setShowQrOnHover] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleOpenAddForm = () => {
    setEditingProject(null);
    setIsFormVisible(true);
  };

  const handleOpenEditForm = (project: Project) => {
    setEditingProject(project);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingProject(null);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>, id?: string) => {
    if (id) {
      // Editing existing project
      setProjects(projects.map(p => p.id === id ? { ...projects.find(pr => pr.id === id)!, ...projectData } : p));
    } else {
      // Adding new project
      setProjects(prev => [
        {
          ...projectData,
          id: String(prev.length + 1),
        },
        ...prev,
      ]);
      setActiveTab(Tab.ALL_PROJECTS);
    }
    handleCloseForm();
  };
  
  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(prevProjects => prevProjects.filter(p => p.id !== id));
    }
  };

  const sortedAndFilteredProjects = useMemo(() => {
    return filterAndSortProjects(projects, filters, searchTerm, sortOption);
  }, [projects, filters, searchTerm, sortOption]);

  const recentProjects = useMemo(() => {
    return [...projects].sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime()).slice(0, 9);
  }, [projects]);
  
  const TABS = [Tab.ALL_PROJECTS, Tab.RECENT, Tab.BEST_PROJECTS];

  const renderContent = useCallback(() => {
    switch(activeTab) {
      case Tab.ALL_PROJECTS:
        return (
          <>
            <FilterControls filters={filters} setFilters={setFilters} sortOption={sortOption} setSortOption={setSortOption} />
            <ProjectList projects={sortedAndFilteredProjects} onEdit={handleOpenEditForm} onDelete={handleDeleteProject} showQrOnHover={showQrOnHover} />
          </>
        );
      case Tab.RECENT:
        return <ProjectList projects={recentProjects} onEdit={handleOpenEditForm} onDelete={handleDeleteProject} showQrOnHover={showQrOnHover} />;
      case Tab.BEST_PROJECTS:
        return <BestProjects allProjects={projects} />;
      default:
        return null;
    }
  }, [activeTab, filters, sortedAndFilteredProjects, recentProjects, projects, showQrOnHover, sortOption]);

  return (
    <div className="min-h-screen">
      <Header 
        onAddProjectClick={handleOpenAddForm} 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        theme={theme}
        setTheme={setTheme}
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Student Project Showcase</h1>
            <p className="text-gray-600 dark:text-gray-400">Explore, share, and get inspired by projects from our talented students.</p>
          </div>
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border dark:border-gray-700 flex-shrink-0">
            <label htmlFor="qr-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              Show QR on Hover
            </label>
            <button
              role="switch"
              aria-checked={showQrOnHover}
              id="qr-toggle"
              onClick={() => setShowQrOnHover(!showQrOnHover)}
              className={`${
                  showQrOnHover ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
            >
              <span
                aria-hidden="true"
                className={`${
                showQrOnHover ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>
        
        <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>

      {isFormVisible && (
        <AddProjectForm 
          onSave={handleSaveProject}
          onClose={handleCloseForm}
          projectToEdit={editingProject}
        />
      )}
    </div>
  );
};

export default App;