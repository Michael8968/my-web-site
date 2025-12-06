import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 创建 Prisma Client，添加连接错误处理
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    // 添加连接超时和错误处理
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// 在开发环境缓存 Prisma 客户端，避免热重载时重复创建连接
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 优雅关闭连接
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}
