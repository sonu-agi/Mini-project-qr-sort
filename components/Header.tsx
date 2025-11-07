import React from 'react';
import { PlusCircle, Search } from 'lucide-react';

interface HeaderProps {
  onAddProjectClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const JIT_LOGO_BASE64 = "data:image/png;base64,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";

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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by title, description, keyword..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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