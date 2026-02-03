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
        case 'subscription.created':
          await this.handleSubscriptionCreated(data);
          break;
        case 'subscription.updated':
          await this.handleSubscriptionUpdated(data);
          break;
        case 'subscription.cancelled':
          await this.handleSubscriptionCancelled(data);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(data);
          break;
        default:
          console.log(`Unhandled event type: ${eventType}`);
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

    if (!machineId || !customerEmail) {
      console.error('Missing machineId or customerEmail in checkout.completed');
      return;
    }

    let expireDate = null;
    let licenseType = 'subscription';

    if (priceId === process.env.PADDLE_PRICE_ID_MONTHLY) {
      const expireAt = new Date();
      expireAt.setMonth(expireAt.getMonth() + 1);
      expireDate = expireAt.toISOString().slice(0, 10).replace(/-/g, '');
    } else if (priceId === process.env.PADDLE_PRICE_ID_YEARLY) {
      const expireAt = new Date();
      expireAt.setFullYear(expireAt.getFullYear() + 1);
      expireDate = expireAt.toISOString().slice(0, 10).replace(/-/g, '');
    }

    const licenseCode = await this.licenseService.generateLicenseCode(machineId, expireDate, licenseType);
    
    await this.licenseService.saveLicense({
      machineId,
      email: customerEmail,
      code: licenseCode,
      type: licenseType,
      expireDate,
      paddleCustomerId: customer?.id,
      paddleTransactionId: data?.id,
      createdAt: new Date().toISOString()
    });

    await this.emailService.sendLicenseEmail(customerEmail, licenseCode, licenseType, expireDate);
  }

  async handleSubscriptionCreated(data) {
    const { customer, items, custom_data } = data;
    const machineId = custom_data?.machine_id;
    const customerEmail = customer?.email;
    const subscriptionId = data?.id;

    console.log(`Subscription created: ${subscriptionId} for ${customerEmail}`);
  }

  async handleSubscriptionUpdated(data) {
    const { customer, status, next_billed_at } = data;
    const customerEmail = customer?.email;
    const subscriptionId = data?.id;

    if (status === 'active') {
      const license = await this.licenseService.getLicenseByEmail(customerEmail);
      if (license) {
        const newExpireAt = new Date(next_billed_at);
        const newExpireDate = newExpireAt.toISOString().slice(0, 10).replace(/-/g, '');
        
        const newCode = await this.licenseService.generateLicenseCode(
          license.machineId,
          newExpireDate,
          'subscription'
        );

        await this.licenseService.updateLicense(license.id, {
          code: newCode,
          expireDate: newExpireDate,
          subscriptionId
        });

        await this.emailService.sendRenewalEmail(customerEmail, newCode, newExpireDate);
      }
    }
  }

  async handleSubscriptionCancelled(data) {
    const { customer, status } = data;
    const customerEmail = customer?.email;
    const subscriptionId = data?.id;

    if (status === 'canceled') {
      const license = await this.licenseService.getLicenseByEmail(customerEmail);
      if (license) {
        await this.licenseService.updateLicense(license.id, {
          subscriptionId,
          cancelledAt: new Date().toISOString()
        });

        await this.emailService.sendCancellationEmail(customerEmail, license.expireDate);
      }
    }
  }

  async handlePaymentFailed(data) {
    const { customer } = data;
    const customerEmail = customer?.email;

    await this.emailService.sendPaymentFailedEmail(customerEmail);
  }
}
