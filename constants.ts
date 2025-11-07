import { Project } from './types';

export const DEPARTMENTS = ['CSE', 'IT', 'AIDS', 'CSBS', 'ECE', 'MECH'];
export const YEARS = ['1', '2', '3', '4'];
export const SECTIONS = ['A', 'B', 'C', 'D', 'N/A'];


// Get dates for the last two months to ensure "Project of the Month" has data
const now = new Date();
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 10);

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    students: [{ name: 'Alice Johnson', registrationNumber: 'JIT2020CSE001', year: '4', department: 'CSE', section: 'A' }],
    projectTitle: 'AI-Powered Chess Engine',
    description: 'A deep learning model trained to play chess at a grandmaster level. Built with Python and TensorFlow.',
    githubLink: 'https://github.com/example/chess',
    documents: [
        { name: 'Project Abstract.pdf', url: 'https://example.com/doc1.pdf' },
        { name: 'Final Presentation.pptx', url: 'https://example.com/doc1.pptx' },
    ],
    technologies: ['Python', 'TensorFlow'],
    skills: ['Deep Learning', 'Game AI'],
    keywords: ['Chess', 'Artificial Intelligence', 'Neural Network'],
    year: '4',
    department: 'CSE',
    section: 'A',
    submissionDate: lastMonth,
    faculty: [{ name: 'Dr. Alan Turing', department: 'CSE' }],
    projectType: 'College',
  },
  {
    id: '2',
    students: [{ name: 'Bob Williams', registrationNumber: 'JIT2021ECE015', year: '3', department: 'ECE', section: 'B' }],
    projectTitle: 'IoT Weather Station',
    description: 'A solar-powered weather station that uploads real-time data to a web dashboard using Raspberry Pi.',
    githubLink: 'https://github.com/example/weather',
    publicationLink: 'https://example.com/publication1',
    technologies: ['Raspberry Pi', 'Python'],
    skills: ['IoT', 'Circuit Design', 'Data Logging'],
    keywords: ['Weather', 'Sensors', 'Solar Power'],
    year: '3',
    department: 'ECE',
    section: 'B',
    submissionDate: new Date(new Date().setDate(now.getDate() - 5)),
    faculty: [],
    projectType: 'Personal',
  },
  {
    id: '3',
    students: [
        { name: 'Charlie Brown', registrationNumber: 'JIT2020MECH023', year: '4', department: 'MECH', section: 'A' },
        { name: 'Diana Prince', registrationNumber: 'JIT2021IT045', year: '3', department: 'IT', section: 'C' }
    ],
    projectTitle: 'Automated Robotic Arm',
    description: 'A 3D-printed robotic arm capable of sorting objects by color using computer vision. A cross-departmental effort.',
    technologies: ['Arduino', 'OpenCV', '3D Printing'],
    skills: ['Robotics', 'Computer Vision', 'Automation'],
    keywords: ['Sorting', 'Mechanical Arm'],
    year: '4',
    department: 'MECH',
    section: 'A',
    submissionDate: lastMonth,
    faculty: [{ name: 'Prof. Ada Lovelace', department: 'MECH'}],
    projectType: 'College',
  },
    {
    id: '4',
    students: [{ name: 'Diana Prince', registrationNumber: 'JIT2021IT045', year: '3', department: 'IT', section: 'C' }],
    projectTitle: 'Bridge Stress Analysis Simulation',
    description: 'Finite element analysis software to simulate stress on various bridge designs under different load conditions.',
    publicationLink: 'https://example.com/publication2',
    documents: [
        { name: 'Conference Paper.docx', url: 'https://example.com/doc2.docx' },
    ],
    skills: ['Finite Element Analysis', 'Structural Engineering'],
    year: '3',
    department: 'IT',
    section: 'C',
    submissionDate: new Date(new Date().setDate(now.getDate() - 10)),
    faculty: [],
    projectType: 'Personal',
  },
  {
    id: '5',
    students: [{ name: 'Eve Adams', registrationNumber: 'JIT2020CSBS009', year: '4', department: 'CSBS', section: 'A' }],
    projectTitle: 'React Native Social App',
    description: 'A cross-platform social media application for sharing short-form video content, built with React Native and Firebase.',
    githubLink: 'https://github.com/example/social-app',
    technologies: ['React Native', 'Firebase', 'JavaScript'],
    skills: ['Mobile App Dev', 'Cross-Platform Development'],
    year: '4',
    department: 'CSBS',
    section: 'A',
    submissionDate: lastMonth,
    faculty: [],
    projectType: 'Personal',
  },
  {
    id: '6',
    students: [{ name: 'Frank Castle', registrationNumber: 'JIT2021ECE018', year: '3', department: 'ECE', section: 'B' }],
    projectTitle: 'Advanced Signal Processing Filter',
    description: 'Developed a novel DSP filter for noise cancellation in audio signals, improving clarity by over 30%.',
    technologies: [],
    skills: ['Digital Signal Processing', 'Noise Cancellation'],
    keywords: ['DSP', 'Audio Processing'],
    year: '3',
    department: 'ECE',
    section: 'B',
    submissionDate: lastMonth,
    faculty: [{ name: 'Dr. Nikola Tesla', department: 'ECE' }],
    projectType: 'College',
  },
   {
    id: '7',
    students: [
        { name: 'Grace Hopper', registrationNumber: 'JIT2020CSE002', year: '4', department: 'CSE', section: 'A' },
        { name: 'Henry Pym', registrationNumber: 'JIT2020CSE003', year: '4', department: 'CSE', section: 'A' }
    ],
    projectTitle: 'Compiler for a new language',
    description: 'A fully functional compiler for a custom-designed programming language focused on parallel computing.',
    githubLink: 'https://github.com/example/compiler',
    technologies: ['C++', 'LLVM'],
    skills: ['Compiler Design', 'Parallel Computing'],
    year: '4',
    department: 'CSE',
    section: 'A',
    submissionDate: lastMonth,
    faculty: [{ name: 'Dr. Alan Turing', department: 'CSE' }],
    projectType: 'College',
  },
  {
    id: '8',
    students: [{ name: 'Henry Pym', registrationNumber: 'JIT2020MECH031', year: '4', department: 'MECH', section: 'A' }],
    projectTitle: 'Ant-Sized Drone',
    description: 'Micro-drone design for surveillance and environmental monitoring in tight spaces, with autonomous navigation.',
    skills: ['Drone Design', 'Autonomous Navigation', 'Miniaturization'],
    year: '4',
    department: 'MECH',
    section: 'A',
    submissionDate: twoMonthsAgo,
    faculty: [],
    projectType: 'Personal',
  }
];