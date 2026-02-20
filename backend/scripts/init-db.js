import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'data', 'licenses.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('Created data directory:', dbDir);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Backup and recreate table with full schema
db.exec(`
  DROP TABLE IF EXISTS licenses;
  
  CREATE TABLE licenses (
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
  );

  CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);
  CREATE INDEX IF NOT EXISTS idx_licenses_machineId ON licenses(machineId);
  CREATE INDEX IF NOT EXISTS idx_licenses_activationCode ON licenses(activationCode);
  CREATE INDEX IF NOT EXISTS idx_licenses_subscriptionId ON licenses(subscriptionId);
`);

// Create test user with 3-day trial
db.prepare(`
  INSERT OR REPLACE INTO licenses (email, status, planType, trialRemaining, trialEnd)
  VALUES (?, 'trial', 'trial', 3, datetime('now', '+3 days'))
`).run('test@example.com');

console.log('✅ Database initialized:', dbPath);
console.log('✅ Test user: test@example.com (3-day trial)');

// Show schema
const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='licenses'").get();
console.log('\nSchema:\n', schema.sql);

db.close();
