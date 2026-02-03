import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, RefreshCw, AlertCircle, CheckCircle, ChevronLeft, X } from 'lucide-react';

const BillingPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [subscriptionData, setSubscriptionData] = useState({
    planName: '月度 Pro',
    price: '¥29 / 月',
    nextBillingDate: '2026-03-03',
    autoRenew: true,
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCancelAutoRenew = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptionData(prev => ({
        ...prev,
        autoRenew: false
      }));
      
      setMessage({ type: 'success', text: '已关闭自动续费' });
      setShowCancelConfirm(false);
    } catch (error) {
      setMessage({ type: 'error', text: '关闭自动续费失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans text-slate-700 flex justify-center items-start pt-6 pb-10 px-4">
      <div className="w-full max-w-[520px] bg-white shadow-2xl rounded-[32px] overflow-hidden border-4 border-white ring-4 ring-indigo-100 flex flex-col h-[780px] relative transition-all duration-300">
        <div className="bg-gradient-to-r from-sky-400 to-indigo-500 p-5 text-white shadow-lg rounded-b-[40px] relative z-20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={onBack}
                className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm cursor-pointer active:scale-95 hover:bg-white/30 transition-all"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <div>
                <h1 className="text-xl font-black tracking-wide">订阅与账单</h1>
                <p className="text-[10px] text-sky-100 font-medium opacity-90">管理您的订阅服务</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative space-y-6">
          {message && (
            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              {message.type === 'success' ? (
                <CheckCircle size={18} className="shrink-0 mt-0.5 text-emerald-500" />
              ) : (
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              )}
              <p className={`text-xs font-black ${message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>{message.text}</p>
              <button onClick={() => setMessage(null)} className="shrink-0 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-[24px] border-2 border-indigo-100 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-500 text-white rounded-xl">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">当前订阅</p>
                <p className="text-lg font-black text-indigo-700">{subscriptionData.planName}</p>
              </div>
              <div className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold">
                {subscriptionData.status === 'active' ? '生效中' : '已过期'}
              </div>
            </div>

            <div className="space-y-3 border-t border-indigo-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">订阅价格</span>
                <span className="text-base font-black text-slate-700">{subscriptionData.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <Calendar size={14} />
                  下次扣费日期
                </span>
                <span className="text-sm font-bold text-slate-700">{subscriptionData.nextBillingDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 flex items-center gap-2">
                  <RefreshCw size={14} />
                  自动续费
                </span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${subscriptionData.autoRenew ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {subscriptionData.autoRenew ? '已开启' : '已关闭'}
                </span>
              </div>
            </div>
          </div>

          {subscriptionData.autoRenew && (
            <div className="bg-white rounded-[24px] border-2 border-slate-100 p-6 space-y-4">
              <h3 className="text-sm font-black text-slate-700">自动续费管理</h3>
              
              {showCancelConfirm ? (
                <div className="bg-red-50 p-4 rounded-[20px] border border-red-100 space-y-4">
                  <div className="flex gap-3">
                    <AlertCircle size={20} className="shrink-0 text-red-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-xs font-black text-red-700">确认关闭自动续费？</p>
                      <p className="text-[10px] text-red-600 leading-relaxed">关闭自动续费后，本周期已支付费用不退，但到期后将不再自动扣费。</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelAutoRenew}
                      disabled={loading}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {loading ? '处理中...' : '确认关闭'}
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 py-3 bg-white text-slate-600 border-2 border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all active:scale-95 border-2 border-slate-200"
                >
                  关闭自动续费
                </button>
              )}
            </div>
          )}

          {!subscriptionData.autoRenew && (
            <div className="bg-amber-50 p-4 rounded-[20px] border border-amber-100">
              <div className="flex gap-3">
                <AlertCircle size={20} className="shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-amber-700 mb-1">自动续费已关闭</p>
                  <p className="text-[10px] text-amber-600 leading-relaxed">您的订阅将在 {subscriptionData.nextBillingDate} 到期。到期后将不再自动扣费，您可以随时重新订阅。</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded-[20px] border border-slate-100">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              如有任何问题，请联系客服。感谢您的使用！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
