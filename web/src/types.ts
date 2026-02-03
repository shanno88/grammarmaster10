
export interface AnalysisPart {
  text: string;
  role: string;
  color: string;
  detail: string;
}

export interface AnalysisResult {
  translation: string;
  analysis: AnalysisPart[];
}

export interface CorrectionResult {
  original: string;
  corrected: string;
  reason: string;
  type: 'success' | 'grammar' | 'error';
}

export interface ExampleSentence {
  id: number;
  category: string;
  text: string;
  translation?: string;
  analysis?: AnalysisPart[];
}

export type TabType = 'analyze' | 'correct' | 'gaokao';

export interface LicenseStatus {
  status: 'active_pro' | 'active_trial' | 'expired_trial' | 'daily_limit_reached' | 'checking' | 'expired_pro';
  label: string;
  hoursLeft?: number;
  dailyLeft?: number;
  type?: 'subscription' | 'lifetime';
  expireDate?: string;
}

export interface AIConfig {
  engine: string;
  model: string;
}
