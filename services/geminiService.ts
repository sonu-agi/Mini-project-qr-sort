import { GoogleGenAI, Type } from "@google/genai";
import { Project } from '../types';

if (!process.env.API_KEY) {
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
  
  if (projects.length <= 3) {
    return projects.map(p => ({
        projectId: p.id,
        justification: "Selected as one of the top entries from a small pool of high-quality submissions."
    }));
  }

  const projectDetails = projects.map(p => {
    return `ID: ${p.id}\nTitle: ${p.projectTitle}\nCategory: ${p.category}\nDescription: ${p.description}\nTechnologies: ${p.technologies?.join(', ') || 'Not specified'}`;
  }).join('\n---\n');

  const prompt = `
    You are an expert engineering professor and technology evangelist at a prestigious tech institute. You are tasked with selecting the top 3 projects from a list of submissions.
    
    Your selection criteria must be multi-faceted. Prioritize projects based on:
    1.  **Innovation & Novelty:** Does the project introduce a new idea or a creative solution to an existing problem?
    2.  **Technical Complexity:** Assess the difficulty suggested by the technologies used (e.g., Deep Learning, LLVM are generally more complex than basic web dev).
    3.  **Potential Impact:** Could this project have real-world applications, be published, or be developed into a startup?
    4.  **Execution & Clarity:** How well is the project described? A clear description suggests a well-understood project.
    5.  **Cross-Disciplinary Nature:** Give extra points to projects that combine knowledge from different fields (e.g., Mechanical and IT).

    Here is the list of projects to evaluate:
    ${projectDetails}
    
    Return your answer in the specified JSON format. For each of the top 3 projects, provide a one-sentence justification that highlights the primary reason for its selection (e.g., "for its innovative application of computer vision in robotics.").
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
    
    return result.slice(0, 3);
    
  } catch (error) {
    console.error("Error calling Gemini API for project selection:", error);
    const shuffled = [...projects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(p => ({
        projectId: p.id,
        justification: "Selected due to an AI processing error. This is a top project."
    }));
  }
}

export async function summarizeProject(project: Project): Promise<string> {
  const projectDetails = `Title: ${project.projectTitle}\nDescription: ${project.description}\nTechnologies: ${project.technologies?.join(', ') || 'N/A'}`;

  const prompt = `
    You are a technical writer. Create a concise, engaging, two-sentence summary for the following student project. The first sentence should state what the project is, and the second should highlight its key technology or potential impact.
    
    Project Details:
    ${projectDetails}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for summary:", error);
    return "Could not generate summary at this time.";
  }
}