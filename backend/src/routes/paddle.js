import express from 'express';
import { PaddleController } from '../controllers/paddleController.js';
import { WebhookController } from '../controllers/webhookController.js';

const router = express.Router();
const paddleController = new PaddleController();
const webhookController = new WebhookController();

router.post('/checkout', paddleController.createCheckout.bind(paddleController));
router.post('/webhook', webhookController.handlePaddleWebhook.bind(webhookController));
router.get('/status', paddleController.getStatus.bind(paddleController));
router.get('/prices', paddleController.getPrices.bind(paddleController));
router.get('/subscription/status', paddleController.getSubscriptionStatus.bind(paddleController));
router.post('/subscription/cancel', paddleController.cancelSubscription.bind(paddleController));

export default router;
