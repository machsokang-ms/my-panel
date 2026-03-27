import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'panel_admin',
  password: process.env.DB_PASSWORD || 'panel_secret_password',
  database: process.env.DB_NAME || 'mypanel',
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDB = async () => {
  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Servers table
    await query(`
      CREATE TABLE IF NOT EXISTS servers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        ip_address VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        cpu_cores INTEGER,
        ram_gb INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Apps (Containers) table
    await query(`
      CREATE TABLE IF NOT EXISTS apps (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        template_id VARCHAR(50),
        container_id TEXT,
        domain TEXT,
        status VARCHAR(20) DEFAULT 'running',
        project VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Repositories table
    await query(`
      CREATE TABLE IF NOT EXISTS repositories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        url TEXT NOT NULL,
        provider VARCHAR(50) DEFAULT 'github',
        branch VARCHAR(50) DEFAULT 'main',
        access_token TEXT,
        project VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Storage table
    await query(`
      CREATE TABLE IF NOT EXISTS storage (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 's3',
        endpoint TEXT,
        region VARCHAR(50),
        access_key TEXT,
        secret_key TEXT,
        bucket VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};
