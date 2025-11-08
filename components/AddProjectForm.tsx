import React, { useState, useEffect } from 'react';
import { Project, Student, Faculty, ProjectType, DocumentFile, ProjectStatus, ProjectCategory } from '../types';
import { DEPARTMENTS, YEARS, SECTIONS, PROJECT_STATUSES, PROJECT_CATEGORIES } from '../constants';
import { X, Plus, Trash2 } from 'lucide-react';

interface ProjectFormProps {
  onSave: (project: Omit<Project, 'id'>, id?: string) => void;
  onClose: () => void;
  projectToEdit?: Project | null;
}

const AddProjectForm: React.FC<ProjectFormProps> = ({ onSave, onClose, projectToEdit }) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [publicationLink, setPublicationLink] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('College');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [category, setCategory] = useState<ProjectCategory>('Web Development');
  const [year, setYear] = useState(YEARS[0]);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [section, setSection] = useState(SECTIONS[0]);
  const [students, setStudents] = useState<Student[]>([{ name: '', registrationNumber: '', year: YEARS[0], department: DEPARTMENTS[0], section: SECTIONS[0], contribution: '' }]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [submissionDate, setSubmissionDate] = useState<string>(new Date().toISOString().slice(0, 10));


  useEffect(() => {
    if (projectToEdit) {
      setProjectTitle(projectToEdit.projectTitle);
      setDescription(projectToEdit.description);
      setGithubLink(projectToEdit.githubLink || '');
      setPublicationLink(projectToEdit.publicationLink || '');
      setProjectType(projectToEdit.projectType);
      setStatus(projectToEdit.status);
      setCategory(projectToEdit.category);
      setYear(projectToEdit.year);
      setDepartment(projectToEdit.department);
      setSection(projectToEdit.section);
      setStudents(projectToEdit.students);
      setFaculty(projectToEdit.faculty);
      setDocuments(projectToEdit.documents || []);
      setTechnologies(projectToEdit.technologies || []);
      setSkills(projectToEdit.skills || []);
      setKeywords(projectToEdit.keywords || []);
      setSubmissionDate(projectToEdit.submissionDate.toISOString().slice(0, 10));
    }
  }, [projectToEdit]);

  const handleStudentChange = (index: number, field: keyof Student, value: string) => {
    const newStudents = [...students];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setStudents(newStudents);
  };
  
  const addStudent = () => setStudents([...students, { name: '', registrationNumber: '', year: YEARS[0], department: DEPARTMENTS[0], section: SECTIONS[0], contribution: '' }]);
  const removeStudent = (index: number) => setStudents(students.filter((_, i) => i !== index));

  const handleFacultyChange = (index: number, field: keyof Faculty, value: string) => {
    const newFaculty = [...faculty];
    newFaculty[index] = { ...newFaculty[index], [field]: value };
    setFaculty(newFaculty);
  };
  
  const addFaculty = () => setFaculty([...faculty, { name: '', department: DEPARTMENTS[0] }]);
  const removeFaculty = (index: number) => setFaculty(faculty.filter((_, i) => i !== index));

  const handleDocumentChange = (index: number, field: keyof DocumentFile, value: string) => {
    const newDocs = [...documents];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setDocuments(newDocs);
  };
  const addDocument = () => setDocuments([...documents, { name: '', url: '' }]);
  const removeDocument = (index: number) => setDocuments(documents.filter((_, i) => i !== index));
  
  // Handlers for technologies, skills, and keywords
  const createListHandler = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, list: T[]) => ({
    change: (index: number, value: string) => {
      const newList = [...list];
      newList[index] = value as unknown as T;
      setter(newList);
    },
    add: (max: number, defaultValue: T) => {
      if (list.length < max) {
        setter([...list, defaultValue]);
      }
    },
    remove: (index: number) => {
      setter(list.filter((_, i) => i !== index));
    }
  });

  const technologyHandlers = createListHandler(setTechnologies, technologies);
  const skillHandlers = createListHandler(setSkills, skills);
  const keywordHandlers = createListHandler(setKeywords, keywords);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectTitle && description && students.every(s => s.name && s.registrationNumber)) {
        const projectData = {
            projectTitle, description, githubLink, publicationLink, projectType, year, department, section,
            status, category,
            students: students.filter(s => s.name.trim() !== '' && s.registrationNumber.trim() !== ''),
            faculty: faculty.filter(f => f.name.trim() !== ''),
            documents: documents.filter(d => d.name.trim() !== '' && d.url.trim() !== ''),
            technologies: technologies.filter(t => t.trim() !== ''),
            skills: skills.filter(s => s.trim() !== ''),
            keywords: keywords.filter(k => k.trim() !== ''),
            submissionDate: new Date(submissionDate + 'T00:00:00'),
        };
      onSave(projectData, projectToEdit?.id);
    } else {
      alert('Please fill in project title, description, and all student names and registration numbers.');
    }
  };
  
  const renderDynamicList = (
    list: string[], 
    handlers: { change: (i:number, v:string)=>void, add: (max:number, val:string)=>void, remove: (i:number)=>void },
    max: number, 
    label: string, 
    placeholder: string
  ) => (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label} ({list.length}/{max})</label>
        {list.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
                <input
                    type="text"
                    value={item}
                    onChange={(e) => handlers.change(index, e.target.value)}
                    placeholder={placeholder}
                    className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] bg-white text-gray-800"
                />
                <button type="button" onClick={() => handlers.remove(index)} className="p-2 text-red-600 hover:bg-red-100 rounded-md">
                    <Trash2 size={18} />
                </button>
            </div>
        ))}
        {list.length < max && (
            <button type="button" onClick={() => handlers.add(max, '')} className="flex items-center gap-2 text-sm font-medium text-[#192F59] hover:text-[#101f3c]">
                <Plus size={16} /> Add {label.split('(')[0].trim()}
            </button>
        )}
      </div>
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{projectToEdit ? 'Edit Project' : 'Submit a New Project'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-8 space-y-6">
            {/* Project Info */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-700">Project Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Title *</label>
                <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] bg-white text-gray-800" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] bg-white text-gray-800" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="url" value={githubLink} onChange={e => setGithubLink(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] bg-white text-gray-800" placeholder="GitHub Link (Optional)" />
                <input type="url" value={publicationLink} onChange={e => setPublicationLink(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] bg-white text-gray-800" placeholder="Publication/Demo Link (Optional)" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                    <div className="flex gap-4 mt-2">
                       {(['College', 'Personal'] as ProjectType[]).map(type => (
                         <label key={type} className="flex items-center"><input type="radio" name="projectType" value={type} checked={projectType === type} onChange={() => setProjectType(type)} className="h-4 w-4 text-[#192F59] border-gray-300 focus:ring-[#192F59]" /> <span className="ml-2 text-sm text-gray-700">{type}</span></label>
                       ))}
                    </div>
                 </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select id="status" value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] sm:text-sm bg-white text-gray-800">
                      {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value as ProjectCategory)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] sm:text-sm bg-white text-gray-800">
                      {PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="submissionDate" className="block text-sm font-medium text-gray-700">Submission Date *</label>
                    <input 
                        id="submissionDate"
                        type="date" 
                        value={submissionDate} 
                        onChange={e => setSubmissionDate(e.target.value)} 
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#192F59] focus:border-[#192F59] bg-white text-gray-800" 
                        required 
                    />
                </div>
              </div>
            </div>

            {/* Skills & Keywords */}
             <div className="space-y-6 border-b pb-6">
                {renderDynamicList(technologies, technologyHandlers, 5, 'Technology/Components Used', 'e.g., React, Python, Arduino')}
                {renderDynamicList(skills, skillHandlers, 5, 'Skills', 'e.g., AI/ML, Web Development')}
                {renderDynamicList(keywords, keywordHandlers, 6, 'Keywords', 'e.g., AI, Healthcare, IoT')}
            </div>

            {/* Students */}
            <div className="space-y-4 border-b pb-6">
               <h3 className="text-lg font-semibold text-gray-700">Students *</h3>
                {students.map((student, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border space-y-3 relative">
                        {students.length > 1 && 
                            <button type="button" onClick={() => removeStudent(index)} className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-100 rounded-md">
                                <Trash2 size={16} />
                            </button>
                        }
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input value={student.name} onChange={(e) => handleStudentChange(index, 'name', e.target.value)} placeholder="Student Name *" className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800" required />
                            <input value={student.registrationNumber} onChange={(e) => handleStudentChange(index, 'registrationNumber', e.target.value)} placeholder="Reg. Number *" className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800" required />
                            <input 
                                value={student.contribution || ''} 
                                onChange={(e) => handleStudentChange(index, 'contribution', e.target.value)} 
                                placeholder="Contribution (e.g., Frontend)" 
                                className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800" 
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <select value={student.year} onChange={(e) => handleStudentChange(index, 'year', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800">
                                <option disabled value="">Year</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <select value={student.department} onChange={(e) => handleStudentChange(index, 'department', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800">
                                <option disabled value="">Department</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select value={student.section} onChange={(e) => handleStudentChange(index, 'section', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800">
                                <option disabled value="">Section</option>{SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addStudent} className="flex items-center gap-2 text-sm font-medium text-[#192F59] hover:text-[#101f3c]"><Plus size={16} /> Add Student</button>
            </div>

            {/* Faculty */}
            <div className="space-y-4 border-b pb-6">
               <h3 className="text-lg font-semibold text-gray-700">Faculty Advisors (Optional)</h3>
                {faculty.map((f, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md border grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                       <input value={f.name} onChange={(e) => handleFacultyChange(index, 'name', e.target.value)} placeholder="Faculty Name" className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800" />
                       <select value={f.department} onChange={(e) => handleFacultyChange(index, 'department', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800"><option disabled>Dept</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                       <button type="button" onClick={() => removeFaculty(index)} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={addFaculty} className="flex items-center gap-2 text-sm font-medium text-[#192F59] hover:text-[#101f3c]"><Plus size={16} /> Add Faculty Advisor</button>
            </div>
            
            {/* Documents */}
            <div className="space-y-4">
               <h3 className="text-lg font-semibold text-gray-700">Project Documents (Optional)</h3>
                {documents.map((doc, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md border grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-end">
                       <input value={doc.name} onChange={(e) => handleDocumentChange(index, 'name', e.target.value)} placeholder="Document Name (e.g., Abstract.pdf)" className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800" />
                       <input type="url" value={doc.url} onChange={(e) => handleDocumentChange(index, 'url', e.target.value)} placeholder="Document URL" className="w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800" />
                       <button type="button" onClick={() => removeDocument(index)} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={addDocument} className="flex items-center gap-2 text-sm font-medium text-[#192F59] hover:text-[#101f3c]"><Plus size={16} /> Add Document</button>
            </div>

             {/* Primary Classification */}
            <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700">Primary Classification</h3>
                <p className="text-sm text-gray-500">Select the main category for filtering this project on the showcase page.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <select name="year" value={year} onChange={e => setYear(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800"><option disabled>Year</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
                    <select name="department" value={department} onChange={e => setDepartment(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800"><option disabled>Department</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                    <select name="section" value={section} onChange={e => setSection(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-white text-gray-800"><option disabled>Section</option>{SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select>
                </div>
            </div>

          </div>
          <div className="bg-gray-50 px-8 py-4 border-t flex justify-end">
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-[#192F59] rounded-md hover:bg-[#101f3c] focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2">
              {projectToEdit ? 'Update Project' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectForm;