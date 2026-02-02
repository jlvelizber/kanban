import mysql from 'mysql';
import { pool } from '../db/config';
import { Project, Ticket } from '../types';

class DataStore {
  // Project methods
  async getProjects(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM projects ORDER BY createdAt DESC', (error, results) => {
        if (error) {
          console.error('Error getting projects:', error);
          reject(error);
          return;
        }
        resolve((results as any[]).map(this.mapProject));
      });
    });
  }

  async getProject(id: string): Promise<Project | null> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM projects WHERE id = ?', [id], (error, results) => {
        if (error) {
          console.error('Error getting project:', error);
          reject(error);
          return;
        }
        const rows = results as any[];
        if (rows.length === 0) {
          resolve(null);
          return;
        }
        resolve(this.mapProject(rows[0]));
      });
    });
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    return new Promise((resolve, reject) => {
      const id = Date.now().toString();
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      pool.query(
        'INSERT INTO projects (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
        [id, project.name, project.description || '', now, now],
        (error) => {
          if (error) {
            console.error('Error creating project:', error);
            reject(error);
            return;
          }

          resolve({
            id,
            name: project.name,
            description: project.description || '',
            createdAt: now,
            updatedAt: now,
          });
        }
      );
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const project = await this.getProject(id);
        if (!project) {
          resolve(null);
          return;
        }

        const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const name = updates.name ?? project.name;
        const description = updates.description ?? project.description;

        pool.query(
          'UPDATE projects SET name = ?, description = ?, updatedAt = ? WHERE id = ?',
          [name, description, updatedAt, id],
          (error) => {
            if (error) {
              console.error('Error updating project:', error);
              reject(error);
              return;
            }

            resolve({
              ...project,
              name,
              description,
              updatedAt,
            });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteProject(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM projects WHERE id = ?', [id], (error, results) => {
        if (error) {
          console.error('Error deleting project:', error);
          reject(error);
          return;
        }
        const result = results as mysql.OkPacket;
        resolve((result as any).affectedRows > 0);
      });
    });
  }

  // Ticket methods
  async getTickets(projectId?: string): Promise<Ticket[]> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM tickets ORDER BY createdAt DESC';
      let params: string[] = [];

      if (projectId) {
        query = 'SELECT * FROM tickets WHERE projectId = ? ORDER BY createdAt DESC';
        params = [projectId];
      }

      pool.query(query, params, (error, results) => {
        if (error) {
          console.error('Error getting tickets:', error);
          reject(error);
          return;
        }
        resolve((results as any[]).map(this.mapTicket));
      });
    });
  }

  async getTicket(id: string): Promise<Ticket | null> {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM tickets WHERE id = ?', [id], (error, results) => {
        if (error) {
          console.error('Error getting ticket:', error);
          reject(error);
          return;
        }
        const rows = results as any[];
        if (rows.length === 0) {
          resolve(null);
          return;
        }
        resolve(this.mapTicket(rows[0]));
      });
    });
  }

  async createTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      const id = Date.now().toString();
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

      pool.query(
        'INSERT INTO tickets (id, title, description, status, projectId, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          ticket.title,
          ticket.description || '',
          ticket.status,
          ticket.projectId,
          ticket.priority,
          now,
          now,
        ],
        (error) => {
          if (error) {
            console.error('Error creating ticket:', error);
            reject(error);
            return;
          }

          resolve({
            id,
            title: ticket.title,
            description: ticket.description || '',
            status: ticket.status,
            projectId: ticket.projectId,
            priority: ticket.priority,
            createdAt: now,
            updatedAt: now,
          });
        }
      );
    });
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const ticket = await this.getTicket(id);
        if (!ticket) {
          resolve(null);
          return;
        }

        const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const title = updates.title ?? ticket.title;
        const description = updates.description ?? ticket.description;
        const status = updates.status ?? ticket.status;
        const priority = updates.priority ?? ticket.priority;
        const projectId = updates.projectId ?? ticket.projectId;

        pool.query(
          'UPDATE tickets SET title = ?, description = ?, status = ?, priority = ?, projectId = ?, updatedAt = ? WHERE id = ?',
          [title, description, status, priority, projectId, updatedAt, id],
          (error) => {
            if (error) {
              console.error('Error updating ticket:', error);
              reject(error);
              return;
            }

            resolve({
              ...ticket,
              title,
              description,
              status,
              priority,
              projectId,
              updatedAt,
            });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteTicket(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM tickets WHERE id = ?', [id], (error, results) => {
        if (error) {
          console.error('Error deleting ticket:', error);
          reject(error);
          return;
        }
        const result = results as mysql.OkPacket;
        resolve((result as any).affectedRows > 0);
      });
    });
  }

  // Helper methods to map database rows to types
  private mapProject(row: any): Project {
    return {
      id: row.id,
      name: row.name,
      description: row.description || '',
      createdAt: row.createdAt instanceof Date 
        ? row.createdAt.toISOString() 
        : new Date(row.createdAt).toISOString(),
      updatedAt: row.updatedAt instanceof Date 
        ? row.updatedAt.toISOString() 
        : new Date(row.updatedAt).toISOString(),
    };
  }

  private mapTicket(row: any): Ticket {
    return {
      id: row.id,
      title: row.title,
      description: row.description || '',
      status: row.status,
      projectId: row.projectId,
      priority: row.priority,
      createdAt: row.createdAt instanceof Date 
        ? row.createdAt.toISOString() 
        : new Date(row.createdAt).toISOString(),
      updatedAt: row.updatedAt instanceof Date 
        ? row.updatedAt.toISOString() 
        : new Date(row.updatedAt).toISOString(),
    };
  }
}

export const dataStore = new DataStore();
