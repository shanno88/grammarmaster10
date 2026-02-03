import express from 'express';
import { WebhookController } from '../controllers/webhookController.js';

const router = express.Router();
const webhookController = new WebhookController();

router.post('/paddle', webhookController.handlePaddleWebhook.bind(webhookController));

export default router;
