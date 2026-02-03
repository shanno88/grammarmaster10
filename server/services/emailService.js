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

  async sendLicenseEmail(toEmail, licenseCode, licenseType, expireDate) {
    if (!this.transporter) {
      console.log('Email service not configured. License code:', licenseCode);
      console.log('Would send to:', toEmail);
      return { success: true, message: 'Email not configured, logged to console' };
    }

    const subject = '您的 Grammar Master Pro 激活码';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">感谢您购买 Grammar Master Pro！</h2>
        <p>您好，感谢您的购买！以下是您的激活码：</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; color: #1F2937;">
            ${licenseCode}
          </p>
        </div>
        <p><strong>许可证类型：</strong>${licenseType === 'lifetime' ? '永久会员' : '订阅会员'}</p>
        ${expireDate ? `<p><strong>有效期至：</strong>${expireDate}</p>` : ''}
        <p>请在应用中输入此激活码以完成激活。</p>
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
      console.log(`License email sent to ${toEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending license email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendRenewalEmail(toEmail, newLicenseCode, newExpireDate) {
    if (!this.transporter) {
      console.log('Email service not configured. New license code:', newLicenseCode);
      return { success: true, message: 'Email not configured, logged to console' };
    }

    const subject = '您的 Grammar Master Pro 已续费';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">订阅续费成功！</h2>
        <p>您的 Grammar Master Pro 订阅已成功续费。</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; color: #1F2937;">
            ${newLicenseCode}
          </p>
        </div>
        <p><strong>新的有效期至：</strong>${newExpireDate}</p>
        <p>请在应用中输入此新的激活码以完成续费激活。</p>
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
      console.error('Error sending renewal email:', error);
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
