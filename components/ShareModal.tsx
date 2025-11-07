import React from 'react';
import { Project } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { X, Linkedin, Copy } from 'lucide-react';

interface ShareModalProps {
  project: Project;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ project, onClose }) => {
  const studentNames = project.students.map(s => s.name).join(', ');
  
  const projectDetailsString = JSON.stringify({
    id: project.id,
    title: project.projectTitle,
    students: project.students.map(s => s.name),
    description: project.description,
    github: project.githubLink,
    publication: project.publicationLink,
    documents: project.documents?.map(d => ({ name: d.name, url: d.url })) || [],
    technologies: project.technologies || [],
    skills: project.skills || [],
    keywords: project.keywords || []
  }, null, 2);

  const shareText = `Check out this project: "${project.projectTitle}" by ${studentNames}!`;
  // Using a placeholder URL for sharing links, as we don't have real project pages.
  const shareUrl = project.publicationLink || project.githubLink || window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md mx-auto relative p-8 text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Share Project</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">"{project.projectTitle}"</p>
        
        <div className="mb-6 inline-block p-4 bg-white rounded-lg border border-gray-200">
          <QRCodeSVG value={projectDetailsString} size={200} />
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Scan this QR code with a camera, Google Lens, or any QR app to get project details.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all">
            <Copy size={16} />
            Copy Link
          </button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all"
          >
            <Linkedin size={16} />
            Share on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;