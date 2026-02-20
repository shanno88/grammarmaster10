
import { AnalysisResult, CorrectionResult } from "../types";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";
const DEFAULT_MODEL = "deepseek-chat";
// 用户提供的特定 DeepSeek Key
const DEEPSEEK_KEY = "sk-e34f6c0a1cd44da5b6dea886a79fdbfd";

const ANALYSIS_PROMPT_BASE = `分析英语句子并返回语法成分。
请严格返回以下格式的 JSON 字符串，不要包含 Markdown 标签或任何多余文字：
{
  "translation": "中文翻译",
  "analysis": [
    {
      "text": "单词或短语",
      "role": "成分名称",
      "color": "Tailwind颜色类字符串",
      "detail": "详细解释"
    }
  ]
}
颜色规范（必须同时包含 bg, text, border 三类）：
主语: "bg-red-50 text-red-600 border-red-200"
谓语: "bg-green-50 text-green-600 border-green-200"
宾语: "bg-blue-50 text-blue-600 border-blue-200"
状语: "bg-purple-50 text-purple-600 border-purple-200"
定语: "bg-amber-50 text-amber-600 border-amber-200"
补语: "bg-cyan-50 text-cyan-600 border-cyan-200"
介词短语/其他: "bg-slate-50 text-slate-600 border-slate-200"`;

const CORRECTION_PROMPT_BASE = `纠正以下句子的语法错误。
请严格返回 JSON：
{
  "original": "原始句子",
  "corrected": "修正后的句子",
  "reason": "中文解释",
  "type": "success 或 grammar"
}`;

async function callDeepseek(systemPrompt: string, userPrompt: string) {
  // 逻辑：如果环境变量中的 Key 看起来不像 DeepSeek Key（比如以 GEMIN 或 AIza 开头），则使用用户指定的固定 Key
  const envKey = process.env.API_KEY;
  const apiKey = (envKey && envKey.startsWith('sk-')) ? envKey : DEEPSEEK_KEY;
  
  if (!apiKey) {
    throw new Error("检测到 API 配置缺失，请检查 DeepSeek Key 设置。");
  }

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = {};
      }
      
      const msg = errorData.error?.message || `HTTP ${response.status}`;
      
      if (response.status === 401) {
        throw new Error("身份验证失败：当前 API Key 无法通过 DeepSeek 验证。请确认 Key 的有效性并重试。");
      }
      
      throw new Error(`DeepSeek API 错误: ${msg}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // 过滤可能存在的思考标签或 Markdown 代码块
    content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(content);
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error("请求超时，请稍后重试。");
    throw err;
  }
}

export const AIService = {
  analyze: async (sentence: string): Promise<AnalysisResult> => {
    return await callDeepseek(ANALYSIS_PROMPT_BASE, `分析此句: "${sentence}"`);
  },

  correct: async (sentence: string): Promise<CorrectionResult> => {
    return await callDeepseek(CORRECTION_PROMPT_BASE, `纠错: "${sentence}"`);
  }
};
