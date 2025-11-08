import React, { useState } from 'react';
import { Project, IdeaGenerationResult } from '../types';
import { generateProjectIdeas } from '../services/geminiService';
import { DEPARTMENTS } from '../constants';
import { Lightbulb, Users, Cpu, Rocket, BrainCircuit, Search, AlertTriangle } from 'lucide-react';
import ProjectCard from './ProjectCard';

interface ProjectIdeaGeneratorProps {
  allProjects: Project[];
  onView: (id: string) => void;
  currentUserRegNo: string;
}

const ProjectIdeaGenerator: React.FC<ProjectIdeaGeneratorProps> = ({ allProjects, onView, currentUserRegNo }) => {
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IdeaGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills.trim() || !interests.trim()) {
      setError('Please tell us about your skills and interests.');
      return;
    }
    
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const ideas = await generateProjectIdeas({ skills, interests, department }, allProjects);
      setResults(ideas);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Rocket size={28} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI Idea Hub</h2>
            <p className="text-gray-600">Discover new project ideas and find teams to collaborate with, powered by AI.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Your Skills</label>
              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., Python, React, Data Analysis"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">Your Interests</label>
              <input
                id="interests"
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., Healthcare, Gaming, IoT"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Your Department</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="block w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] sm:text-sm"
            >
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#192F59] rounded-lg shadow-md hover:bg-[#101f3c] focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? <><BrainCircuit size={18} className="animate-spin" /> Generating...</> : <><Search size={18} /> Find My Next Project</>}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex">
                <div className="flex-shrink-0"><AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" /></div>
                <div className="ml-3"><p className="text-sm text-red-700">{error}</p></div>
            </div>
        </div>
      )}
      
      {isLoading && (
         <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <BrainCircuit size={48} className="text-[#192F59] animate-pulse" />
            <h3 className="text-xl font-semibold text-gray-700 mt-4">Brewing Up Some Ideas...</h3>
            <p className="text-gray-500 mt-2">Our AI is analyzing your profile to find the perfect project match. This may take a moment.</p>
        </div>
      )}
      
      {results && (
        <div className="space-y-12">
          {results.newIdeas.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Lightbulb className="text-yellow-500" /> New Project Ideas For You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.newIdeas.map((idea, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-bold text-gray-900">{idea.title}</h4>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyColors[idea.difficulty]}`}>{idea.difficulty}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed flex-grow mb-4">{idea.description}</p>
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Cpu size={14} /> Suggested Tech</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {idea.technologies.map((tech, i) => (
                           <span key={i} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.collaborationSuggestions.length > 0 && (
             <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Users className="text-green-500" /> Existing Projects to Join</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {results.collaborationSuggestions.map((suggestion, index) => {
                   const project = allProjects.find(p => p.id === suggestion.projectId);
                   if (!project) return null;
                   return (
                     <div key={index}>
                       <div className="bg-emerald-50 border-l-4 border-emerald-400 p-3 rounded-t-lg">
                        <p className="text-sm text-emerald-900"><strong className="font-semibold">AI Recommendation:</strong> {suggestion.reason}</p>
                       </div>
                       <ProjectCard project={project} currentUserRegNo={currentUserRegNo} onView={onView} />
                     </div>
                   );
                 })}
              </div>
            </div>
          )}
          
           {(results.newIdeas.length === 0 && results.collaborationSuggestions.length === 0) && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-700">No specific recommendations found.</h3>
                <p className="text-gray-500 mt-2">Try broadening your skills or interests for more results!</p>
              </div>
           )}
        </div>
      )}

    </div>
  );
};

export default ProjectIdeaGenerator;
