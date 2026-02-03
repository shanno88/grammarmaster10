const PADDLE_VENDOR_ID = import.meta.env.VITE_PADDLE_VENDOR_ID || '';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://grammarmaster10-production.up.railway.app';

interface CreateCheckoutParams {
  priceId: string;
  email: string;
  name?: string;
  machineId: string;
}

interface CheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  checkoutId?: string;
  error?: string;
}

interface PricesResponse {
  success: boolean;
  prices?: {
    monthly: {
      priceId: string;
      amount: number;
      currency: string;
      description: string;
    };
    yearly: {
      priceId: string;
      amount: number;
      currency: string;
      description: string;
    };
  };
  error?: string;
}

export const PaddleService = {
  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/paddle/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Paddle checkout creation error:', error);
      return { success: false, error: error.message };
    }
  },

  async getPrices(): Promise<PricesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/paddle/prices`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Paddle get prices error:', error);
      return { success: false, error: error.message };
    }
  },

  initializePaddle() {
    if (!PADDLE_VENDOR_ID) {
      console.warn('PADDLE_VENDOR_ID not set');
      return null;
    }

    if (typeof window === 'undefined') {
      return null;
    }

    const paddleScript = document.createElement('script');
    paddleScript.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    paddleScript.async = true;
    paddleScript.onload = () => {
      if ((window as any).Paddle) {
        (window as any).Paddle.Initialize({
          token: PADDLE_VENDOR_ID,
          environment: import.meta.env.VITE_PADDLE_ENV === 'production' ? 'production' : 'sandbox',
        });
      }
    };
    document.head.appendChild(paddleScript);
  },

  openCheckout(checkoutUrl: string) {
    if (typeof window !== 'undefined') {
      window.open(checkoutUrl, '_blank');
    }
  }
};
