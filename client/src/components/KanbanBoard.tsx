import { useState } from 'react';
import { api } from '../api';
import type { Ticket, TicketStatus } from '../types';
import { Column } from './Column';

interface KanbanBoardProps {
  tickets: Ticket[];
  projectId?: string;
  onTicketsChange: () => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
}

export function KanbanBoard({
  tickets,
  onTicketsChange,
  onEditTicket,
  onDeleteTicket,
}: KanbanBoardProps) {
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TicketStatus | null>(null);

  const handleDragStart = (ticketId: string) => {
    setDraggedTicketId(ticketId);
  };

  const handleDragOver = (e: React.DragEvent, status: TicketStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TicketStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTicketId) return;

    const ticket = tickets.find((t) => t.id === draggedTicketId);
    if (!ticket || ticket.status === newStatus) {
      setDraggedTicketId(null);
      return;
    }

    try {
      await api.updateTicket(draggedTicketId, { status: newStatus });
      onTicketsChange();
    } catch (error) {
      console.error('Failed to update ticket:', error);
    } finally {
      setDraggedTicketId(null);
    }
  };

  const columns: TicketStatus[] = ['todo', 'in-progress', 'done'];

  return (
    <div className="flex gap-4 p-6 overflow-x-auto">
      {columns.map((status) => (
        <Column
          key={status}
          status={status}
          tickets={tickets.filter((t) => t.status === status)}
          onEditTicket={onEditTicket}
          onDeleteTicket={onDeleteTicket}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          isDragOver={dragOverColumn === status}
          draggedTicketId={draggedTicketId}
        />
      ))}
    </div>
  );
}

