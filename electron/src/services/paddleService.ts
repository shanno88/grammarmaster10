const PADDLE_TOKEN = import.meta.env.VITE_PADDLE_VENDOR_ID || '';
const PADDLE_ENV = import.meta.env.VITE_PADDLE_ENV || 'sandbox';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface PlanDetails {
  priceId: string;
  amount: number;
  currency: string;
  description: string;
}

export interface Prices {
  monthly: PlanDetails;
  yearly: PlanDetails;
}

export interface CheckoutParams {
  planType: 'monthly' | 'yearly';
  email: string;
}

export interface SubscriptionStatus {
  success: boolean;
  isPro: boolean;
  planType: string | null;
  expiresAt: string | null;
  subscriptionId: string | null;
  status: string | null;
  error?: string;
}

declare global {
  interface Window {
    Paddle: any;
  }
}

let paddleInitialized = false;
let checkoutCompleteCallback: ((data: any) => void) | null = null;

export const PaddleService = {
  async initialize(onCheckoutComplete?: (data: any) => void): Promise<boolean> {
    if (onCheckoutComplete) {
      checkoutCompleteCallback = onCheckoutComplete;
    }

    if (paddleInitialized && window.Paddle?.Setup?.initialized) {
      return true;
    }

    if (!PADDLE_TOKEN) {
      console.warn('[PaddleService] VITE_PADDLE_VENDOR_ID not configured');
      return false;
    }

    return new Promise((resolve) => {
      const initSdk = () => {
        try {
          if (window.Paddle.Environment) {
            window.Paddle.Environment.set(PADDLE_ENV);
          }

          window.Paddle.Setup({
            token: PADDLE_TOKEN,
            eventCallback: (event: any) => {
              console.log('[PaddleService] Event:', event.name);
              if (event.name === 'checkout.completed' && checkoutCompleteCallback) {
                checkoutCompleteCallback(event.data);
              }
            }
          });

          paddleInitialized = true;
          console.log('[PaddleService] Initialized successfully');
          resolve(true);
        } catch (error) {
          console.error('[PaddleService] Init error:', error);
          resolve(false);
        }
      };

      if (window.Paddle) {
        initSdk();
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
        script.async = true;
        script.onload = initSdk;
        script.onerror = () => {
          console.error('[PaddleService] Failed to load SDK');
          resolve(false);
        };
        document.head.appendChild(script);
      }

      setTimeout(() => {
        if (!paddleInitialized) resolve(false);
      }, 10000);
    });
  },

  async getPrices(): Promise<{ success: boolean; prices?: Prices; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/paddle/prices`);
      return await response.json();
    } catch (error: any) {
      console.error('[PaddleService] getPrices error:', error);
      return { success: false, error: error.message };
    }
  },

  async openCheckout(params: CheckoutParams): Promise<{ success: boolean; error?: string }> {
    const { planType, email } = params;

    if (!email) {
      return { success: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    const initialized = await this.initialize();
    if (!initialized || !window.Paddle) {
      return { success: false, error: 'Payment system not available' };
    }

    try {
      const pricesRes = await this.getPrices();
      if (!pricesRes.success || !pricesRes.prices) {
        return { success: false, error: 'Unable to load pricing' };
      }

      const priceId = planType === 'monthly' 
        ? pricesRes.prices.monthly.priceId 
        : pricesRes.prices.yearly.priceId;

      if (!priceId) {
        return { success: false, error: 'Price not configured' };
      }

      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: { email },
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          successUrl: `${window.location.origin}${window.location.pathname}?checkout=success`,
        }
      });

      return { success: true };
    } catch (error: any) {
      console.error('[PaddleService] openCheckout error:', error);
      return { success: false, error: error.message || 'Failed to open checkout' };
    }
  },

  async getSubscriptionStatus(email: string): Promise<SubscriptionStatus> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/paddle/status?email=${encodeURIComponent(email)}`
      );
      return await response.json();
    } catch (error: any) {
      console.error('[PaddleService] getSubscriptionStatus error:', error);
      return {
        success: false,
        isPro: false,
        planType: null,
        expiresAt: null,
        subscriptionId: null,
        status: null,
        error: error.message
      };
    }
  },

  async cancelSubscription(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/paddle/subscription/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  isReady(): boolean {
    return paddleInitialized && !!window.Paddle;
  }
};
