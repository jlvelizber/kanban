import type { Project, Ticket } from './types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE}/projects`);
    return response.json();
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await fetch(`${API_BASE}/projects/${id}`);
    return response.json();
  },

  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    return response.json();
  },

  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    return response.json();
  },

  deleteProject: async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Tickets
  getTickets: async (projectId?: string): Promise<Ticket[]> => {
    const url = projectId 
      ? `${API_BASE}/tickets?projectId=${projectId}`
      : `${API_BASE}/tickets`;
    const response = await fetch(url);
    return response.json();
  },

  getTicket: async (id: string): Promise<Ticket> => {
    const response = await fetch(`${API_BASE}/tickets/${id}`);
    return response.json();
  },

  createTicket: async (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> => {
    const response = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    return response.json();
  },

  updateTicket: async (id: string, ticket: Partial<Ticket>): Promise<Ticket> => {
    const response = await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    return response.json();
  },

  deleteTicket: async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'DELETE',
    });
  },
};

