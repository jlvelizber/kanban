import type { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

export function TicketCard({ ticket, onEdit, onDelete }: TicketCardProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm flex-1">{ticket.title}</h3>
        <div className="flex gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(ticket);
            }}
            className="text-gray-400 hover:text-blue-600 text-xs"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ticket.id);
            }}
            className="text-gray-400 hover:text-red-600 text-xs"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
      {ticket.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

