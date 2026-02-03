
import { LICENSE_SECRET, TRIAL_HOURS, DAILY_LIMIT } from '../constants';
import { LicenseStatus } from '../types';

export const LicenseService = {
  getMachineId: (): string => {
    let mid = localStorage.getItem('grammar_machine_id');
    if (!mid) {
      mid = 'USR-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString(36).substring(4).toUpperCase();
      localStorage.setItem('grammar_machine_id', mid);
    }
    return mid;
  },

  initTrial: () => {
    const trialStart = localStorage.getItem('grammar_trial_start');
    if (!trialStart) {
      localStorage.setItem('grammar_trial_start', Date.now().toString());
    }
  },

  getDailyRemaining: (): number => {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('grammar_last_usage_date');
    let count = parseInt(localStorage.getItem('grammar_daily_count') || '0', 10);

    if (lastDate !== today) {
      count = 0;
      localStorage.setItem('grammar_last_usage_date', today);
      localStorage.setItem('grammar_daily_count', '0');
    }
    return Math.max(0, DAILY_LIMIT - count);
  },

  consumeCredit: () => {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('grammar_last_usage_date');
    let count = parseInt(localStorage.getItem('grammar_daily_count') || '0', 10);

    if (lastDate !== today) {
      count = 0;
      localStorage.setItem('grammar_last_usage_date', today);
    }
    localStorage.setItem('grammar_daily_count', (count + 1).toString());
  },

  getLicenseStatus: (): LicenseStatus => {
    const activated = localStorage.getItem('grammar_is_activated') === 'true';
    const type = localStorage.getItem('grammar_license_type') as 'subscription' | 'lifetime';
    const expireDate = localStorage.getItem('grammar_expire_date');

    if (activated) {
      if (expireDate) {
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        if (todayStr > expireDate) return { status: 'expired_pro', label: '会员已过期' };
      }
      return { status: 'active_pro', label: type === 'lifetime' ? '永久会员' : 'Pro 会员', type, expireDate };
    }

    const trialStartStr = localStorage.getItem('grammar_trial_start');
    if (trialStartStr) {
      const start = parseInt(trialStartStr, 10);
      const now = Date.now();
      const hoursPassed = (now - start) / (1000 * 60 * 60);

      if (hoursPassed < TRIAL_HOURS) {
        const hoursLeft = Math.ceil(TRIAL_HOURS - hoursPassed);
        const dailyLeft = LicenseService.getDailyRemaining();
        if (dailyLeft <= 0) return { status: 'daily_limit_reached', label: '今日次数耗尽', hoursLeft, dailyLeft };
        return { status: 'active_trial', label: `试用中`, hoursLeft, dailyLeft };
      } else {
        return { status: 'expired_trial', label: '试用结束' };
      }
    }
    return { status: 'expired_trial', label: '试用结束' };
  },

  sha256: async (message: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  },

  verifyLicense: async (inputCode: string) => {
    const code = inputCode.trim().toUpperCase();
    const machineId = LicenseService.getMachineId();
    const secret = LICENSE_SECRET;

    // Subscription pattern: EXPIRE_DATE-HASH
    if (code.includes('-') && code.length > 10) {
      const [expireDate, signature] = code.split('-');
      const payload = machineId + expireDate + secret;
      const fullHash = await LicenseService.sha256(payload);
      if (signature === fullHash.substring(0, 8)) {
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        if (today > expireDate) throw new Error("此激活码已过期。");
        localStorage.setItem('grammar_is_activated', 'true');
        localStorage.setItem('grammar_license_type', 'subscription');
        localStorage.setItem('grammar_expire_date', expireDate);
        return { success: true, expireDate };
      }
    }

    // Lifetime pattern: HASH (12 chars)
    const payload = machineId + secret;
    const fullHash = await LicenseService.sha256(payload);
    if (code === fullHash.substring(0, 12)) {
      localStorage.setItem('grammar_is_activated', 'true');
      localStorage.setItem('grammar_license_type', 'lifetime');
      return { success: true };
    }
    return { success: false };
  }
};
