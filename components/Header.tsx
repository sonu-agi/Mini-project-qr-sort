import React from 'react';
import { PlusCircle, Search, ExternalLink, Briefcase } from 'lucide-react';
import { JIT_LOGO_BASE64 } from '../assets/jit_logo';

interface HeaderProps {
  onAddProjectClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddProjectClick, searchTerm, onSearchChange }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-30 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <div className="flex items-center space-x-4 flex-shrink-0">
            <img 
              src={JIT_LOGO_BASE64}
              alt="Jeppiaar Institute of Technology Logo"
              className="h-14"
            />
            <span className="hidden lg:block text-xl font-bold text-gray-800">Jeppiaar Institute of Technology</span>
          </div>

          <div className="flex-1 min-w-0 px-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#192F59] focus:border-[#192F59] sm:text-sm"
                placeholder="Search by title, description, keyword..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <a
              href="https://jitsriperumbudur.org/studentslogin/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-[#192F59] bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2 transition-all duration-200 flex-shrink-0"
            >
                <ExternalLink size={16} />
                <span className="hidden sm:inline">Student Portal</span>
            </a>
             <a
              href="https://jitsriperumbudur.org/stafflogin/login.php?done=/stafflogin/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-[#192F59] bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2 transition-all duration-200 flex-shrink-0"
            >
                <Briefcase size={16} />
                <span className="hidden sm:inline">Faculty Portal</span>
            </a>
            <button
              onClick={onAddProjectClick}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#192F59] rounded-lg shadow-md hover:bg-[#101f3c] focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2 transition-all duration-200 flex-shrink-0"
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline">Add Project</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;