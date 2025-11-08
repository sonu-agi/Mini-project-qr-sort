import { GoogleGenAI, Type } from "@google/genai";
import { Project, IdeaGenerationResult } from '../types';

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

    if (!response.text) {
      throw new Error("Received an empty response from the AI.");
    }
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
    if (!response.text) {
      return "Could not generate summary at this time.";
    }
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for summary:", error);
    return "Could not generate summary at this time.";
  }
}

export async function generateProjectIdeas(
  userInput: { skills: string; interests: string; department: string },
  projects: Project[]
): Promise<IdeaGenerationResult> {

  const projectSummaries = projects.map(p =>
    `ID: ${p.id}, Title: "${p.projectTitle}", Description: "${p.description}", Current Team's Skills/Tech: ${[...(p.technologies || []), ...(p.skills || [])].join(', ')}`
  ).join('\n---\n');

  const prompt = `
    You are an AI career counselor and project mentor at Jeppiaar Institute of Technology. A student from the ${userInput.department} department has come to you for guidance.

    Student's Profile:
    - Skills: ${userInput.skills}
    - Interests: ${userInput.interests}

    Your tasks are:
    1.  Generate 3 unique and innovative project ideas tailored to this student's profile. The ideas should be relevant to their department and interests. For each idea, provide a title, a short description (2-3 sentences), a list of suggested technologies, and a difficulty level ('Beginner', 'Intermediate', or 'Advanced').
    2.  Analyze the following list of existing projects. Identify up to 2 projects where this student's skills would be a valuable addition to the team. For each suggestion, provide the project ID and a brief, encouraging reason why they should consider joining. If no existing projects are a good fit, return an empty array for this part.

    Existing Projects:
    ${projectSummaries}

    Provide the response in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newIdeas: {
              type: Type.ARRAY,
              description: "A list of new project ideas for the student.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] }
                },
                required: ["title", "description", "technologies", "difficulty"]
              }
            },
            collaborationSuggestions: {
              type: Type.ARRAY,
              description: "A list of existing projects the student could collaborate on.",
              items: {
                type: Type.OBJECT,
                properties: {
                  projectId: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["projectId", "reason"]
              }
            }
          },
          required: ["newIdeas", "collaborationSuggestions"]
        }
      }
    });
    
    if (!response.text) {
      throw new Error("Received an empty response from the AI for project ideas.");
    }
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as IdeaGenerationResult;

  } catch (error) {
    console.error("Error calling Gemini API for project ideas:", error);
    throw new Error("The AI failed to generate ideas. This could be due to a network issue or an API error. Please try again.");
  }
}
