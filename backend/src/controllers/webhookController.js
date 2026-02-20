import { PaddleService } from '../services/paddleService.js';
import { LicenseService } from '../services/licenseService.js';
import { EmailService } from '../services/emailService.js';

export class WebhookController {
  constructor() {
    this.paddleService = new PaddleService();
    this.licenseService = new LicenseService();
    this.emailService = new EmailService();
  }

  async handlePaddleWebhook(req, res) {
    try {
      const signature = req.headers['paddle-signature'];
      const payload = JSON.stringify(req.body);

      if (!signature) {
        return res.status(401).json({ success: false, error: 'Missing signature' });
      }

      const isValid = this.paddleService.verifyWebhookSignature(
        payload,
        signature,
        process.env.PADDLE_WEBHOOK_SECRET
      );

      if (!isValid) {
        return res.status(401).json({ success: false, error: 'Invalid signature' });
      }

      const eventType = req.body.event_type;
      const data = req.body.data;

      switch (eventType) {
        case 'checkout.completed':
          await this.handleCheckoutCompleted(data);
          break;
        case 'transaction.completed':
          await this.handleTransactionCompleted(data);
          break;
        case 'subscription.created':
          await this.handleSubscriptionCreated(data);
          break;
        case 'subscription.activated':
          await this.handleSubscriptionActivated(data);
          break;
        case 'subscription.updated':
          await this.handleSubscriptionUpdated(data);
          break;
        case 'subscription.cancelled':
          await this.handleSubscriptionCancelled(data);
          break;
        case 'subscription.past_due':
          await this.handleSubscriptionPastDue(data);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(data);
          break;
        default:
          console.log(`[webhook] Unhandled event type: ${eventType}`);
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Webhook handling error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async handleCheckoutCompleted(data) {
    const { customer, items, custom_data } = data;
    const machineId = custom_data?.machine_id;
    const customerEmail = customer?.email;
    const priceId = items?.[0]?.price_id;
    const subscriptionId = data?.subscription_id || items?.[0]?.subscription_id || null;

    if (!machineId || !customerEmail) {
      console.error('Missing machineId or customerEmail in checkout.completed');
      return;
    }

    if (!subscriptionId) {
      console.warn(`[checkout.completed] No subscriptionId found for ${customerEmail}. May be one-time purchase or pending.`);
    }

    let expiresAt = null;
    let planType = 'subscription';

    if (priceId === process.env.PADDLE_PRICE_ID_MONTHLY) {
      const expireAt = new Date();
      expireAt.setMonth(expireAt.getMonth() + 1);
      expiresAt = expireAt.toISOString();
      planType = 'monthly';
    } else if (priceId === process.env.PADDLE_PRICE_ID_YEARLY) {
      const expireAt = new Date();
      expireAt.setFullYear(expireAt.getFullYear() + 1);
      expiresAt = expireAt.toISOString();
      planType = 'yearly';
    }
    
    await this.licenseService.saveLicense({
      machineId,
      email: customerEmail,
      status: 'active',
      planType,
      expiresAt,
      subscriptionId,
      paddleCustomerId: customer?.id,
      paddleTransactionId: data?.id
    });

    await this.emailService.sendPurchaseConfirmationEmail(customerEmail, planType, expiresAt);
    
    console.log(`[checkout.completed] Pro license activated for ${customerEmail}, subscriptionId: ${subscriptionId || 'N/A'}`);
  }

  async handleSubscriptionCreated(data) {
    const { customer, custom_data } = data;
    const customerEmail = customer?.email;
    const subscriptionId = data?.id;
    const status = data?.status;

    console.log(`[subscription.created] ${subscriptionId} for ${customerEmail}, status: ${status}`);

    if (!subscriptionId || !customerEmail) {
      console.warn('[subscription.created] Missing subscriptionId or customerEmail');
      return;
    }

    const license = await this.licenseService.getLicenseByEmail(customerEmail);
    if (license && !license.subscriptionId) {
      await this.licenseService.updateLicense(license.id, {
        subscriptionId,
        status: status === 'active' ? 'active' : license.status
      });
      console.log(`[subscription.created] Linked subscription ${subscriptionId} to license for ${customerEmail}`);
    } else if (!license) {
      console.warn(`[subscription.created] No license found for ${customerEmail} to link subscription`);
    }
  }

  async handleSubscriptionUpdated(data) {
    const { customer, status, next_billed_at, scheduled_change } = data;
    const customerEmail = customer?.email;
    const subscriptionId = data?.id;

    console.log(`[subscription.updated] ${subscriptionId} for ${customerEmail}, status: ${status}`);

    let license = await this.licenseService.getLicenseByEmail(customerEmail);
    
    if (!license) {
      license = await this.licenseService.getLicenseBySubscriptionId(subscriptionId);
    }

    if (!license) {
      console.warn(`[subscription.updated] No license found for ${customerEmail} or subscription ${subscriptionId}`);
      return;
    }

    if (status === 'active' && next_billed_at) {
      const newExpiresAt = new Date(next_billed_at).toISOString();
      
      await this.licenseService.updateLicense(license.id, {
        expiresAt: newExpiresAt,
        subscriptionId,
        status: 'active'
      });

      await this.emailService.sendRenewalConfirmationEmail(customerEmail, newExpiresAt);
    } else if (status === 'canceled' || status === 'paused') {
      await this.licenseService.updateLicense(license.id, {
        status: status === 'canceled' ? 'cancelled' : 'paused',
        subscriptionId
      });
    }
  }

  async handleSubscriptionCancelled(data) {
    const { customer, status } = data;
    const customerEmail = customer?.email;
    const subscriptionId = data?.id;

    console.log(`[subscription.cancelled] ${subscriptionId} for ${customerEmail}, status: ${status}`);

    let license = await this.licenseService.getLicenseByEmail(customerEmail);
    
    if (!license) {
      license = await this.licenseService.getLicenseBySubscriptionId(subscriptionId);
    }

    if (!license) {
      console.warn(`[subscription.cancelled] No license found for ${customerEmail} or subscription ${subscriptionId}`);
      return;
    }

    await this.licenseService.updateLicense(license.id, {
      subscriptionId,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });

    await this.emailService.sendCancellationEmail(customerEmail, license.expiresAt);
  }

  async handlePaymentFailed(data) {
    const { customer } = data;
    const customerEmail = customer?.email;

    await this.emailService.sendPaymentFailedEmail(customerEmail);
  }

  async handleTransactionCompleted(data) {
    const { customer, items, custom_data } = data;
    const customerEmail = customer?.email;
    const priceId = items?.[0]?.price_id;
    const machineId = custom_data?.machine_id;

    console.log(`[transaction.completed] for ${customerEmail}`);

    if (!customerEmail) {
      console.warn('[transaction.completed] Missing customerEmail');
      return;
    }

    let license = await this.licenseService.getLicenseByEmail(customerEmail);
    if (!license && machineId) {
      license = await this.licenseService.getLicenseByMachineId(machineId);
    }

    if (!license) {
      console.warn(`[transaction.completed] No license found for ${customerEmail}`);
      return;
    }

    let expiresAt = license.expiresAt;
    let planType = license.planType;

    if (priceId === process.env.PADDLE_PRICE_ID_MONTHLY) {
      const expireAt = new Date();
      expireAt.setMonth(expireAt.getMonth() + 1);
      expiresAt = expireAt.toISOString();
      planType = 'monthly';
    } else if (priceId === process.env.PADDLE_PRICE_ID_YEARLY) {
      const expireAt = new Date();
      expireAt.setFullYear(expireAt.getFullYear() + 1);
      expiresAt = expireAt.toISOString();
      planType = 'yearly';
    }

    await this.licenseService.updateLicense(license.id, {
      status: 'active',
      planType,
      expiresAt,
      paddleTransactionId: data?.id
    });

    console.log(`[transaction.completed] License updated for ${customerEmail}`);
  }

  async handleSubscriptionActivated(data) {
    const { customer, status, next_billed_at, billing_cycle } = data;
    const customerEmail = customer?.email;
    const subscriptionId = data?.id;

    console.log(`[subscription.activated] ${subscriptionId} for ${customerEmail}`);

    if (!customerEmail) {
      console.warn('[subscription.activated] Missing customerEmail');
      return;
    }

    let license = await this.licenseService.getLicenseByEmail(customerEmail);
    if (!license) {
      license = await this.licenseService.getLicenseBySubscriptionId(subscriptionId);
    }

    if (!license) {
      console.warn(`[subscription.activated] No license found for ${customerEmail}`);
      return;
    }

    const planType = billing_cycle?.interval === 'year' ? 'yearly' : 'monthly';
    let expiresAt = license.expiresAt;

    if (next_billed_at) {
      expiresAt = new Date(next_billed_at).toISOString();
    }

    await this.licenseService.updateLicense(license.id, {
      status: 'active',
      planType,
      subscriptionId,
      expiresAt
    });

    console.log(`[subscription.activated] License activated for ${customerEmail}, planType: ${planType}`);
  }

  async handleSubscriptionPastDue(data) {
    const { customer } = data;
    const customerEmail = customer?.email;
    const subscriptionId = data?.id;

    console.log(`[subscription.past_due] ${subscriptionId} for ${customerEmail}`);

    let license = await this.licenseService.getLicenseByEmail(customerEmail);
    if (!license) {
      license = await this.licenseService.getLicenseBySubscriptionId(subscriptionId);
    }

    if (!license) {
      return;
    }

    await this.licenseService.updateLicense(license.id, {
      status: 'past_due',
      subscriptionId
    });

    await this.emailService.sendPaymentFailedEmail(customerEmail);
  }
}
