import { PaddleService } from '../services/paddleService.js';

export class PaddleController {
  constructor() {
    this.paddleService = new PaddleService();
  }

  async createCheckout(req, res) {
    try {
      const { priceId, email, name, machineId } = req.body;

      if (!priceId || !email || !machineId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: priceId, email, machineId' 
        });
      }

      const result = await this.paddleService.createCheckout(
        priceId,
        email,
        name || '',
        { machineId }
      );

      if (result.success) {
        return res.json({ success: true, checkoutUrl: result.checkoutUrl, checkoutId: result.checkoutId });
      } else {
        return res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      console.error('Create checkout error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getPrices(req, res) {
    try {
      const prices = {
        monthly: {
          priceId: process.env.PADDLE_PRICE_ID_MONTHLY,
          amount: 29,
          currency: 'CNY',
          description: '月度 Pro'
        },
        yearly: {
          priceId: process.env.PADDLE_PRICE_ID_YEARLY,
          amount: 199,
          currency: 'CNY',
          description: '年度 Pro'
        }
      };

      return res.json({ success: true, prices });
    } catch (error) {
      console.error('Get prices error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
