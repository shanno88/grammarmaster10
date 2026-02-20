export type Language = 'en' | 'zh-CN' | 'zh-TW';

export const translations = {
  en: {
    title: "Upgrade to Pro",
    subtitle: "Unlock unlimited grammar analysis & advanced features",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "SAVE 16%",
    planNameYearly: "Yearly Plan",
    planNameMonthly: "Monthly Plan",
    billedYearly: "Billed annually",
    billedMonthly: "Billed monthly",
    bestValue: "BEST VALUE",
    included: "What's included:",
    features: [
      "Unlimited grammar analysis",
      "Advanced AI-powered corrections",
      "Full access to example library",
      "Priority support",
      "No daily usage limits"
    ],
    emailPlaceholder: "you@example.com",
    emailLabel: "Your email",
    cta: "Upgrade to Pro",
    processing: "Processing...",
    secure: "Secure checkout powered by Paddle",
    cancel: "Cancel anytime. Your subscription will auto-renew unless cancelled before the next billing period.",
    back: "Back",
    errorEmailRequired: "Please enter your email address",
    errorEmailInvalid: "Please enter a valid email address",
    errorCheckout: "Failed to open checkout"
  },
  "zh-CN": {
    title: "升级至专业版",
    subtitle: "解锁无限语法分析与高级功能",
    monthly: "月付",
    yearly: "年付",
    save: "省 16%",
    planNameYearly: "年度套餐",
    planNameMonthly: "月度套餐",
    billedYearly: "按年计费",
    billedMonthly: "按月计费",
    bestValue: "最超值",
    included: "包含内容：",
    features: [
      "无限次语法分析",
      "AI 高级纠错功能",
      "完整例句库访问权限",
      "优先客户支持",
      "无每日使用限制"
    ],
    emailPlaceholder: "your@email.com",
    emailLabel: "您的邮箱",
    cta: "立即升级专业版",
    processing: "处理中...",
    secure: "安全结账，由 Paddle 提供支持",
    cancel: "随时可取消。除非在下一计费周期前取消，否则订阅将自动续费。",
    back: "返回",
    errorEmailRequired: "请输入邮箱地址",
    errorEmailInvalid: "请输入有效的邮箱地址",
    errorCheckout: "无法打开支付窗口"
  },
  "zh-TW": {
    title: "升級至專業版",
    subtitle: "解鎖無限語法分析與進階功能",
    monthly: "月付",
    yearly: "年付",
    save: "省 16%",
    planNameYearly: "年度方案",
    planNameMonthly: "月度方案",
    billedYearly: "按年計費",
    billedMonthly: "按月計費",
    bestValue: "最超值",
    included: "包含內容：",
    features: [
      "無限次語法分析",
      "AI 進階糾錯功能",
      "完整例句庫存取權限",
      "優先客戶支援",
      "無每日使用限制"
    ],
    emailPlaceholder: "your@email.com",
    emailLabel: "您的電子郵件",
    cta: "立即升級專業版",
    processing: "處理中...",
    secure: "安全結帳，由 Paddle 提供支援",
    cancel: "隨時可取消。除非在下一計費週期前取消，否則訂閱將自動續費。",
    back: "返回",
    errorEmailRequired: "請輸入電子郵件地址",
    errorEmailInvalid: "請輸入有效的電子郵件地址",
    errorCheckout: "無法開啟付款視窗"
  }
} as const;

export const LANG_KEY = 'grammarcoach_lang';

export const languageNames: Record<Language, string> = {
  'en': 'EN',
  'zh-CN': '简体',
  'zh-TW': '繁體'
};

export function detectLanguage(): Language {
  const stored = localStorage.getItem(LANG_KEY) as Language | null;
  if (stored && translations[stored]) {
    return stored;
  }
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang) {
    if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK') || browserLang.startsWith('zh-Hant')) {
      return 'zh-TW';
    }
    if (browserLang.startsWith('zh') || browserLang.startsWith('zh-CN') || browserLang.startsWith('zh-Hans')) {
      return 'zh-CN';
    }
  }
  
  return 'en';
}

export function setLanguage(lang: Language): void {
  localStorage.setItem(LANG_KEY, lang);
}
