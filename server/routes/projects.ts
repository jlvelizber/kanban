import { Request, Response, Router } from 'express';
import { dataStore } from '../data/store';

export const projectRoutes = Router();

// Get all projects
projectRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await dataStore.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project by ID
projectRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await dataStore.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project
projectRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    const project = await dataStore.createProject({ name, description: description || '' });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
projectRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const project = await dataStore.updateProject(req.params.id, { name, description });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
projectRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await dataStore.deleteProject(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

