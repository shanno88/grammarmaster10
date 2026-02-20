import nodemailer from 'nodemailer';

export class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      console.warn('SMTP configuration not found. Email service will be disabled.');
    }
  }

  async sendPurchaseConfirmationEmail(toEmail, planType, expiresAt) {
    if (!this.transporter) {
      console.log('Email service not configured. Purchase confirmation for:', toEmail);
      return { success: true, message: 'Email not configured, logged to console' };
    }

    const planName = planType === 'monthly' ? '月度 Pro' : planType === 'yearly' ? '年度 Pro' : 'Pro';
    const subject = '感谢您购买 Grammar Master Pro！';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">感谢您购买 Grammar Master Pro！</h2>
        <p>您好，感谢您的购买！您的 ${planName} 会员已激活。</p>
        ${expiresAt ? `<p><strong>有效期至：</strong>${new Date(expiresAt).toLocaleDateString('zh-CN')}</p>` : ''}
        <p>您现在可以享用所有 Pro 功能了！</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
        <p style="font-size: 12px; color: #6B7280;">
          此邮件由系统自动发送，请勿回复。如有问题请联系客服。
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: toEmail,
        subject,
        html
      });
      console.log(`Purchase confirmation email sent to ${toEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending purchase confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendRenewalConfirmationEmail(toEmail, newExpiresAt) {
    if (!this.transporter) {
      console.log('Email service not configured. Renewal confirmation for:', toEmail);
      return { success: true, message: 'Email not configured, logged to console' };
    }

    const subject = '您的 Grammar Master Pro 已续费';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">订阅续费成功！</h2>
        <p>您的 Grammar Master Pro 订阅已成功续费。</p>
        <p><strong>新的有效期至：</strong>${new Date(newExpiresAt).toLocaleDateString('zh-CN')}</p>
        <p>您现在可以继续享用所有 Pro 功能！</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: toEmail,
        subject,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending renewal confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendCancellationEmail(toEmail, lastExpireDate) {
    if (!this.transporter) {
      console.log('Email service not configured. Cancellation notice for:', toEmail);
      return { success: true, message: 'Email not configured, logged to console' };
    }

    const subject = '您的 Grammar Master Pro 订阅已取消';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">订阅已取消</h2>
        <p>您的 Grammar Master Pro 订阅已成功取消。</p>
        <p><strong>您仍可使用至：</strong>${lastExpireDate}</p>
        <p>感谢您使用我们的服务！</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: toEmail,
        subject,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPaymentFailedEmail(toEmail) {
    if (!this.transporter) {
      console.log('Email service not configured. Payment failed notice for:', toEmail);
      return { success: true, message: 'Email not configured, logged to console' };
    }

    const subject = '付款失败 - Grammar Master Pro';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #DC2626;">付款失败</h2>
        <p>我们无法处理您 Grammar Master Pro 订阅的付款。</p>
        <p>请更新您的付款信息以避免服务中断。</p>
        <p>如有问题，请联系客服。</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: toEmail,
        subject,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending payment failed email:', error);
      return { success: false, error: error.message };
    }
  }
}
