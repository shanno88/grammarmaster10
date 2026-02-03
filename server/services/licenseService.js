import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

let licenses = [];

export class LicenseService {
  constructor() {
    this.licenses = licenses;
  }

  async sha256(message) {
    return crypto.createHash('sha256').update(message).digest('hex').toUpperCase();
  }

  async generateLicenseCode(machineId, expireDate = null, type = 'subscription') {
    const secret = process.env.LICENSE_SECRET || 'default-secret';

    if (type === 'lifetime') {
      const payload = machineId + secret;
      const fullHash = await this.sha256(payload);
      return fullHash.substring(0, 12);
    } else if (type === 'subscription' && expireDate) {
      const payload = machineId + expireDate + secret;
      const fullHash = await this.sha256(payload);
      return `${expireDate}-${fullHash.substring(0, 8)}`;
    }

    throw new Error('Invalid license type or missing expireDate');
  }

  async verifyLicenseCode(machineId, inputCode) {
    const code = inputCode.trim().toUpperCase();
    const secret = process.env.LICENSE_SECRET || 'default-secret';

    if (code.includes('-') && code.length > 10) {
      const [expireDate, signature] = code.split('-');
      const payload = machineId + expireDate + secret;
      const fullHash = await this.sha256(payload);

      if (signature === fullHash.substring(0, 8)) {
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        if (today > expireDate) {
          return { valid: false, reason: 'expired' };
        }
        return { valid: true, type: 'subscription', expireDate };
      }
    } else if (code.length === 12) {
      const payload = machineId + secret;
      const fullHash = await this.sha256(payload);

      if (code === fullHash.substring(0, 12)) {
        return { valid: true, type: 'lifetime' };
      }
    }

    return { valid: false, reason: 'invalid' };
  }

  async saveLicense(licenseData) {
    const license = {
      id: uuidv4(),
      ...licenseData,
      createdAt: new Date().toISOString()
    };
    
    this.licenses.push(license);
    
    return license;
  }

  async getLicenseById(id) {
    return this.licenses.find(l => l.id === id);
  }

  async getLicenseByEmail(email) {
    return this.licenses.find(l => l.email.toLowerCase() === email.toLowerCase());
  }

  async getLicensesByMachineId(machineId) {
    return this.licenses.filter(l => l.machineId === machineId);
  }

  async updateLicense(id, updates) {
    const index = this.licenses.findIndex(l => l.id === id);
    if (index !== -1) {
      this.licenses[index] = { ...this.licenses[index], ...updates, updatedAt: new Date().toISOString() };
      return this.licenses[index];
    }
    return null;
  }

  async getAllLicenses() {
    return this.licenses;
  }

  async deleteLicense(id) {
    const index = this.licenses.findIndex(l => l.id === id);
    if (index !== -1) {
      const deleted = this.licenses.splice(index, 1)[0];
      return deleted;
    }
    return null;
  }

  async regenerateLicense(id) {
    const license = await this.getLicenseById(id);
    if (!license) {
      throw new Error('License not found');
    }

    const newCode = await this.generateLicenseCode(
      license.machineId,
      license.expireDate,
      license.type
    );

    return await this.updateLicense(id, { code: newCode });
  }
}
