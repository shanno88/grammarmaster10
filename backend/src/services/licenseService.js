import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'licenses.db');

let db = null;

export class LicenseService {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (db) {
      this.db = db;
      return;
    }
    
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    
    // Ensure table exists with full schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS licenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        machineId TEXT,
        activationCode TEXT,
        licenseKey TEXT UNIQUE,
        status TEXT DEFAULT 'inactive',
        planType TEXT DEFAULT 'trial',
        trialRemaining INTEGER DEFAULT 3,
        trialEnd DATETIME,
        subscriptionId TEXT,
        paddleCustomerId TEXT,
        paddleTransactionId TEXT,
        expiresAt TEXT,
        cancelledAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME
      )
    `);
    
    // Ensure indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_licenses_machineId ON licenses(machineId)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_licenses_activationCode ON licenses(activationCode)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_licenses_subscriptionId ON licenses(subscriptionId)`);
    
    this.db = db;
    console.log('[LicenseService] Database initialized');
  }

  // ============ Activation Code (Legacy) ============

  checkActivationCode(code) {
    // Self-healing: ensure DB is ready
    this.initDatabase();
    
    try {
      if (!code || typeof code !== 'string') {
        console.log('[checkActivationCode] Invalid code format');
        return { success: false, error: 'Invalid code format' };
      }
      
      const trimmedCode = code.trim().toUpperCase();
      console.log(`[checkActivationCode] Checking: ${trimmedCode.substring(0, 8)}...`);
      
      // Dual field check: activationCode OR licenseKey
      const license = this.db.prepare(`
        SELECT * FROM licenses WHERE activationCode = ? OR licenseKey = ?
      `).get(trimmedCode, trimmedCode);
      
      if (license) {
        // Activate the license
        this.db.prepare(`
          UPDATE licenses SET status = 'active', planType = 'pro', updatedAt = datetime("now") 
          WHERE id = ?
        `).run(license.id);
        
        console.log(`[checkActivationCode] ✅ Activated: ${license.email}`);
        return { success: true, status: 'pro', email: license.email };
      }
      
      console.log(`[checkActivationCode] ❌ Code not found: ${trimmedCode.substring(0, 8)}...`);
      return { success: false, error: 'Invalid activation code' };
    } catch (e) {
      console.error('[checkActivationCode] 💥 Error:', e);
      // Try to reinitialize DB on error
      try {
        this.initDatabase();
      } catch (e2) {
        console.error('[checkActivationCode] DB reinit failed:', e2);
      }
      return { success: false, error: 'Database error' };
    }
  }

  // ============ Trial ============

  getTrialStatus(email) {
    try {
      const license = this.getLicenseByEmail(email);
      
      if (!license) {
        return { trialRemaining: 0, isPro: false, status: 'none' };
      }
      
      if (license.status === 'active' && license.planType !== 'trial') {
        return { trialRemaining: 0, isPro: true, status: 'pro' };
      }
      
      if (license.trialEnd) {
        const trialEnd = new Date(license.trialEnd);
        if (new Date() < trialEnd) {
          const daysLeft = Math.ceil((trialEnd.getTime() - Date.now()) / 86400000);
          return { trialRemaining: Math.max(0, daysLeft), isPro: false, status: 'trial' };
        }
      }
      
      return { trialRemaining: 0, isPro: false, status: 'expired' };
    } catch (e) {
      console.error('[getTrialStatus] Error:', e);
      return { trialRemaining: 0, isPro: false, status: 'error' };
    }
  }

  grantTrial(email, machineId, days = 3) {
    try {
      const existing = this.getLicenseByEmail(email);
      if (existing) return existing;
      
      if (machineId) {
        const byMachine = this.getLicenseByMachineId(machineId);
        if (byMachine) return byMachine;
      }
      
      const trialEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      const licenseKey = `TRIAL-${Date.now().toString(36).toUpperCase()}`;
      
      this.db.prepare(`
        INSERT INTO licenses (email, machineId, licenseKey, status, planType, trialRemaining, trialEnd)
        VALUES (?, ?, ?, 'trial', 'trial', ?, ?)
      `).run(email, machineId || '', licenseKey, days, trialEnd);
      
      console.log(`[grantTrial] ${days}-day trial for ${email.substring(0, 3)}***`);
      return this.getLicenseByEmail(email);
    } catch (e) {
      console.error('[grantTrial] Error:', e);
      return null;
    }
  }

  // ============ Subscription Status ============

  getStatus(license) {
    if (!license) {
      return {
        isPro: false,
        planType: null,
        expiresAt: null,
        subscriptionId: null,
        status: 'none',
        trialRemaining: 0,
        hasUsedTrial: false
      };
    }

    const trial = this.getTrialStatus(license.email);
    
    return {
      isPro: trial.isPro,
      planType: license.planType,
      expiresAt: license.expiresAt,
      subscriptionId: license.subscriptionId,
      status: trial.status,
      trialRemaining: trial.trialRemaining,
      hasUsedTrial: license.planType === 'trial' || trial.trialRemaining <= 0
    };
  }

  async getSubscriptionStatus(email) {
    const license = await this.getLicenseByEmail(email);
    return this.getStatus(license);
  }

  // ============ CRUD ============

  async getLicenseByEmail(email) {
    try {
      const row = this.db.prepare('SELECT * FROM licenses WHERE email = ? COLLATE NOCASE').get(email);
      return row ? this.rowToLicense(row) : null;
    } catch (e) {
      console.error('[getLicenseByEmail] Error:', e);
      return null;
    }
  }

  async getLicenseByMachineId(machineId) {
    try {
      const row = this.db.prepare('SELECT * FROM licenses WHERE machineId = ?').get(machineId);
      return row ? this.rowToLicense(row) : null;
    } catch (e) {
      console.error('[getLicenseByMachineId] Error:', e);
      return null;
    }
  }

  async getLicenseBySubscriptionId(subscriptionId) {
    try {
      const row = this.db.prepare('SELECT * FROM licenses WHERE subscriptionId = ?').get(subscriptionId);
      return row ? this.rowToLicense(row) : null;
    } catch (e) {
      console.error('[getLicenseBySubscriptionId] Error:', e);
      return null;
    }
  }

  async saveLicense(data) {
    try {
      const licenseKey = data.code || data.licenseKey || `KEY-${Date.now().toString(36)}`;
      const result = this.db.prepare(`
        INSERT INTO licenses (email, machineId, licenseKey, activationCode, status, planType, 
          subscriptionId, paddleCustomerId, paddleTransactionId, expiresAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        data.email, data.machineId || '', licenseKey, data.activationCode || null,
        data.status || 'active', data.type || data.planType || 'subscription',
        data.subscriptionId || null, data.paddleCustomerId || null,
        data.paddleTransactionId || null, data.expireDate || data.expiresAt || null
      );
      return this.db.prepare('SELECT * FROM licenses WHERE id = ?').get(result.lastInsertRowid);
    } catch (e) {
      console.error('[saveLicense] Error:', e);
      return null;
    }
  }

  async updateLicense(id, updates) {
    try {
      const fields = [];
      const values = [];
      const allowed = ['licenseKey', 'email', 'machineId', 'status', 'planType', 
        'subscriptionId', 'paddleCustomerId', 'paddleTransactionId', 'expiresAt', 
        'cancelledAt', 'trialRemaining', 'trialEnd'];
      
      for (const field of allowed) {
        if (updates[field] !== undefined) {
          fields.push(`${field} = ?`);
          values.push(updates[field]);
        }
      }
      
      if (fields.length === 0) return null;
      
      fields.push('updatedAt = datetime("now")');
      values.push(id);
      
      this.db.prepare(`UPDATE licenses SET ${fields.join(', ')} WHERE id = ?`).run(...values);
      return this.db.prepare('SELECT * FROM licenses WHERE id = ?').get(id);
    } catch (e) {
      console.error('[updateLicense] Error:', e);
      return null;
    }
  }

  resetTrial(email) {
    try {
      const license = this.db.prepare('SELECT * FROM licenses WHERE email = ? COLLATE NOCASE').get(email);
      if (!license) {
        return { success: false, error: 'License not found' };
      }
      
      const trialEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      
      this.db.prepare(`
        UPDATE licenses 
        SET status = 'trial', planType = 'trial', trialRemaining = 3, trialEnd = ?, updatedAt = datetime("now")
        WHERE id = ?
      `).run(trialEnd, license.id);
      
      const updated = this.db.prepare('SELECT * FROM licenses WHERE id = ?').get(license.id);
      console.log(`[resetTrial] Trial reset for ${email.substring(0, 3)}***`);
      return { success: true, license: this.rowToLicense(updated) };
    } catch (e) {
      console.error('[resetTrial] Error:', e);
      return { success: false, error: e.message };
    }
  }

  rowToLicense(row) {
    return {
      id: row.id,
      email: row.email,
      machineId: row.machineId,
      activationCode: row.activationCode,
      licenseKey: row.licenseKey,
      code: row.licenseKey,
      status: row.status,
      planType: row.planType,
      trialRemaining: row.trialRemaining,
      trialEnd: row.trialEnd,
      subscriptionId: row.subscriptionId,
      paddleCustomerId: row.paddleCustomerId,
      paddleTransactionId: row.paddleTransactionId,
      expiresAt: row.expiresAt,
      cancelledAt: row.cancelledAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  close() {
    if (db) {
      db.close();
      db = null;
      this.db = null;
    }
  }
}
