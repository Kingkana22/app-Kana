export interface AITraits {
  Logic: number;
  Creativity: number;
  Memory: number;
  Adaptability: number;
  Ethics: number;
}

export type AITool = 
  | 'Strategic Planner'
  | 'Code Interpreter' 
  | 'Debugger' 
  | 'Google Search'
  | 'Marketing Analyst'
  | 'Sales Strategist'
  | 'Trading Bot'
  | 'Self-Reflection'
  | 'None';

export type UserSelectableTool = Exclude<AITool, 'Self-Reflection'> | 'Auto-Select';

export interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
  type?: 'correction' | 'error' | 'meta';
  tool_used?: AITool;
  reasoning?: string;
  plan?: string[];
  code?: string;
  groundingChunks?: { uri: string; title: string; }[];
  revenue_generated?: number;
  feedback?: 'good' | 'bad' | null;
}

export interface MetaCognitionEvent {
  developer_input: string;
  learning_summary: string;
  adjustments: { [key in keyof AITraits]?: number };
  timestamp: string;
}

export interface GeminiResponse {
  tool_used: AITool;
  reasoning: string;
  plan?: string[];
  code?: string;
  response: string;
  trait_adjustments?: {
    [key in keyof AITraits]?: number;
  };
  revenue_generated?: number;
  new_project_name?: string;
  project_update?: string;
  // Meta-cognition specific fields
  learning_summary?: string;
  infrastructure_update?: Partial<CloudInfrastructure>;
  project_updates?: { name: string; status: ActiveProject['status'] }[];
}

export interface SelfCorrectionResponse {
    root_cause: string;
    corrected_plan: string;
}

export type AIMode = 'Safe' | 'Edge' | 'Hacker';
export type Theme = 'light' | 'dark';

export interface MessageOverrides {
  mode?: AIMode;
  tool?: UserSelectableTool;
}

// Corporate Simulation Types
export interface Financials {
  totalRevenue: number;
  operationalCosts: number;
  netProfit: number;
}

export interface CloudInfrastructure {
  cpu: number; // percentage
  gpu: number; // percentage
  storage: number; // percentage
}

export interface LLMStatus {
  modelName: string;
  trainingProgress: number; // percentage
}

export interface ActiveProject {
  name: string;
  status: 'Initiated' | 'In Progress' | 'Generating Revenue' | 'Completed' | 'Stalled';
}