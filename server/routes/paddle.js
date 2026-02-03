import express from 'express';
import { PaddleController } from '../controllers/paddleController.js';

const router = express.Router();
const paddleController = new PaddleController();

router.post('/create-checkout', paddleController.createCheckout.bind(paddleController));
router.get('/prices', paddleController.getPrices.bind(paddleController));

export default router;
