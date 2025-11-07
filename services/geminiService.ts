import { GoogleGenAI, Type } from "@google/genai";
import { Project } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface BestProjectSelection {
  projectId: string;
  justification: string;
}

export async function selectBestProjects(projects: Project[]): Promise<BestProjectSelection[]> {
  if (projects.length === 0) {
    return [];
  }
  
  // If there are 3 or fewer projects, just return them all with a simple justification.
  if (projects.length <= 3) {
    return projects.map(p => ({
        projectId: p.id,
        justification: "Selected as one of the top entries from a small pool of submissions."
    }));
  }

  const projectDetails = projects.map(p => {
    const studentNames = p.students.map(s => s.name).join(', ');
    const facultyNames = p.faculty.map(f => f.name).join(', ') || 'None';
    const studentYear = p.year;
    const technologies = p.technologies?.join(', ') || 'Not specified';
    const skills = p.skills?.join(', ') || 'Not specified';
    const keywords = p.keywords?.join(', ') || 'Not specified';
    return `ID: ${p.id}\nTitle: ${p.projectTitle}\nStudents: ${studentNames} (Year: ${studentYear})\nFaculty Advisors: ${facultyNames}\nDescription: ${p.description}\nTechnologies: ${technologies}\nSkills: ${skills}\nKeywords: ${keywords}`;
  }).join('\n---\n');

  const prompt = `
    You are an expert engineering professor tasked with evaluating student projects.
    From the following list of projects, select the top 3.
    Your selection should be based on a holistic view of the project, including perceived innovation, potential impact, clarity of the description, technical skills and technologies demonstrated, student experience (e.g., a final year project might be more advanced), and the presence of faculty guidance.
    
    Provide a brief, one-sentence justification for why each of the top 3 projects was chosen.
    
    Here is the list of projects:
    ${projectDetails}
    
    Return your answer in the specified JSON format.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              projectId: {
                type: Type.STRING,
                description: 'The unique ID of the selected project.'
              },
              justification: {
                type: Type.STRING,
                description: 'A brief, one-sentence justification for the selection.'
              }
            },
            required: ["projectId", "justification"]
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as BestProjectSelection[];
    
    // Ensure we don't return more than 3 projects
    return result.slice(0, 3);
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback: if Gemini fails, randomly select up to 3 projects.
    // This provides graceful degradation.
    const shuffled = [...projects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(p => ({
        projectId: p.id,
        justification: "Selected due to an AI processing error. This is a top project."
    }));
  }
}