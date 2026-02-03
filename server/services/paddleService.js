import crypto from 'crypto';

const PADDLE_API_BASE_URL = process.env.PADDLE_ENV === 'production' 
  ? 'https://api.paddle.com' 
  : 'https://sandbox-api.paddle.com';

export class PaddleService {
  constructor() {
    this.apiKey = process.env.PADDLE_API_KEY;
    this.baseUrl = PADDLE_API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.detail || 'Paddle API error');
      }
      
      return data;
    } catch (error) {
      console.error('Paddle API request error:', error);
      throw error;
    }
  }

  async createCheckout(priceId, customerEmail, customerName, metadata = {}) {
    try {
      const response = await this.makeRequest('/checkouts', {
        method: 'POST',
        body: JSON.stringify({
          items: [
            {
              priceId: priceId,
              quantity: 1,
            },
          ],
          customerEmail,
          customerName,
          settings: {
            displayMode: 'overlay',
            theme: 'light',
            successUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
            allowPaymentMethodChange: true,
          },
          customData: metadata,
        }),
      });

      return { success: true, checkoutUrl: response.data.url, checkoutId: response.data.id };
    } catch (error) {
      console.error('Paddle checkout creation error:', error);
      return { success: false, error: error.message };
    }
  }

  async getSubscription(subscriptionId) {
    try {
      const response = await this.makeRequest(`/subscriptions/${subscriptionId}`);
      return { success: true, subscription: response.data };
    } catch (error) {
      console.error('Paddle subscription fetch error:', error);
      return { success: false, error: error.message };
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const response = await this.makeRequest(`/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({
          effectiveFrom: 'immediately',
        }),
      });
      return { success: true, result: response.data };
    } catch (error) {
      console.error('Paddle subscription cancel error:', error);
      return { success: false, error: error.message };
    }
  }

  verifyWebhookSignature(payload, signature, secret) {
    try {
      if (!signature) {
        return false;
      }

      const parts = signature.split(',');
      const tsPart = parts.find(p => p.trim().startsWith('ts='));
      const v1Part = parts.find(p => p.trim().startsWith('v1='));

      if (!tsPart || !v1Part) {
        return false;
      }

      const ts = tsPart.trim().substring(3);
      const v1 = v1Part.trim().substring(3);

      const hmacPayload = `${ts}:${payload}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(hmacPayload)
        .digest('hex');

      const signatureMatches = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(v1, 'hex')
      );

      if (!signatureMatches) {
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (Math.abs(currentTime - parseInt(ts)) > 300) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }
}
