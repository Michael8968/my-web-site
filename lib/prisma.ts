import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 配置 Neon WebSocket（用于无服务器环境）
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

// 创建 Neon 连接池和适配器（如果 DATABASE_URL 存在）
const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : undefined;
const adapter = pool ? new PrismaNeon(pool) : undefined;

export const prisma =
  globalForPrisma.prisma ??
  (adapter
    ? new PrismaClient({
        adapter: adapter as any,
        log:
          process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
      } as any)
    : new PrismaClient({
        log:
          process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
      }));

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 处理 Prisma 客户端关闭
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}
