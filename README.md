# Kanban Tool

A modern Kanban board application for managing development tickets, built with Node.js, React, TypeScript, and Tailwind CSS.

## Features

- 📋 **Project Management**: Create and manage multiple projects
- 🎫 **Ticket Management**: Create, edit, and delete tickets
- 🎯 **Three Basic Steps**: To Do, In Progress, and Done columns
- 🖱️ **Drag & Drop**: Intuitive drag-and-drop interface for moving tickets between columns
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **TypeScript**: Full type safety across the stack

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Drag & Drop**: Native HTML5 Drag and Drop API
- **Database**: MySQL 8.0

## Getting Started

### Option 1: Docker (Recommended)

The easiest way to run the application is using Docker Compose:

1. **Prerequisites:**
   - Docker
   - Docker Compose

2. **Start the application:**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MySQL database on port 3306
   - Backend API on port 3001
   - Frontend on port 80 (http://localhost)

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes (clean database):**
   ```bash
   docker-compose down -v
   ```

### Option 2: Local Development

#### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL (v5.7 or higher, or MariaDB equivalent)

#### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

3. Set up MySQL database:
   - Create a MySQL database (or use an existing one)
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Update `.env` with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=kanban_db
   ```

   The database schema will be automatically created on first run.

### Running the Application

Start both the backend server and frontend development server:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:5173` (or similar)

### Building for Production

```bash
npm run build
```

The built files will be in:
- Backend: `dist/` directory
- Frontend: `client/dist/` directory

## Project Structure

```
kanban/
├── server/           # Backend code
│   ├── routes/       # API routes
│   ├── data/         # Data store
│   └── types.ts      # TypeScript types
├── client/           # Frontend code
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── api.ts       # API client
│   │   └── types.ts     # TypeScript types
│   └── ...
└── package.json
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tickets
- `GET /api/tickets?projectId=:id` - Get tickets (optionally filtered by project)
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create a new ticket
- `PUT /api/tickets/:id` - Update a ticket
- `DELETE /api/tickets/:id` - Delete a ticket

## Usage

1. **Create a Project**: Click "New Project" to create your first project
2. **Select a Project**: Use the dropdown to switch between projects
3. **Create Tickets**: Click "New Ticket" to add tickets to your board
4. **Move Tickets**: Drag and drop tickets between columns (To Do, In Progress, Done)
5. **Edit/Delete**: Click the edit or delete icons on any ticket card

## Data Storage

The application uses MySQL for persistent data storage. The database schema is automatically initialized when the server starts. Make sure your MySQL server is running and the credentials in `.env` are correct.

### Database Schema

- **projects**: Stores project information
- **tickets**: Stores ticket information with foreign key relationship to projects

The schema includes proper indexes and foreign key constraints for data integrity.

## Docker Configuration

The application includes Docker support with:
- **Multi-stage builds** for optimized image sizes
- **Docker Compose** for easy orchestration
- **MySQL container** with automatic schema initialization
- **Nginx** for serving the frontend in production
- **Health checks** to ensure services start in the correct order

### Docker Environment Variables

When using Docker Compose, you can customize the database settings by editing `docker-compose.yml` or creating a `.env` file with:

```
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=kanban_db
MYSQL_USER=kanban_user
MYSQL_PASSWORD=kanban_password
```

## License

MIT

