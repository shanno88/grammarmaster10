# 快速启动指南

## 首次启动

### 1. 安装所有依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.local.example .env.local
cp server/.env.example server/.env
```

编辑 `.env.local` 和 `server/.env` 文件，填写实际的配置值。

### 3. 启动服务

#### 方式一：分别启动

```bash
# 终端 1：启动后端
npm run server:dev

# 终端 2：启动前端
npm run dev
```

#### 方式二：同时启动（推荐）

```bash
# 首先安装 concurrently
npm install -D concurrently

# 同时启动前后端
npm run dev:all
```

### 4. 访问应用

- 前端开发服务器：http://localhost:5173
- 后端 API 服务器：http://localhost:3001
- 健康检查：http://localhost:3001/health

## 开发调试

### 查看 Webhook 日志

后端会打印所有收到的 Paddle webhook 事件，可用于调试。

### 测试激活码验证

```bash
# 获取机器码（在浏览器控制台运行）
localStorage.getItem('grammar_machine_id')
```

### 重置应用数据

点击应用界面上的 "专家模式" 图标（连续点击8次）进入设置，选择"重置应用数据"。

## 生产部署

请参考 [PADDLE_INTEGRATION.md](./PADDLE_INTEGRATION.md) 中的部署章节。

## 常见问题

### 后端无法启动

- 检查端口 3001 是否被占用
- 检查 `server/.env` 是否配置正确

### Paddle SDK 加载失败

- 检查 `.env.local` 中的 `VITE_PADDLE_VENDOR_ID` 是否正确
- 确保网络可以访问 `cdn.paddle.com`

### 邮件发送失败

- 检查 SMTP 配置
- 某些邮件服务（如 Gmail）需要使用应用专用密码

## 下一步

1. 注册 Paddle 账户并获取 API 密钥
2. 在 Paddle Dashboard 中创建产品和价格
3. 配置 Webhook URL（需要公网可访问的地址）
4. 测试完整的支付流程
