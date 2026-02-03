import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// 提供静态文件
app.use(express.static(path.join(__dirname, 'dist')));

// 所有其他请求返回前端入口
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
