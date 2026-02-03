import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paddleRoutes from './routes/paddle.js';
import webhookRoutes from './routes/webhook.js';
import licenseRoutes from './routes/license.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Grammar Master Paddle Server' });
});

app.use('/api/paddle', paddleRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/licenses', licenseRoutes);

app.listen(PORT, () => {
  console.log(`Grammar Master Paddle Server running on port ${PORT}`);
});

export default app;
