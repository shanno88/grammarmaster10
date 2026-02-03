# Grammar Master Pro - Paddle 支付集成

## 概述

本项目已集成 Paddle 支付方案，支持在线支付和自动发送激活码。

## 项目结构

```
grammar-master-pro (7ds)/
├── src/                          # 前端代码
│   ├── services/
│   │   └── paddleService.ts     # Paddle 前端服务
│   └── ...
├── server/                       # 后端服务
│   ├── controllers/
│   │   ├── paddleController.js   # Paddle 控制器
│   │   └── webhookController.js  # Webhook 控制器
│   ├── routes/
│   │   ├── paddle.js            # Paddle 路由
│   │   └── webhook.js           # Webhook 路由
│   ├── services/
│   │   ├── paddleService.js      # Paddle SDK 封装
│   │   ├── licenseService.js    # 激活码生成服务
│   │   └── emailService.js      # 邮件发送服务
│   ├── index.js                 # 后端入口
│   ├── package.json             # 后端依赖
│   └── .env.example             # 环境变量模板
└── ...
```

## 环境变量配置

### 前端环境变量 (`.env.local`)

```env
# Paddle Configuration
VITE_PADDLE_VENDOR_ID=your_vendor_id_here
VITE_PADDLE_ENV=sandbox
VITE_API_BASE_URL=http://localhost:3001

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
```

### 后端环境变量 (`server/.env`)

```env
# Paddle Configuration
PADDLE_VENDOR_ID=your_vendor_id_here
PADDLE_API_KEY=your_api_key_here
PADDLE_WEBHOOK_SECRET=your_webhook_secret_here

# Paddle Price IDs (从 Paddle Dashboard 获取)
PADDLE_PRICE_ID_MONTHLY=price_01hxxxxx
PADDLE_PRICE_ID_YEARLY=price_01hxxxxx

# SMTP Configuration (邮件服务)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@yourdomain.com

# License Configuration
LICENSE_SECRET=your_license_secret_key_here

# Server Configuration
SERVER_PORT=3001
```

## 安装和运行

### 1. 安装前端依赖

```bash
npm install
```

### 2. 安装后端依赖

```bash
cd server
npm install
```

### 3. 配置环境变量

- 复制 `.env.local` 并填写 Paddle 配置
- 复制 `server/.env.example` 为 `server/.env` 并填写后端配置

### 4. 启动后端服务

```bash
cd server
npm start
```

或使用开发模式（自动重启）：

```bash
npm run dev
```

### 5. 启动前端开发服务器

```bash
npm run dev
```

## Paddle 配置步骤

### 1. 创建 Paddle 账户

1. 访问 [Paddle 官网](https://www.paddle.com/) 并注册账户
2. 完成 KYC 验证

### 2. 创建产品和价格

1. 在 Paddle Dashboard 中创建产品
2. 创建两个价格：
   - 月度订阅: ¥29
   - 年度订阅: ¥199
3. 复制 Price IDs 到环境变量 `PADDLE_PRICE_ID_MONTHLY` 和 `PADDLE_PRICE_ID_YEARLY`

### 3. 配置 Webhook

1. 在 Paddle Dashboard 中设置 Webhook URL: `https://your-domain.com/webhook/paddle`
2. 选择需要接收的事件：
   - `checkout.completed` - 支付完成
   - `subscription.created` - 订阅创建
   - `subscription.updated` - 订阅更新（续费）
   - `subscription.cancelled` - 订阅取消
   - `payment.failed` - 支付失败
3. 复制 Webhook Secret 到环境变量 `PADDLE_WEBHOOK_SECRET`

### 4. 获取 API 密钥

1. 在 Paddle Dashboard 中生成 API Key
2. 复制 API Key 到环境变量 `PADDLE_API_KEY`
3. 复制 Vendor ID 到环境变量 `PADDLE_VENDOR_ID`

## 支付流程

### 用户购买流程

1. 用户点击"升级会员"按钮
2. 在支付弹窗中选择：
   - **在线支付**（Paddle）：输入邮箱 → 选择套餐 → 完成支付 → 自动收邮件激活码
   - **微信支付**：扫码联系客服 → 发送机器码 → 等待客服发注册码
3. 使用激活码在应用中完成激活

### 自动发码流程

1. 用户在 Paddle 完成支付
2. Paddle 发送 `checkout.completed` webhook 事件到后端
3. 后端验证 webhook 签名
4. 根据购买的套餐生成激活码
5. 将激活码保存到 license 记录
6. 发送激活码邮件到用户邮箱

### 订阅续费流程

1. Paddle 自动续费成功
2. 发送 `subscription.updated` webhook 事件
3. 后端生成新的激活码
4. 发送续费通知邮件到用户邮箱

### 订阅取消流程

1. 用户取消订阅
2. 发送 `subscription.cancelled` webhook 事件
3. 后端更新 license 记录
4. 发送取消通知邮件

## 激活码格式

### 订阅激活码

格式：`EXPIRE_DATE-HASH`

示例：`20251231-A1B2C3D4`

- `EXPIRE_DATE`: 8位数字，格式为 YYYYMMDD
- `HASH`: 前端验证时的签名

### 永久激活码

格式：12位大写字母和数字

示例：`A1B2C3D4E5F6`

## 邮件服务配置

### Gmail 配置

1. 启用两步验证
2. 生成应用专用密码
3. 配置环境变量：
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

### 其他邮件服务

支持任何 SMTP 兼容的邮件服务，如：
- SendGrid
- Mailgun
- Amazon SES
- 自建邮件服务器

## 许可证管理

### 获取所有许可证（开发调试）

发送 GET 请求到 `http://localhost:3001/api/paddle/licenses`

### 查询特定用户的许可证

需要扩展 API 接口，可参考 `licenseService.js` 中的方法。

### 重新生成激活码

需要扩展 API 接口，可参考 `licenseService.js` 中的 `regenerateLicense` 方法。

## 部署

### 后端部署

推荐部署到：
- Railway
- Render
- Heroku
- VPS (自建)

### 前端部署

可部署到：
- Vercel
- Netlify
- GitHub Pages

### 注意事项

1. **HTTPS**: 生产环境必须使用 HTTPS
2. **Webhook URL**: 必须是公网可访问的 URL
3. **环境变量**: 不要在代码中硬编码敏感信息
4. **数据库**: 生产环境建议使用真实数据库替代内存存储

## 安全建议

1. 定期轮换 API 密钥
2. 使用强密码作为 LICENSE_SECRET
3. 启用 Webhook 签名验证
4. 限制 API 访问频率
5. 记录所有交易日志

## 故障排查

### Paddle SDK 加载失败

检查 `VITE_PADDLE_VENDOR_ID` 是否正确配置。

### Webhook 验证失败

确认 `PADDLE_WEBHOOK_SECRET` 与 Paddle Dashboard 中的一致。

### 邮件发送失败

检查 SMTP 配置和网络连接。

### 激活码验证失败

确认 LICENSE_SECRET 前后端一致，机器码正确。

## 技术支持

如有问题，请检查：
1. 后端日志输出
2. Paddle Dashboard 中的交易记录
3. 浏览器控制台错误信息

## 许可证

请参考项目根目录的 LICENSE 文件。
