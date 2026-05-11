import { PrismaClient } from './generated/prisma/client.js';

// Import adapter and pool (example for PostgreSQL)
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Create pool from your env (add ?connection_limit=1 for edge/serverless if needed)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

// Create the required adapter
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,  // ← This satisfies the required type
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
