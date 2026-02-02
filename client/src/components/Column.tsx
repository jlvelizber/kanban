import type { Ticket, TicketStatus } from '../types';
import { TicketCard } from './TicketCard';

interface ColumnProps {
  status: TicketStatus;
  tickets: Ticket[];
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
  onDragStart: (ticketId: string) => void;
  onDragOver: (e: React.DragEvent, status: TicketStatus) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, status: TicketStatus) => void;
  isDragOver: boolean;
  draggedTicketId: string | null;
}

const columnConfig = {
  todo: { title: 'To Do', color: 'bg-gray-100' },
  'in-progress': { title: 'In Progress', color: 'bg-blue-100' },
  done: { title: 'Done', color: 'bg-green-100' },
};

export function Column({
  status,
  tickets,
  onEditTicket,
  onDeleteTicket,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver,
  draggedTicketId,
}: ColumnProps) {
  const config = columnConfig[status];

  return (
    <div className="flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4">
      <div className={`${config.color} rounded-lg px-4 py-2 mb-4`}>
        <h2 className="font-semibold text-gray-800">
          {config.title} ({tickets.length})
        </h2>
      </div>
      <div
        className={`min-h-[400px] transition-colors ${
          isDragOver ? 'bg-blue-50' : ''
        }`}
        onDragOver={(e) => onDragOver(e, status)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, status)}
      >
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            draggable
            onDragStart={() => onDragStart(ticket.id)}
            className={draggedTicketId === ticket.id ? 'opacity-50' : ''}
          >
            <TicketCard
              ticket={ticket}
              onEdit={onEditTicket}
              onDelete={onDeleteTicket}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

