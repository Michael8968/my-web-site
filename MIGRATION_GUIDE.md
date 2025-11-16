# PostgreSQL 迁移指南

本指南将帮助您将项目从 SQLite 迁移到 PostgreSQL，以便在 Vercel 等无服务器环境中正常运行。

## 为什么需要迁移？

SQLite 使用文件系统存储数据，在 Vercel 等无服务器环境中，文件系统是只读的，无法写入数据库文件。因此需要切换到 PostgreSQL 等云数据库。

## 迁移步骤

### 1. 选择 PostgreSQL 服务提供商

推荐选项：

- **Neon**（推荐）：无服务器 PostgreSQL，完美适合 Vercel，免费层充足
- **Vercel Postgres**：与 Vercel 集成，设置简单
- **Supabase**：免费层提供 PostgreSQL
- **PlanetScale**：MySQL 兼容（需要调整 schema）
- **Railway**：简单易用的 PostgreSQL 服务

> 本指南重点介绍 **Neon** 的配置步骤。

### 2. 创建 Neon 数据库

#### 步骤 1：注册 Neon 账户

1. 访问 [Neon 官网](https://neon.tech)
2. 使用 GitHub 账户注册（推荐）或创建新账户
3. 完成注册后，进入控制台

#### 步骤 2：创建项目

1. 在 Neon 控制台中，点击 **Create Project**
2. 填写项目信息：
   - **Project Name**: 输入项目名称（如 `my-web-site`）
   - **Region**: 选择离您最近的区域（推荐选择与 Vercel 相同的区域）
   - **PostgreSQL Version**: 选择最新版本（推荐 15 或 16）
3. 点击 **Create Project**

#### 步骤 3：获取连接字符串

创建项目后，Neon 会显示连接信息：

1. 在项目概览页面，找到 **Connection Details**
2. 复制以下连接字符串：
   - **Connection string** - 这是带连接池的 URL（用于应用）
   - **Connection string (pooled)** - 如果需要，也可以使用这个
   - **Connection string (direct)** - 用于 Prisma Migrate 的直接连接

#### 步骤 4：安装 Neon 依赖

在项目根目录运行：

```bash
npm install @prisma/adapter-neon @neondatabase/serverless
```

#### 步骤 5：更新 Prisma Schema

在 `prisma/schema.prisma` 中，确保配置了 `directUrl`（用于迁移）：

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

#### 步骤 6：安装依赖

运行以下命令安装 Neon 相关依赖：

```bash
npm install @prisma/adapter-neon @neondatabase/serverless ws
npm install -D @types/ws
```

> ✅ **已完成**：`lib/prisma.ts` 已经配置为使用 Neon 适配器，无需手动修改。

### 3. 配置环境变量

#### 在 Vercel 中配置

1. 进入 Vercel 项目设置
2. 进入 **Environment Variables** 标签
3. 添加以下环境变量：

**使用 Neon：**

```
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

> **注意**：
>
> - `DATABASE_URL` 使用 Neon 的连接字符串（带连接池）
> - `DIRECT_URL` 使用 Neon 的直接连接字符串（用于 Prisma Migrate）
> - 两个 URL 通常相同，但如果有连接池 URL，`DATABASE_URL` 可以使用连接池版本

#### 在本地开发环境配置

创建或更新 `.env.local` 文件：

```env
# Neon 数据库连接（开发环境）
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# 其他环境变量
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
```

> **提示**：您可以在 Neon 控制台的 **Connection Details** 中直接复制这些连接字符串。

### 4. 运行数据库迁移

#### 首次迁移（创建表结构）

```bash
# 生成 Prisma Client
npm run db:generate

# 创建迁移文件
npm run db:migrate

# 或者直接推送 schema（开发环境）
npm run db:push
```

#### 在生产环境部署迁移

在 Vercel 的构建命令中，确保包含：

```bash
npm run db:generate && npm run db:migrate:deploy
```

或者在 Vercel 项目设置中配置 **Build Command**：

```bash
npm install && npm run db:generate && npm run build
```

并在 **Install Command** 后添加：

```bash
npm run db:migrate:deploy
```

### 5. 迁移现有数据（如果有）

如果您有现有的 SQLite 数据需要迁移：

1. **导出 SQLite 数据**：

   ```bash
   sqlite3 prisma/dev.db .dump > data.sql
   ```

2. **转换数据格式**（需要手动调整 SQL 语句以适配 PostgreSQL）

3. **导入到 PostgreSQL**：
   ```bash
   psql $DATABASE_URL < data.sql
   ```

或者使用数据迁移工具如 [pgloader](https://pgloader.readthedocs.io/)：

```bash
pgloader sqlite://prisma/dev.db postgresql://user:password@host:port/database
```

### 6. 验证迁移

1. **检查数据库连接**：

   ```bash
   npm run db:studio
   ```

   这会打开 Prisma Studio，您可以在浏览器中查看和管理数据。

2. **测试 API**：
   访问您的 API 端点，确保一切正常工作。

## 常见问题

### Q: 迁移后出现连接错误？

A: 检查以下几点：

- 确保 `DATABASE_URL` 环境变量正确设置
- 检查数据库是否允许来自 Vercel IP 的连接
- 确认数据库服务是否正常运行

### Q: 如何回退到 SQLite？

A: 如果您需要回退：

1. 将 `prisma/schema.prisma` 中的 `provider` 改回 `"sqlite"`
2. 更新 `DATABASE_URL` 为 `file:./dev.db`
3. 运行 `npm run db:push`

### Q: 迁移后性能如何？

A: PostgreSQL 在云环境中通常比 SQLite 性能更好，特别是在并发访问场景下。

## 下一步

迁移完成后：

- ✅ 更新 CI/CD 配置（如果需要）
- ✅ 更新文档中的数据库说明
- ✅ 测试所有数据库相关功能
- ✅ 备份数据库（定期）

## Neon 特定说明

### Neon 的优势

- ✅ **无服务器架构**：完美适配 Vercel 等无服务器平台
- ✅ **自动休眠**：空闲时自动休眠，节省资源
- ✅ **快速启动**：首次连接时自动唤醒（通常 < 1 秒）
- ✅ **免费层充足**：免费层提供 0.5 GB 存储和 192 MB RAM
- ✅ **分支功能**：可以创建数据库分支用于测试

### 处理 Neon 自动休眠

Neon 的计算实例在空闲时会自动休眠。首次连接可能需要几秒钟来唤醒实例。这是正常行为，后续连接会很快。

如果遇到连接超时，可以在连接字符串中添加超时参数：

```
DATABASE_URL="postgresql://...?sslmode=require&connect_timeout=10"
```

### Neon 分支功能

Neon 支持创建数据库分支，非常适合：

- 开发/测试环境隔离
- 功能分支测试
- 数据快照和恢复

在 Neon 控制台的 **Branches** 标签中可以创建和管理分支。

## 参考资源

- [Neon 官方文档](https://neon.tech/docs)
- [Neon + Prisma 集成指南](https://neon.tech/docs/integrations/prisma)
- [Prisma PostgreSQL 文档](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Prisma 迁移指南](https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-sqlite)
