
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, AlertCircle, CheckCircle, GraduationCap, ArrowRight, Info, RefreshCw, Tag, 
  Wand2, Sparkles, Zap, Star, Rocket, Copy, Clock, Cpu, 
  Languages, Settings, ShoppingCart, ChevronLeft, Crown, 
  XCircle
} from 'lucide-react';
import { AIService } from './services/aiService';
import { LicenseService } from './services/licenseService';
import { PaddleService } from './services/paddleService';
import { LicenseApiService } from './services/licenseApiService';
import { 
  AnalysisResult, CorrectionResult, TabType, LicenseStatus, 
  ExampleSentence
} from './types';
import { 
  GAOKAO_EXAMPLES
} from './constants';

// --- Utility Components ---
const CuteButton = ({ 
  onClick, children, className = "", disabled = false, variant = "primary" 
}: { 
  onClick?: (e?: any) => void | Promise<void>; 
  children?: React.ReactNode; 
  className?: string; 
  disabled?: boolean; 
  variant?: string 
}) => {
  const base = "transform transition-all duration-200 active:scale-95 focus:outline-none rounded-2xl font-bold shadow-sm hover:shadow-md flex items-center justify-center";
  const variants: Record<string, string> = {
    primary: "bg-indigo-500 text-white hover:bg-indigo-600 border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1",
    secondary: "bg-amber-400 text-white hover:bg-amber-500 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1",
    lock: "bg-slate-400 text-white hover:bg-slate-500 border-b-4 border-slate-600",
    trial: "bg-emerald-400 text-white hover:bg-emerald-500 border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1",
    ghost: "text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl",
  };
  return (
    <button 
      onClick={(e) => !disabled && onClick?.(e)} 
      disabled={disabled} 
      className={`${base} ${variants[variant] || variants.primary} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

// --- Settings Modal Component ---
const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const handleReset = () => {
    if (confirm("确定要清除所有本地数据（包括激活状态）吗？")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[150] bg-indigo-950/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden border-4 border-white flex flex-col animate-in zoom-in-95 duration-200 my-auto">
        <div className="p-6 bg-gradient-to-br from-slate-700 to-slate-900 text-white flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-black flex items-center gap-2"><Settings size={20} /> 专家模式中心</h3>
            <button onClick={onClose} className="opacity-50 hover:opacity-100 text-2xl leading-none">×</button>
          </div>
          <p className="text-[10px] text-slate-300">DeepSeek V3 官方驱动核心</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">AI 引擎状态</label>
            <div className="p-4 rounded-2xl border-2 border-indigo-500 bg-indigo-50 flex items-center gap-4">
              <div className="p-2 bg-indigo-500 text-white rounded-xl"><Cpu size={20} /></div>
              <div>
                <p className="text-sm font-black text-slate-700">DeepSeek V3</p>
                <p className="text-[10px] text-indigo-500 font-bold">已连接至专用 API 节点</p>
              </div>
              <CheckCircle size={18} className="ml-auto text-indigo-500" />
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
              <span className="text-amber-900 block mb-1">🔑 验证说明：</span>
              应用已自动适配您提供的 DeepSeek 专有激活密钥。系统将优先通过官方链路进行语法解析。
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <CuteButton onClick={onClose} className="w-full py-4">返回应用</CuteButton>
            <button onClick={handleReset} className="w-full py-2 text-[10px] text-red-400 font-bold hover:text-red-600 transition-colors uppercase tracking-widest">
              重置应用数据
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('analyze');
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [correctionResult, setCorrectionResult] = useState<CorrectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showActivation, setShowActivation] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>({ status: 'checking', label: '...' });
  const [copied, setCopied] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [payStep, setPayStep] = useState<'select' | 'pay'>('select');
  const [paddleLoading, setPaddleLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const [secretClickCount, setSecretClickCount] = useState(0);
  const lastClickTimeRef = useRef(0);

  const checkStatus = useCallback(() => {
    LicenseService.initTrial();
    setLicenseStatus(LicenseService.getLicenseStatus());
  }, []);

  useEffect(() => {
    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    PaddleService.initializePaddle();
    return () => clearInterval(timer);
  }, [checkStatus]);

  const handleSecretEntry = () => {
    const now = Date.now();
    const isTimeout = now - lastClickTimeRef.current > 2000;
    lastClickTimeRef.current = now;

    setSecretClickCount(prev => {
      const next = isTimeout ? 1 : prev + 1;
      if (next >= 8) {
        setShowSettings(true);
        return 0;
      }
      return next;
    });
  };

  const checkPermission = () => {
    const status = LicenseService.getLicenseStatus();
    if (status.status === 'active_pro') return true;
    if (status.status === 'active_trial' && (status.dailyLeft || 0) > 0) return true;
    setShowActivation(true);
    return false;
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() || isLoading) return;
    if (!checkPermission()) return;

    setIsLoading(true);
    setErrorMsg("");
    setAnalysisResult(null);

    try {
      const result = await AIService.analyze(inputText);
      setAnalysisResult(result);
      if (licenseStatus.status === 'active_trial') {
        LicenseService.consumeCredit();
        checkStatus();
      }
    } catch (error: any) {
      setErrorMsg(error.message || "分析请求未能完成，请检查配置。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorrect = async () => {
    if (!inputText.trim() || isLoading) return;
    if (!checkPermission()) return;

    setIsLoading(true);
    setErrorMsg("");
    setCorrectionResult(null);

    try {
      const result = await AIService.correct(inputText);
      setCorrectionResult(result);
      if (licenseStatus.status === 'active_trial') {
        LicenseService.consumeCredit();
        checkStatus();
      }
    } catch (error: any) {
      setErrorMsg(error.message || "智能纠错暂时不可用。");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = (ex: ExampleSentence) => {
    setInputText(ex.text);
    setActiveTab('analyze');
    if (ex.analysis) {
      setAnalysisResult({ translation: ex.translation || "", analysis: ex.analysis });
    } else {
      setAnalysisResult(null);
    }
    setCorrectionResult(null);
  };

  const handleCopyMachineId = () => {
    navigator.clipboard.writeText(LicenseService.getMachineId());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActivate = async () => {
    try {
      const machineId = LicenseService.getMachineId();
      
      const apiRes = await LicenseApiService.verifyLicense({
        machineId,
        code: activationCode
      });

      if (apiRes.success && apiRes.valid) {
        const { type, expireDate } = apiRes;
        
        localStorage.setItem('grammar_is_activated', 'true');
        localStorage.setItem('grammar_license_type', type || 'lifetime');
        if (expireDate) {
          localStorage.setItem('grammar_expire_date', expireDate);
        }
        
        checkStatus();
        setShowActivation(false);
        setActivationCode("");
        setErrorMsg("");
      } else {
        const reason = apiRes.reason === 'expired' ? '此激活码已过期' : '激活码验证未通过';
        setErrorMsg(reason);
      }
    } catch (e: any) {
      const localRes = await LicenseService.verifyLicense(activationCode);
      if (localRes.success) {
        checkStatus();
        setShowActivation(false);
        setActivationCode("");
        setErrorMsg("");
      } else {
        setErrorMsg(e.message || "激活码验证未通过");
      }
    }
  };

  const handlePaddlePay = async (type: 'monthly' | 'yearly') => {
    if (!userEmail) {
      setErrorMsg("请输入邮箱地址");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setErrorMsg("请输入有效的邮箱地址");
      return;
    }

    setPaddleLoading(true);
    setErrorMsg("");

    try {
      const pricesRes = await PaddleService.getPrices();
      if (!pricesRes.success || !pricesRes.prices) {
        setErrorMsg("无法获取价格信息");
        setPaddleLoading(false);
        return;
      }

      const priceId = type === 'monthly' 
        ? pricesRes.prices.monthly.priceId 
        : pricesRes.prices.yearly.priceId;

      const checkoutRes = await PaddleService.createCheckout({
        priceId,
        email: userEmail,
        name: userName,
        machineId: LicenseService.getMachineId()
      });

      if (checkoutRes.success && checkoutRes.checkoutUrl) {
        PaddleService.openCheckout(checkoutRes.checkoutUrl);
        setShowActivation(false);
      } else {
        setErrorMsg(checkoutRes.error || "创建支付失败");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "支付过程中出现错误");
    } finally {
      setPaddleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans text-slate-700 flex justify-center items-start pt-6 pb-10 px-4">
      <div className="w-full max-w-[520px] bg-white shadow-2xl rounded-[32px] overflow-hidden border-4 border-white ring-4 ring-indigo-100 flex flex-col h-[780px] relative transition-all duration-300">
        
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />

        {/* Header */}
        <div className="bg-gradient-to-r from-sky-400 to-indigo-500 p-5 text-white shadow-lg rounded-b-[40px] relative z-20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                onClick={handleSecretEntry}
                className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm cursor-pointer active:scale-95 hover:bg-white/30 transition-all group"
              >
                <Rocket size={24} className={`text-white fill-current transition-transform ${secretClickCount > 0 ? 'scale-110' : ''}`} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wide">Grammar Master</h1>
                <p className="text-[10px] text-sky-100 font-medium opacity-90">🚀 专家模式：DeepSeek V3 官方驱动 🚀</p>
              </div>
            </div>
            {licenseStatus.status !== 'active_pro' && (
              <button 
                onClick={() => setShowActivation(true)}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-white rounded-xl shadow-sm text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 border-b-2 border-amber-600 active:border-b-0"
              >
                <Crown size={12} fill="currentColor" /> 升级会员
              </button>
            )}
          </div>

          <div className="flex gap-2 text-[10px] font-bold">
            {licenseStatus.status === 'active_pro' ? (
              <div className="flex-1 bg-amber-400/20 backdrop-blur-md border border-amber-300/30 rounded-xl p-2 flex items-center justify-center gap-2 text-amber-50">
                <Star size={12} className="fill-current" /> 会员有效期: {licenseStatus.type === 'lifetime' ? '永久' : licenseStatus.expireDate}
              </div>
            ) : (
              <>
                <div className={`flex-1 rounded-xl p-2 flex items-center justify-center gap-2 border backdrop-blur-md ${licenseStatus.status === 'expired_trial' ? 'bg-red-500/30 border-red-400/50' : 'bg-emerald-500/20 border-emerald-400/30'}`}>
                  <Clock size={12} /> {licenseStatus.status === 'expired_trial' ? '试用已过期' : `试用剩 ${licenseStatus.hoursLeft}h`}
                </div>
                <div className={`flex-1 rounded-xl p-2 flex items-center justify-center gap-2 border backdrop-blur-md ${licenseStatus.dailyLeft === 0 ? 'bg-red-500/30 border-red-400/50' : 'bg-blue-500/20 border-blue-400/30'}`}>
                  <Zap size={12} /> {licenseStatus.dailyLeft === 0 ? '今日次数耗尽' : `今日剩 ${licenseStatus.dailyLeft}次`}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-2 bg-white mx-4 mt-4 rounded-2xl border border-gray-100 shadow-sm">
          {(['analyze', 'correct', 'gaokao'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`flex-1 py-3 text-sm font-bold flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === tab ? 'text-indigo-600 bg-indigo-50 shadow-inner' : 'text-gray-400'}`}
            >
              {tab === 'analyze' && <Search size={20} />}
              {tab === 'correct' && <CheckCircle size={20} />}
              {tab === 'gaokao' && <GraduationCap size={20} />}
              <span className="text-[10px] mt-1">{tab === 'analyze' ? '成分分析' : tab === 'correct' ? '智能纠错' : '高考句典'}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
          {errorMsg && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 text-xs rounded-2xl border border-red-200 flex items-start gap-3 animate-in slide-in-from-top-2 relative">
              <XCircle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1 overflow-hidden">
                <p className="font-black mb-1 text-red-700">系统提示</p>
                <p className="opacity-90 leading-relaxed break-words">{errorMsg}</p>
                <div className="mt-2 text-[10px] bg-red-100/50 p-2 rounded-lg italic">
                  诊断：检测到 API 身份验证异常。系统已切换至备用激活链路。
                </div>
              </div>
              <button onClick={() => setErrorMsg("")} className="shrink-0 p-1 hover:bg-red-100 rounded-full">
                <ChevronLeft size={16} className="rotate-90" />
              </button>
            </div>
          )}

          {activeTab === 'analyze' && (
            <div className="space-y-6">
              <div className="relative">
                <textarea 
                  className="w-full p-5 border-2 border-indigo-50 rounded-3xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 focus:outline-none resize-none text-base bg-white shadow-sm text-slate-600 min-h-[120px]"
                  placeholder="请输入需要分析的英语句子..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div className="absolute bottom-4 right-4">
                  <CuteButton 
                    onClick={handleAnalyze} 
                    disabled={isLoading} 
                    variant={licenseStatus.status === 'active_pro' ? 'secondary' : 'primary'}
                    className="px-5 py-2 text-xs"
                  >
                    {isLoading ? <RefreshCw className="animate-spin h-3 w-3 mr-2" /> : <Wand2 size={14} className="mr-2" />}
                    {licenseStatus.status === 'active_pro' ? '专家级分析' : `开始分析 (${licenseStatus.dailyLeft || 0})`}
                  </CuteButton>
                </div>
              </div>

              {analysisResult && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={14} /> 结构拆解
                    </h3>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold flex items-center gap-1">
                      <Sparkles size={10} /> DeepSeek V3 驱动
                    </span>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-white rounded-3xl border border-indigo-100 shadow-sm space-y-3">
                    <div className="flex flex-row items-start gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Languages size={18} /></div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-tight">中文翻译</p>
                        <p className="text-sm font-semibold text-slate-700 leading-relaxed">{analysisResult.translation}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-medium px-2 flex items-center gap-1"><Info size={12} /> 💡 悬停色块查看详细语法解释</p>

                  <div className="flex flex-wrap gap-3 justify-start">
                    {analysisResult.analysis.map((part, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === analysisResult.analysis.length - 1;
                      
                      return (
                        <div key={idx} className={`px-4 py-3 rounded-2xl border-2 ${part.color || 'bg-slate-50 border-slate-200'} relative group cursor-help transition-all hover:-translate-y-1 shadow-sm`}>
                          <div className="text-[9px] font-black uppercase opacity-60 mb-1 text-center">{part.role}</div>
                          <div className="text-sm font-bold text-center">{part.text}</div>
                          
                          <div className={`hidden group-hover:block absolute bottom-full mb-3 w-52 bg-white p-4 rounded-2xl shadow-2xl border-2 border-indigo-50 z-50 text-xs text-slate-700 pointer-events-none animate-in fade-in zoom-in-95 leading-relaxed ${
                            isFirst ? 'left-0' : 
                            isLast ? 'right-0' : 
                            'left-1/2 -translate-x-1/2'
                          }`}>
                            <div className="font-black text-indigo-500 mb-2 flex items-center gap-1 border-b border-indigo-50 pb-1">
                              <Star size={10} fill="currentColor" /> {part.role}
                            </div>
                            <p>{part.detail}</p>
                            <div className={`absolute -bottom-2 w-4 h-4 bg-white border-b-2 border-r-2 border-indigo-50 transform rotate-45 ${
                              isFirst ? 'left-6' : 
                              isLast ? 'right-6' : 
                              'left-1/2 -translate-x-1/2'
                            }`}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'correct' && (
            <div className="space-y-6">
              <div className="relative">
                <textarea 
                  className="w-full p-5 border-2 border-amber-50 rounded-3xl focus:ring-4 focus:ring-amber-50 focus:border-amber-300 focus:outline-none resize-none bg-white shadow-sm text-slate-600 min-h-[140px]"
                  placeholder="输入一段话，让 AI 检查语法错误..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div className="absolute bottom-4 right-4">
                  <CuteButton onClick={handleCorrect} disabled={isLoading} variant="secondary" className="px-6 py-2.5">
                    {isLoading ? <RefreshCw className="animate-spin h-3 w-3 mr-2" /> : <CheckCircle size={16} className="mr-2" />}
                    智能纠错
                  </CuteButton>
                </div>
              </div>

              {correctionResult && (
                <div className={`p-6 rounded-[32px] border-2 shadow-sm animate-in zoom-in-95 duration-300 ${correctionResult.type === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  {correctionResult.type === 'success' ? (
                    <div className="flex items-center gap-3 text-emerald-700 font-black">
                      <div className="p-2 bg-emerald-200 rounded-full"><CheckCircle size={24} /></div>
                      <div>
                        <p className="text-sm">完美！没有发现明显的语法错误。</p>
                        <p className="text-[10px] opacity-70 mt-0.5">继续保持这种高水平的写作。</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black bg-red-200 text-red-800 px-3 py-1 rounded-full w-fit">原文错误</span>
                        <p className="text-red-400 line-through text-sm italic">{correctionResult.original}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full w-fit">修正建议</span>
                        <p className="text-emerald-700 font-bold text-lg">{correctionResult.corrected}</p>
                      </div>
                      <div className="p-4 bg-white/60 rounded-2xl border border-red-100/50 text-xs leading-relaxed">
                        <span className="font-black text-red-500 mr-1">解析：</span>
                        {correctionResult.reason}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gaokao' && (
            <div className="grid gap-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3 mb-2">
                <Info size={16} className="text-indigo-400" />
                <p className="text-[10px] text-indigo-500 font-bold">点击以下核心例句，学习高考必备语法结构。</p>
              </div>
              {GAOKAO_EXAMPLES.map(ex => (
                <button 
                  key={ex.id} 
                  onClick={() => loadExample(ex as ExampleSentence)}
                  className="text-left p-5 rounded-3xl border-2 border-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30 bg-white transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={24} className="text-indigo-500" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-100 px-3 py-1 rounded-full">{ex.category}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed pr-8">
                    <span className="text-indigo-300 mr-2">{ex.id.toString().padStart(2, '0')}</span>
                    {ex.text}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Activation Modal Overlay */}
        {showActivation && (
          <div className="absolute inset-0 z-[100] bg-indigo-950/70 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md max-h-[650px] overflow-hidden border-4 border-white flex flex-col relative">
              <button onClick={() => setShowActivation(false)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500">
                <XCircle size={24} />
              </button>
              
              <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center">
                <ShoppingCart className="mx-auto mb-4 text-indigo-200" size={40} />
                <h2 className="text-2xl font-black mb-2">解锁 Pro 无限功能</h2>
                <p className="text-xs text-indigo-100 opacity-80">体验 DeepSeek V3 带来的顶级语法分析</p>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {payStep === 'select' ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div onClick={() => { setPayStep('pay'); }} className="border-2 border-indigo-100 bg-indigo-50 rounded-[24px] p-6 text-center cursor-pointer hover:border-indigo-400 transition-all">
                        <p className="text-xs font-bold text-indigo-400 mb-2">月度 Pro</p>
                        <p className="text-3xl font-black text-indigo-700">¥29</p>
                      </div>
                      <div onClick={() => { setPayStep('pay'); }} className="border-2 border-amber-200 bg-amber-50 rounded-[24px] p-6 text-center cursor-pointer hover:border-amber-400 transition-all relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-3 py-0.5 rounded-full font-bold shadow-sm">最值</div>
                        <p className="text-xs font-bold text-amber-600 mb-2">年度 Pro</p>
                        <p className="text-3xl font-black text-amber-700">¥199</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">或输入激活码</p>
                      <input 
                        type="text" 
                        placeholder="在此输入激活码"
                        className="w-full p-5 border-2 border-slate-100 rounded-[20px] text-center font-mono uppercase tracking-widest focus:border-indigo-400 focus:outline-none text-sm"
                        value={activationCode}
                        onChange={(e) => setActivationCode(e.target.value)}
                      />
                      <CuteButton onClick={handleActivate} className="w-full py-5 text-base">验证并激活</CuteButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-right-8">
                    <div className="space-y-6">
                      <div className="bg-indigo-50 p-4 rounded-[20px] border border-indigo-100">
                        <p className="text-xs font-black text-indigo-600 mb-3">请填写邮箱（购买后激活码将发送至此邮箱）</p>
                        <input 
                          type="email" 
                          placeholder="您的邮箱地址"
                          className="w-full p-3 border-2 border-indigo-100 rounded-xl text-sm focus:border-indigo-400 focus:outline-none"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <input 
                          type="text" 
                          placeholder="您的姓名（可选）"
                          className="w-full p-3 border-2 border-indigo-100 rounded-xl text-sm mt-3 focus:border-indigo-400 focus:outline-none"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => !paddleLoading && handlePaddlePay('monthly')}
                          disabled={paddleLoading}
                          className="border-2 border-indigo-100 bg-indigo-50 rounded-[20px] p-5 text-center cursor-pointer hover:border-indigo-400 transition-all disabled:opacity-50"
                        >
                          <p className="text-xs font-bold text-indigo-400 mb-1">月度 Pro</p>
                          <p className="text-2xl font-black text-indigo-700">¥29</p>
                          <p className="text-[10px] text-slate-400 mt-1">自动续费</p>
                        </button>
                        <button 
                          onClick={() => !paddleLoading && handlePaddlePay('yearly')}
                          disabled={paddleLoading}
                          className="border-2 border-amber-200 bg-amber-50 rounded-[20px] p-5 text-center cursor-pointer hover:border-amber-400 transition-all relative disabled:opacity-50"
                        >
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">最值</div>
                          <p className="text-xs font-bold text-amber-600 mb-1">年度 Pro</p>
                          <p className="text-2xl font-black text-amber-700">¥199</p>
                          <p className="text-[10px] text-slate-400 mt-1">自动续费</p>
                        </button>
                      </div>

                      {paddleLoading && (
                        <div className="text-center text-sm font-bold text-indigo-600">
                          正在创建支付...
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => setPayStep('select')} 
                      className="w-full py-4 mt-2 text-slate-500 font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-50 rounded-[20px] border-2 border-slate-100 transition-all active:scale-95"
                    >
                      <ChevronLeft size={22} /> 返回选择
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 right-8 text-indigo-200 text-[12px] font-black rotate-[-5deg] pointer-events-none opacity-50">
          来碗AI 🚀
        </div>
      </div>
    </div>
  );
};

export default App;
