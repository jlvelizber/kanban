import fs from 'fs';
import path from 'path';
import { pool } from './config';

export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Read schema file - handle both development and compiled paths
      let schemaPath = path.join(__dirname, 'schema.sql');
      if (!fs.existsSync(schemaPath)) {
        // Try parent directory if running from dist
        schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
        if (!fs.existsSync(schemaPath)) {
          // Try current directory structure
          schemaPath = path.join(process.cwd(), 'server', 'db', 'schema.sql');
        }
      }
      
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      
      // Split by semicolons and execute each statement
      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('use '));

      let completed = 0;
      const total = statements.length;

      if (total === 0) {
        console.log('✅ Database schema initialized');
        resolve();
        return;
      }

      statements.forEach((statement) => {
        if (statement.trim()) {
          pool.query(statement, (error: any) => {
            // Ignore "table already exists" and "database already exists" errors
            if (error && error.code !== 'ER_TABLE_EXISTS_ERROR' && error.code !== 'ER_DB_CREATE_EXISTS') {
              console.error('Error executing statement:', statement.substring(0, 50), error);
              // Continue anyway for some errors
            }
            
            completed++;
            if (completed === total) {
              console.log('✅ Database schema initialized');
              resolve();
            }
          });
        } else {
          completed++;
          if (completed === total) {
            console.log('✅ Database schema initialized');
            resolve();
          }
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      reject(error);
    }
  });
}

