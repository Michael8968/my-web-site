import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 配置 Neon WebSocket（用于无服务器环境）
// 使用条件导入，只在服务器端运行时加载
if (typeof window === 'undefined') {
  try {
    // 使用 require 而不是 import，避免 webpack 打包问题
    // webpack 已配置为外部化 ws 模块
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require('ws');
    // 处理 CommonJS 和 ES 模块的不同导出方式
    neonConfig.webSocketConstructor = ws.default || ws;
  } catch (error) {
    // 如果 ws 不可用，Neon 会使用默认的 WebSocket
    console.warn('ws module not available, using default WebSocket');
  }
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
