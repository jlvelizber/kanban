import { useEffect, useState } from 'react';
import { api } from './api';
import { KanbanBoard } from './components/KanbanBoard';
import { ProjectModal } from './components/ProjectModal';
import { ProjectSelector } from './components/ProjectSelector';
import { TicketModal } from './components/TicketModal';
import type { Project, Ticket } from './types';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadTickets();
    } else {
      setTickets([]);
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTickets = async () => {
    if (!selectedProjectId) return;
    try {
      const data = await api.getTickets(selectedProjectId);
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    }
  };

  const handleCreateTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await api.createTicket(ticketData);
      loadTickets();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const handleUpdateTicket = async (ticketData: Partial<Ticket> & { id: string }) => {
    try {
      await api.updateTicket(ticketData.id, ticketData);
      loadTickets();
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await api.deleteTicket(id);
      loadTickets();
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    }
  };

  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProject = await api.createProject(projectData);
      setProjects([...projects, newProject]);
      setSelectedProjectId(newProject.id);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const handleNewTicket = () => {
    setEditingTicket(null);
    setIsTicketModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ProjectSelector
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onAddProject={() => setIsProjectModalOpen(true)}
      />
      
      {selectedProjectId ? (
        <>
          <div className="px-6 py-4">
            <button
              onClick={handleNewTicket}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              + New Ticket
            </button>
          </div>
          <KanbanBoard
            tickets={tickets}
            projectId={selectedProjectId}
            onTicketsChange={loadTickets}
            onEditTicket={handleEditTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No project selected</p>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Project
            </button>
          </div>
        </div>
      )}

      {isTicketModalOpen && (
        <TicketModal
          ticket={editingTicket}
          projects={projects}
          onClose={() => {
            setIsTicketModalOpen(false);
            setEditingTicket(null);
          }}
          onSave={async (ticketData) => {
            if (editingTicket) {
              // ensure id is present for update
              await handleUpdateTicket({ ...ticketData, id: editingTicket.id });
            } else {
              // ensure required properties are present and of correct type
              const { title, description, status, projectId, priority } = ticketData;
              if (
                typeof title === 'string' &&
                typeof description === 'string' &&
                typeof status === 'string' &&
                typeof projectId === 'string' &&
                typeof priority === 'string'
              ) {
                await handleCreateTicket({
                  title,
                  description,
                  status,
                  projectId,
                  priority: priority as 'low' | 'medium' | 'high',
                });
              } else {
                console.error('Missing required fields for ticket creation');
              }
            }
          }}
          isEdit={!!editingTicket}
        />
      )}

      {isProjectModalOpen && (
        <ProjectModal
          onClose={() => setIsProjectModalOpen(false)}
          onSave={handleCreateProject}
        />
      )}
    </div>
  );
}

export default App;
