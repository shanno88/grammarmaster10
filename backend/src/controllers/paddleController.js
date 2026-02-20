import { PaddleService } from '../services/paddleService.js';
import { LicenseService } from '../services/licenseService.js';

const TRIAL_DAYS = 3;

export class PaddleController {
  constructor() {
    this.paddleService = new PaddleService();
    this.licenseService = new LicenseService();
  }

  async createCheckout(req, res) {
    try {
      const { planType, email, machineId } = req.body;

      console.log('[createCheckout]', { 
        planType: planType || 'MISSING', 
        email: email ? `${email.substring(0, 3)}***` : 'MISSING', 
        machineId: machineId || 'MISSING' 
      });

      if (!planType || !email) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing: planType, email',
          missingFields: [
            !planType && 'planType',
            !email && 'email'
          ].filter(Boolean)
        });
      }

      if (!['monthly', 'yearly'].includes(planType)) {
        return res.status(400).json({ success: false, error: 'Invalid planType. Must be "monthly" or "yearly"' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email' });
      }

      const priceId = planType === 'monthly' 
        ? process.env.PADDLE_PRICE_ID_MONTHLY 
        : process.env.PADDLE_PRICE_ID_YEARLY;

      if (!priceId) {
        console.error('[createCheckout] Missing PADDLE_PRICE_ID_' + planType.toUpperCase());
        return res.status(500).json({ success: false, error: 'Price not configured' });
      }

      let license = await this.licenseService.getLicenseByEmail(email);
      if (!license && machineId) {
        license = await this.licenseService.getLicenseByMachineId(machineId);
      }

      let trialGranted = false;
      if (!license) {
        license = this.licenseService.grantTrial(email, machineId, TRIAL_DAYS);
        trialGranted = true;
      }

      return res.json({
        success: true, 
        priceId,
        customerId: email,
        trialGranted,
        trialRemaining: license?.trialRemaining || 0
      });
    } catch (error) {
      console.error('[createCheckout] Error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getStatus(req, res) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing: email' 
        });
      }

      const license = await this.licenseService.getLicenseByEmail(email);

      if (!license) {
        return res.json({ 
          success: true,
          isPro: false,
          planType: 'trial',
          trialEnd: null,
          subscriptionEnd: null,
          status: 'none'
        });
      }

      const trialStatus = this.licenseService.getTrialStatus(license.email);
      const isPro = license.status === 'active' && ['monthly', 'yearly', 'subscription'].includes(license.planType);
      const now = new Date();
      
      let trialEnd = null;
      if (license.trialEnd) {
        const trialEndDate = new Date(license.trialEnd);
        if (trialEndDate > now) {
          trialEnd = license.trialEnd;
        }
      }

      let subscriptionEnd = null;
      if (license.expiresAt && isPro) {
        const expireDate = new Date(license.expiresAt);
        if (expireDate > now) {
          subscriptionEnd = license.expiresAt;
        }
      }

      return res.json({
        success: true,
        isPro,
        planType: isPro ? license.planType : (trialEnd ? 'trial' : null),
        trialEnd,
        subscriptionEnd,
        status: isPro ? 'active' : (trialEnd ? 'trial' : 'expired'),
        subscriptionId: license.subscriptionId || null
      });
    } catch (error) {
      console.error('[getStatus] Error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getPrices(req, res) {
    return res.json({
      success: true,
      prices: {
        monthly: {
          priceId: process.env.PADDLE_PRICE_ID_MONTHLY,
          amount: 9.9,
          currency: 'USD',
          description: 'Monthly Pro'
        },
        yearly: {
          priceId: process.env.PADDLE_PRICE_ID_YEARLY,
          amount: 99,
          currency: 'USD',
          description: 'Yearly Pro'
        }
      }
    });
  }

  async getSubscriptionStatus(req, res) {
    try {
      const { email, machineId } = req.query;

      if (!email && !machineId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing: email or machineId' 
        });
      }

      let license;
      if (email) {
        license = await this.licenseService.getLicenseByEmail(email);
      }
      if (!license && machineId) {
        license = await this.licenseService.getLicenseByMachineId(machineId);
      }

      if (!license) {
        return res.json({ 
          success: true,
          isPro: false,
          planType: null,
          expiresAt: null,
          subscriptionId: null,
          status: 'none',
          trialRemaining: 0,
          hasUsedTrial: false
        });
      }

      const trialStatus = this.licenseService.getTrialStatus(license.email);
      const status = this.licenseService.getStatus(license);

      return res.json({
        success: true,
        ...status,
        trialRemaining: trialStatus.trialRemaining
      });
    } catch (error) {
      console.error('[getSubscriptionStatus] Error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async cancelSubscription(req, res) {
    try {
      const { email, subscriptionId } = req.body;

      let license;
      if (subscriptionId) {
        license = await this.licenseService.getLicenseBySubscriptionId(subscriptionId);
      } else if (email) {
        license = await this.licenseService.getLicenseByEmail(email);
      }

      if (!license) {
        return res.status(404).json({ success: false, error: 'No subscription found' });
      }

      if (!license.subscriptionId) {
        return res.status(400).json({ success: false, error: 'No Paddle subscription' });
      }

      const result = await this.paddleService.cancelSubscription(license.subscriptionId);
      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      await this.licenseService.updateLicense(license.id, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });

      return res.json({ 
        success: true, 
        message: 'Subscription cancelled',
        effectiveUntil: license.expiresAt 
      });
    } catch (error) {
      console.error('[cancelSubscription] Error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
