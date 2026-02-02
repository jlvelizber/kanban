import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: mysql.PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kanban_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Test connection
export function testConnection(): Promise<boolean> {
  return new Promise((resolve) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('❌ Database connection failed:', err);
        resolve(false);
        return;
      }
      connection.ping((pingErr) => {
        connection.release();
        if (pingErr) {
          console.error('❌ Database ping failed:', pingErr);
          resolve(false);
          return;
        }
        console.log('✅ Database connection successful');
        resolve(true);
      });
    });
  });
}

