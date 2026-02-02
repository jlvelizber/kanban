import cors from 'cors';
import express, { Request, Response } from 'express';
import { testConnection } from './db/config';
import { initializeDatabase as initDb } from './db/init';
import { projectRoutes } from './routes/projects';
import { ticketRoutes } from './routes/tickets';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Initialize database schema
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

