import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

// Configure Neon for WebSocket connections
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon connection pool for Drizzle AND session store
const neonPool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize Drizzle with schema
export const db = drizzle(neonPool, { schema });

// Export the same pool for connect-pg-simple (session store) to avoid duplicate connections
export const pool = neonPool;
