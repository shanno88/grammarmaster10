import React, { useState, useEffect } from 'react';
import { Crown, Check, ChevronLeft, Loader2, Shield } from 'lucide-react';
import { PaddleService, Prices } from '../services/paddleService';
import { translations, languageNames, detectLanguage, setLanguage, Language } from '../locales/billing';

interface BillingPageProps {
  onBack: () => void;
  userEmail: string;
}

const BillingPage: React.FC<BillingPageProps> = ({ onBack, userEmail }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState(userEmail || '');
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(detectLanguage());
  }, []);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    setLoading(true);
    const result = await PaddleService.getPrices();
    if (result.success && result.prices) {
      setPrices(result.prices);
    }
    setLoading(false);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setLanguage(newLang);
  };

  const t = translations[lang];

  const handleUpgrade = async () => {
    setError(null);

    if (!email) {
      setError(t.errorEmailRequired);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t.errorEmailInvalid);
      return;
    }

    setProcessing(true);

    try {
      const result = await PaddleService.openCheckout({
        planType: billingCycle,
        email
      });

      if (!result.success) {
        setError(result.error || t.errorCheckout);
      }
    } catch (e: any) {
      setError(e.message || t.errorCheckout);
    } finally {
      setProcessing(false);
    }
  };

  const currentPrice = billingCycle === 'monthly' ? prices?.monthly : prices?.yearly;
  const displayPrice = currentPrice?.amount || (billingCycle === 'monthly' ? 9.9 : 99);

  const languages: Language[] = ['en', 'zh-CN', 'zh-TW'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex justify-center items-start pt-6 pb-10 px-4">
      <div className="w-full max-w-md">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">{t.back}</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
          <div className="absolute top-3 right-4 z-10 flex items-center gap-1 text-xs">
            {languages.map((l, i) => (
              <React.Fragment key={l}>
                {i > 0 && <span className="text-slate-300 mx-1">|</span>}
                <button
                  onClick={() => handleLanguageChange(l)}
                  className={`transition-colors ${lang === l ? 'font-bold text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {languageNames[l]}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
              <Crown size={28} className="text-amber-300" />
            </div>
            <h1 className="text-2xl font-black mb-2">{t.title}</h1>
            <p className="text-white/80 text-sm">{t.subtitle}</p>
          </div>

          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-indigo-500" />
              </div>
            ) : (
              <>
                <div className="flex bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t.monthly}
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all relative ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t.yearly}
                    {billingCycle === 'yearly' && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                        {t.save}
                      </span>
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <div className={`relative p-5 rounded-2xl border-2 transition-all ${
                    billingCycle === 'yearly' 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-slate-200 bg-slate-50'
                  }`}>
                    {billingCycle === 'yearly' && (
                      <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        {t.bestValue}
                      </div>
                    )}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">
                          {billingCycle === 'monthly' ? t.planNameMonthly : t.planNameYearly}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {billingCycle === 'monthly' ? t.billedMonthly : t.billedYearly}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-slate-800">${displayPrice}</span>
                        <span className="text-slate-500 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-600">{t.included}</p>
                  <ul className="space-y-2.5">
                    {t.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-green-600" />
                        </div>
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-600">{t.emailLabel}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-indigo-400 focus:outline-none transition-colors"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleUpgrade}
                  disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t.processing}
                    </>
                  ) : (
                    <>
                      <Crown size={18} />
                      {t.cta}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Shield size={14} />
                  <span>{t.secure}</span>
                </div>

                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  {t.cancel}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
