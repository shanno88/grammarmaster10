# Grammar Master Web

前端独立部署项目，使用 Vercel 部署。

## 本地开发

```bash
cd web
npm install
npm run dev
```

## 环境变量

创建 `.env.local` 文件：

```
VITE_API_BASE_URL=https://grammarmaster10-production.up.railway.app
VITE_PADDLE_VENDOR_ID=your_vendor_id
VITE_PADDLE_ENV=sandbox
GEMINI_API_KEY=your_gemini_api_key
```

## 构建

```bash
npm run build
```
