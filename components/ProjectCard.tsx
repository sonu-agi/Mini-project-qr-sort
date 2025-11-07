import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { Github, FileText, Share2, Calendar, Pencil, Users, UserCheck, Presentation, FileSpreadsheet, File, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ShareModal from './ShareModal';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  showQrOnHover?: boolean;
  currentUserRegNo: string;
}

const getFileIcon = (fileName: string): React.ReactNode => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
        case 'doc':
        case 'docx':
            return <FileText size={16} className="mr-2 flex-shrink-0" />;
        case 'ppt':
        case 'pptx':
            return <Presentation size={16} className="mr-2 flex-shrink-0" />;
        case 'xls':
        case 'xlsx':
            return <FileSpreadsheet size={16} className="mr-2 flex-shrink-0" />;
        default:
            return <File size={16} className="mr-2 flex-shrink-0" />;
    }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, showQrOnHover, currentUserRegNo }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const {
    id,
    projectTitle,
    students,
    description,
    githubLink,
    publicationLink,
    documents,
    technologies,
    skills,
    keywords,
    year,
    department,
    submissionDate,
    faculty,
    projectType,
  } = project;
  
  const canModify = useMemo(() => {
    if (!currentUserRegNo) return false;
    return project.students.some(s => s.registrationNumber.toUpperCase() === currentUserRegNo.toUpperCase());
  }, [project.students, currentUserRegNo]);

  const formattedDate = submissionDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  
  const studentNames = students.map(s => s.name).join(', ');

  const projectDetailsString = JSON.stringify({
    id: id,
    title: project.projectTitle,
    students: project.students.map(s => `${s.name} (${s.registrationNumber})`),
    description: project.description,
    github: project.githubLink,
    publication: project.publicationLink,
    documents: project.documents?.map(d => ({ name: d.name, url: d.url })) || [],
    technologies: project.technologies || [],
    skills: project.skills || [],
    keywords: project.keywords || []
  }, null, 2);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col h-full overflow-hidden border border-gray-200 relative group">
        {showQrOnHover && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-xl text-center">
                    <h4 className="text-base font-bold text-gray-800 mb-3 max-w-[150px] break-words">{projectTitle}</h4>
                    <QRCodeSVG value={projectDetailsString} size={150} />
              </div>
          </div>
        )}
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{department}</span>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${projectType === 'College' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>{projectType}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{projectTitle}</h3>
          
          <div className="text-sm font-medium text-gray-600 mb-4 flex items-start">
            <Users size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>By {studentNames} (Year: {year})</p>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed flex-grow mb-4">{description}</p>
          
          {technologies && technologies.length > 0 && (
            <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Technology/Components Used</h4>
                <div className="flex flex-wrap gap-1.5">
                    {technologies.map((tech, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">{tech}</span>
                    ))}
                </div>
            </div>
          )}
          
          {skills && skills.length > 0 && (
            <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
          )}

          {keywords && keywords.length > 0 && (
              <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                      {keywords.map((keyword, index) => (
                          <span key={index} className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-1 rounded-full">{keyword}</span>
                      ))}
                  </div>
              </div>
          )}

        </div>
        <div className="px-6 pb-6 mt-auto">
           {faculty.length > 0 && (
            <div className="flex items-start text-xs text-gray-500 mb-4">
              <UserCheck size={14} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>Advisor(s): {faculty.map(f => f.name).join(', ')}</p>
            </div>
           )}
          {documents && documents.length > 0 && (
            <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">Project Documents</h4>
                <div className="flex flex-col space-y-2">
                {documents.map((doc, index) => (
                    <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                    {getFileIcon(doc.name)}
                    <span className="truncate">{doc.name}</span>
                    </a>
                ))}
                </div>
            </div>
          )}
          <div className="flex items-center text-xs text-gray-500 mb-4">
            <Calendar size={14} className="mr-2"/>
            Submitted: {formattedDate}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {githubLink && ( <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors"><Github size={22} /></a> )}
              {publicationLink && ( <a href={publicationLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors"><FileText size={22} /></a> )}
            </div>
            <div className="flex items-center space-x-2">
              {canModify && onEdit && (
                <button
                  onClick={() => onEdit(project)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              )}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                <Share2 size={14} />
                Share
              </button>
              {canModify && onDelete && (
                <button
                  onClick={() => onDelete(project.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isShareModalOpen && (
        <ShareModal project={project} onClose={() => setIsShareModalOpen(false)} />
      )}
    </>
  );
};

export default ProjectCard;