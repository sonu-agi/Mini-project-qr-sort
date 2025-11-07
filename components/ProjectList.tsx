import React from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  showQrOnHover?: boolean;
  currentUserRegNo: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit, onDelete, showQrOnHover, currentUserRegNo }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-700">No Projects Found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or check back later!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} showQrOnHover={showQrOnHover} currentUserRegNo={currentUserRegNo} />
      ))}
    </div>
  );
};

export default ProjectList;