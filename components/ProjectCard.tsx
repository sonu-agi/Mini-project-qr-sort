import React, { useState, useMemo, useEffect } from 'react';
import { Project } from '../types';
import { Github, FileText, Share2, Calendar, Pencil, Users, UserCheck, Presentation, FileSpreadsheet, File, Trash2, Eye, EyeOff, Sparkles, LoaderCircle, CheckCircle, ShieldCheck, X, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ShareModal from './ShareModal';
import { summarizeProject } from '../services/geminiService';

const BASE_URL = 'https://sonu-agi.github.io/Mini-project-qr-sort/';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onVerify?: (id: string, facultyName: string) => void;
  currentUserRegNo: string;
  currentUserFacultyName: string;
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

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, onView, onVerify, currentUserRegNo, currentUserFacultyName }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    id, projectTitle, students, description, githubLink, publicationLink, documents, technologies,
    skills, keywords, year, department, submissionDate, faculty, projectType, status, viewCount, category,
    verified, verifiedBy
  } = project;
  
  useEffect(() => {
    if (onView) onView(id);
  }, [id, onView]);
  
  const canModify = useMemo(() => {
    if (!currentUserRegNo) return false;
    return project.students.some(s => s.registrationNumber.toUpperCase() === currentUserRegNo.toUpperCase());
  }, [project.students, currentUserRegNo]);

  const canVerify = useMemo(() => {
    if (!currentUserFacultyName || !onVerify) return false;
    return project.faculty.some(f => f.name === currentUserFacultyName);
  }, [currentUserFacultyName, project.faculty, onVerify]);


  const formattedDate = submissionDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  
  const projectUrl = `${BASE_URL}?project=${id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(projectUrl).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const statusColorMap = {
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-emerald-100 text-emerald-800',
    'On Hold': 'bg-gray-100 text-gray-800',
  };
  
  const handleGetSummary = async () => {
      if (summary) {
          setSummary(null); // Allows toggling the summary off
          return;
      }
      setIsSummaryLoading(true);
      try {
          const result = await summarizeProject(project);
          setSummary(result);
      } catch (error) {
          setSummary("Failed to generate summary.");
      } finally {
          setIsSummaryLoading(false);
      }
  };


  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden border border-gray-200 relative hover:scale-[1.02]">
        {isQrVisible && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center opacity-100 transition-opacity duration-300 z-20 p-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-xl text-center relative">
                    <button onClick={() => setIsQrVisible(false)} className="absolute -top-3 -right-3 p-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none ring-2 ring-white">
                        <X size={16} />
                    </button>
                    <h4 className="text-base font-bold text-gray-800 mb-3 max-w-[150px] break-words">{projectTitle}</h4>
                    <QRCodeSVG value={projectUrl} size={150} />
                    <button onClick={handleCopyLink} title="Copy project link" className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all">
                        {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                        {copySuccess ? 'Copied!' : 'Copy Link'}
                    </button>
              </div>
          </div>
        )}
        <div className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-3 gap-2 flex-wrap">
            <div className="flex gap-2 flex-wrap items-center">
              <span className="inline-block bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-full">{department}</span>
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${statusColorMap[status]}`}>{status}</span>
              <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-1 rounded-full">{category}</span>
            </div>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${projectType === 'College' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>{projectType}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            {projectTitle}
            {verified && (
              <div className="group relative">
                <ShieldCheck size={20} className="text-green-500 flex-shrink-0" />
                <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Verified by {verifiedBy}
                </span>
              </div>
            )}
          </h3>
          
          <div className="text-sm text-gray-600 mb-4">
            <div className="flex items-center font-medium mb-2">
                <Users size={16} className="mr-2 flex-shrink-0" />
                <p>Team Members (Year: {year})</p>
            </div>
            <ul className="space-y-1.5 pl-4">
                {students.map((student, index) => (
                    <li key={index} className="text-gray-700">
                        <span className="font-semibold">{student.name}</span>
                        {student.contribution && <span className="text-gray-500 italic"> - {student.contribution}</span>}
                    </li>
                ))}
            </ul>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed flex-grow mb-4">{description}</p>
          
          {isSummaryLoading && (
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 flex items-center mb-4">
                <LoaderCircle size={16} className="mr-2 animate-spin"/>
                Generating AI summary...
            </div>
          )}

          {summary && !isSummaryLoading && (
            <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-md text-sm text-gray-800 mb-4 italic">
                {summary}
            </div>
          )}

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
                    className="flex items-center text-xs text-[#192F59] hover:text-[#101f3c] hover:underline transition-colors"
                    >
                    {getFileIcon(doc.name)}
                    <span className="truncate">{doc.name}</span>
                    </a>
                ))}
                </div>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <p className="text-gray-400 font-mono text-[11px] truncate" title={id}>
                ID: {id}
            </p>
            <div className="flex items-center gap-4">
                <div className="flex items-center">
                    <Calendar size={14} className="mr-1.5"/>
                    {formattedDate}
                </div>
                <div className="flex items-center" title={`${viewCount || 0} views`}>
                    <Eye size={14} className="mr-1.5" />
                    {viewCount || 0}
                </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {githubLink && ( <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors"><Github size={22} /></a> )}
              {publicationLink && ( <a href={publicationLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#192F59] transition-colors"><FileText size={22} /></a> )}
            </div>
            <div className="flex items-center space-x-2">
               <button
                  onClick={handleGetSummary}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                  disabled={isSummaryLoading}
                  aria-live="polite"
                >
                  {isSummaryLoading ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {summary ? 'Hide' : 'AI Summary'}
                </button>
              {canModify && onEdit && (
                <button onClick={() => onEdit(project)} title="Edit project" className="p-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-800 transition-all"><Pencil size={16} /></button>
              )}
              {canVerify && !verified && onVerify && (
                <button onClick={() => onVerify(project.id, currentUserFacultyName)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all">
                  <CheckCircle size={14} /> Verify
                </button>
              )}
               <button onClick={handleCopyLink} title="Copy project link" className="p-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-800 transition-all">
                 {copySuccess ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
               </button>
               <button onClick={() => setIsShareModalOpen(true)} title="Share project" className="p-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-800 transition-all"><Share2 size={16} /></button>
               <button onClick={() => setIsQrVisible(!isQrVisible)} title={isQrVisible ? 'Hide QR code' : 'Show QR code'} className="p-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-800 transition-all">
                {isQrVisible ? <EyeOff size={16} /> : <Eye size={16} />}
               </button>
              {canModify && onDelete && (
                <button onClick={() => onDelete(project.id)} title="Delete project" className="p-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200 hover:text-red-800 transition-all"><Trash2 size={16} /></button>
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
