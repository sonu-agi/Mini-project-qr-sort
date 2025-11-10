import React, { useState, useMemo, useCallback } from 'react';
import { Project, FilterOptions, Tab, SortOption } from './types';
import { MOCK_PROJECTS } from './constants';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import FilterControls from './components/FilterControls';
import AddProjectForm from './components/AddProjectForm';
import BestProjects from './components/BestProjects';
import Tabs from './components/Tabs';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import ProjectIdeaGenerator from './components/ProjectIdeaGenerator';
import FloatingQrTools from './components/FloatingQrTools';

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
      (filters.section === 'all' || p.section === filters.section) &&
      (filters.status === 'all' || p.status === filters.status) &&
      (filters.category === 'all' || p.category === filters.category);


    if (!academicFilterPass) return false;

    // Search filter
    if (lowercasedSearchTerm) {
      const searchIn = [
        p.projectTitle,
        p.description,
        p.category,
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
    status: 'all',
    category: 'all',
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ALL_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [currentUserRegNo, setCurrentUserRegNo] = useState<string>('');
  const [currentUserFacultyName, setCurrentUserFacultyName] = useState<string>('');
  const [loginInput, setLoginInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [viewedSession, setViewedSession] = useState(new Set<string>());

  const handleIncrementViewCount = useCallback((projectId: string) => {
    if (viewedSession.has(projectId)) return;

    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === projectId ? { ...p, viewCount: (p.viewCount || 0) + 1 } : p
      )
    );
    
    setViewedSession(prevSet => {
        const newSet = new Set(prevSet);
        newSet.add(projectId);
        return newSet;
    });
  }, [viewedSession]);

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
          id: `proj_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`,
          viewCount: 0,
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
  
  const handleLogin = () => {
    // For demo purposes, any password is "correct" if it's not empty
    if (loginInput.trim() && passwordInput.trim()) {
      const input = loginInput.trim();
      // Simple check to differentiate between faculty name and student reg no
      if (isNaN(parseInt(input.charAt(0)))) {
        setCurrentUserFacultyName(input);
        setCurrentUserRegNo('');
      } else {
        setCurrentUserRegNo(input.toUpperCase());
        setCurrentUserFacultyName('');
      }
    } else {
      alert("Please enter both username and password.");
    }
  };

  const handleLogout = () => {
      setCurrentUserRegNo('');
      setLoginInput('');
  };

  const sortedAndFilteredProjects = useMemo(() => {
    return filterAndSortProjects(projects, filters, searchTerm, sortOption);
  }, [projects, filters, searchTerm, sortOption]);

  const recentProjects = useMemo(() => {
    return [...projects].sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime()).slice(0, 9);
  }, [projects]);
  
  const mostViewedProjects = useMemo(() => {
    return [...projects].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 9);
  }, [projects]);
  
  const TABS = [Tab.ALL_PROJECTS, Tab.RECENT, Tab.MOST_VIEWED, Tab.BEST_PROJECTS, Tab.AI_IDEA_HUB];

  const renderContent = useCallback(() => {
    switch(activeTab) {
      case Tab.ALL_PROJECTS:
        return (
          <>
            <FilterControls filters={filters} setFilters={setFilters} sortOption={sortOption} setSortOption={setSortOption} />
            <ProjectList projects={sortedAndFilteredProjects} onEdit={handleOpenEditForm} onDelete={handleDeleteProject} currentUserRegNo={currentUserRegNo} currentUserFacultyName={currentUserFacultyName} onView={handleIncrementViewCount} />
          </>
        );
      case Tab.RECENT:
        return <ProjectList projects={recentProjects} onEdit={handleOpenEditForm} onDelete={handleDeleteProject} currentUserRegNo={currentUserRegNo} currentUserFacultyName={currentUserFacultyName} onView={handleIncrementViewCount} />;
      case Tab.MOST_VIEWED:
        return <ProjectList projects={mostViewedProjects} onEdit={handleOpenEditForm} onDelete={handleDeleteProject} currentUserRegNo={currentUserRegNo} currentUserFacultyName={currentUserFacultyName} onView={handleIncrementViewCount} />;
      case Tab.BEST_PROJECTS:
        return <BestProjects allProjects={projects} onView={handleIncrementViewCount} />;
      case Tab.AI_IDEA_HUB:
        return <ProjectIdeaGenerator allProjects={projects} onView={handleIncrementViewCount} currentUserRegNo={currentUserRegNo} />;
      default:
        return null;
    }
  }, [activeTab, filters, sortedAndFilteredProjects, recentProjects, mostViewedProjects, projects, sortOption, currentUserRegNo, currentUserFacultyName, handleIncrementViewCount]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onAddProjectClick={handleOpenAddForm} 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Student Project Showcase</h1>
            <p className="text-gray-600">Explore, share, and get inspired by projects from our talented students.</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-8">
            <div className="flex">
                <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                    <strong>Note for Demo:</strong> This application simulates user permissions. To test the edit/delete functionality, which would normally require a full login, please enter a Registration Number of a student from one of the projects below (e.g., 2106yydddnnn, where yy=year, ddd=dept code, nnn=roll no). This will grant you modification rights for that student's projects only.
                    </p>
                    {!currentUserRegNo && !currentUserFacultyName ? (
                        <div className="mt-3 flex flex-col sm:flex-row gap-2">
                            <input 
                                type="text"
                                value={loginInput}
                                onChange={(e) => setLoginInput(e.target.value)}
                                placeholder="Reg No or Faculty Name"
                                className="block w-full max-w-xs pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#192F59] focus:border-[#192F59] sm:text-sm"
                            />
                            <input 
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                placeholder="Password"
                                className="block w-full max-w-xs pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#192F59] focus:border-[#192F59] sm:text-sm"
                            />
                            <button onClick={handleLogin} className="px-4 py-2 text-sm font-semibold text-white bg-[#192F59] rounded-md hover:bg-[#101f3c]">
                                Login
                            </button>
                        </div>
                    ) : (
                        <div className="mt-3 flex items-center gap-4">
                            <p className="text-sm font-medium text-gray-800">Logged in as: <strong className="text-green-600">{currentUserRegNo || currentUserFacultyName}</strong></p>
                            <button onClick={handleLogout} className="text-sm font-medium text-[#192F59] hover:underline">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
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
          loggedInStudentRegNo={currentUserRegNo}
        />
      )}
      <Chatbot allProjects={projects} />
      <FloatingQrTools />
      <Footer />
    </div>
  );
};

export default App;
