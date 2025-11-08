import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Project } from '../types';
import { selectBestProjects } from '../services/geminiService';
import ProjectCard from './ProjectCard';
import { Award, BrainCircuit } from 'lucide-react';

interface BestProjectsProps {
  allProjects: Project[];
  onView: (id: string) => void;
}

interface BestProjectResult {
  classKey: string;
  topProjects: (Project | undefined)[];
  justifications: { projectId: string; justification: string }[];
  error?: string;
}

const BestProjects: React.FC<BestProjectsProps> = ({ allProjects, onView }) => {
  const [bestProjectsByClass, setBestProjectsByClass] = useState<BestProjectResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { previousMonthName, yearOfPreviousMonth } = useMemo(() => {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return {
      previousMonthName: previousMonth.toLocaleString('default', { month: 'long' }),
      yearOfPreviousMonth: previousMonth.getFullYear(),
    };
  }, []);

  const fetchBestProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const now = new Date();
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonth = lastMonthDate.getMonth();
      const yearOfLastMonth = lastMonthDate.getFullYear();

      const projectsFromLastMonth = allProjects.filter(p => {
        const d = p.submissionDate;
        return d.getMonth() === lastMonth && d.getFullYear() === yearOfLastMonth;
      });

      if (projectsFromLastMonth.length === 0) {
        setBestProjectsByClass([]);
        setIsLoading(false);
        return;
      }

      const projectsByClass = projectsFromLastMonth.reduce((acc, project) => {
        const key = `${project.year} | ${project.department} | Section ${project.section}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(project);
        return acc;
      }, {} as Record<string, Project[]>);

      const results: BestProjectResult[] = [];
      for (const classKey in projectsByClass) {
        const classProjects = projectsByClass[classKey];
        if (classProjects.length > 0) {
           try {
            const topProjectsData = await selectBestProjects(classProjects);
            const topProjectIds = topProjectsData.map(p => p.projectId);
            results.push({
              classKey,
              topProjects: topProjectIds.map(id => allProjects.find(p => p.id === id)),
              justifications: topProjectsData,
            });
          } catch(e) {
             console.error(`Error processing class ${classKey}:`, e);
             results.push({ classKey, topProjects: [], justifications: [], error: `Could not determine best projects for this class.` });
          }
        }
      }
      setBestProjectsByClass(results.sort((a,b) => a.classKey.localeCompare(b.classKey)));
    } catch (err) {
      console.error("Failed to fetch best projects:", err);
      setError("An error occurred while selecting the best projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProjects]);

  useEffect(() => {
    fetchBestProjects();
  }, [fetchBestProjects]);

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed">
      <BrainCircuit size={48} className="text-[#192F59] animate-pulse" />
      <h3 className="text-xl font-semibold text-gray-700 mt-4">Analyzing Projects...</h3>
      <p className="text-gray-500 mt-2">Our AI is selecting the most innovative projects from last month. Please wait.</p>
    </div>
  );
  
  const renderEmptyState = () => (
     <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-700">No Projects Submitted Last Month</h3>
        <p className="text-gray-500 mt-2">There's no data to select the "Projects of the Month". Check back next month!</p>
      </div>
  )

  if (isLoading) return renderLoading();
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if(bestProjectsByClass.length === 0) return renderEmptyState();

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <div className="flex items-center">
            <Award size={32} className="text-[#192F59] mr-4"/>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Top Projects for {previousMonthName} {yearOfPreviousMonth}
              </h2>
              <p className="text-gray-600">Selected by our AI algorithm for innovation and impact.</p>
            </div>
        </div>
      </div>
      
      <div className="space-y-12">
        {bestProjectsByClass.map(result => (
          <div key={result.classKey}>
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-[#192F59] pb-2 mb-6">
              {result.classKey}
            </h3>
            {result.error && <p className="text-red-500">{result.error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {result.topProjects.map((project, index) => {
                if (!project) return null;
                const justification = result.justifications.find(j => j.projectId === project.id)?.justification;
                return (
                  <div key={project.id} className="flex flex-col">
                    <ProjectCard project={project} currentUserRegNo={''} currentUserFacultyName={''} onView={onView} />
                    {justification && (
                      <div className="bg-gray-50 border-t-4 border-[#192F59] p-4 mt-[-1px] rounded-b-xl">
                        <p className="text-sm text-gray-900"><strong className="font-semibold">AI Justification:</strong> {justification}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestProjects;
