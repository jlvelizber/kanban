import { Request, Response, Router } from 'express';
import { dataStore } from '../data/store';

export const ticketRoutes = Router();

// Get all tickets (optionally filtered by project)
ticketRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const tickets = await dataStore.getTickets(projectId);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get ticket by ID
ticketRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const ticket = await dataStore.getTicket(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Create ticket
ticketRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, status, projectId, priority } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and projectId are required' });
    }
    const ticket = await dataStore.createTicket({
      title,
      description: description || '',
      status: status || 'todo',
      projectId,
      priority: priority || 'medium',
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket
ticketRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const ticket = await dataStore.updateTicket(req.params.id, updates);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Delete ticket
ticketRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await dataStore.deleteTicket(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

