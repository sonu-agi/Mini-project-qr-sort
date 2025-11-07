import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

interface ChatbotProps {
    allProjects: Project[];
}

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ allProjects }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && allProjects.length > 0) {
            const projectDetails = allProjects.map(p => {
                const studentNames = p.students.map(s => s.name).join(', ');
                return `ID: ${p.id}, Title: ${p.projectTitle}, Description: ${p.description}, Students: ${studentNames}, Technologies: ${p.technologies?.join(', ') || 'N/A'}, Skills: ${p.skills?.join(', ') || 'N/A'}`;
            }).join('\n---\n');

            const systemInstruction = `You are a friendly and helpful 'Project Assistant' for the Jeppiaar Institute of Technology's student project showcase. Your goal is to answer questions about the projects listed below. Be concise and helpful. If you don't know the answer or a question is unrelated to the projects, politely say so. Here is the list of all projects:\n${projectDetails}`;
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                },
            });
            setChat(newChat);

            setMessages([{
                sender: 'bot',
                text: "Hello! I'm the Project Assistant. How can I help you explore the student projects today?"
            }]);
        }
    }, [isOpen, allProjects]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: input });
            const botMessage: Message = { sender: 'bot', text: response.text };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-[#192F59] text-white p-4 rounded-full shadow-lg hover:bg-[#101f3c] focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-2 transition-transform duration-200 hover:scale-110 z-50"
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-6 w-full max-w-sm h-full max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 z-50 transition-all duration-300 ease-in-out transform origin-bottom-right">
                    <header className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
                        <h3 className="text-lg font-bold text-gray-800">Project Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
                            <X size={20} />
                        </button>
                    </header>
                    <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                    {msg.sender === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#192F59] text-white flex items-center justify-center"><Bot size={18} /></div>}
                                    <div className={`max-w-xs px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-[#192F59] text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center"><User size={18} /></div>}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#192F59] text-white flex items-center justify-center"><Bot size={18} /></div>
                                    <div className="max-w-xs px-4 py-3 bg-white text-gray-800 border rounded-xl rounded-bl-none flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </main>
                    <footer className="p-4 border-t bg-white rounded-b-xl">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about a project..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="p-3 bg-[#192F59] text-white rounded-lg hover:bg-[#101f3c] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={isLoading || !input.trim()}
                                aria-label="Send message"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </footer>
                </div>
            )}
        </>
    );
};

export default Chatbot;
