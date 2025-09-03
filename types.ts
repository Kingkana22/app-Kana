/**
 * Represents a single message in the chat history.
 */
export interface ChatMessage {
  /** A unique identifier for the message, typically a timestamp. */
  id: number;
  /** The sender of the message. */
  sender: 'user' | 'ai' | 'system';
  /** The text content of the message. */
  text: string;
  /** Optional flag to indicate the AI is still generating this response. */
  isLoading?: boolean;
  // FIX: Add optional properties for rich AI messages to resolve type errors in ChatInterface.
  type?: 'correction' | 'meta';
  tool_used?: AITool | 'None';
  reasoning?: string;
  plan?: string[];
  feedback?: 'good' | 'bad';
  code?: string;
  revenue_generated?: number;
  groundingChunks?: {uri: string; title: string}[];
}

/**
 * Represents a piece of information the user has asked the AI to remember.
 */
export interface Memory {
  /** A unique identifier for the memory. */
  id: number;
  /** The original, full text content that was committed to memory. */
  content: string;
  /** An AI-generated summary of the content for quick reference. */
  summary: string;
  /** The ISO 8601 timestamp of when the memory was created. */
  createdAt: string;
}

/**
 * Defines the available top-level modules in the KAI application.
 */
export type AIModule = 'Converse' | 'Create' | 'Analyze' | 'Memory';

/**
 * Defines the available UI themes.
 */
export type Theme = 'light' | 'dark';

// FIX: Add missing types that were used across various components.
export type AITraitName = 'Logic' | 'Creativity' | 'Memory' | 'Adaptability' | 'Ethics';

export type AITraits = Record<AITraitName, number>;

export type AIMode = 'Safe' | 'Edge' | 'Hacker';

export type AITool = 
  | 'Strategic Planner' 
  | 'Google Search' 
  | 'Code Interpreter' 
  | 'Debugger' 
  | 'Marketing Analyst' 
  | 'Sales Strategist' 
  | 'Trading Bot';
  
export type UserSelectableTool = 'Auto-Select' | AITool | 'None';

export interface Financials {
  totalRevenue: number;
  operationalCosts: number;
  netProfit: number;
}

export interface CloudInfrastructure {
  cpu: number;
  gpu: number;
  storage: number;
}

export interface LLMStatus {
  modelName: string;
  trainingProgress: number;
}

export interface ActiveProject {
  name: string;
  status: 'Initiated' | 'In Progress' | 'Generating Revenue' | 'Completed' | 'Stalled';
}

export interface MetaCognitionEvent {
  developer_input: string;
  learning_summary: string;
  adjustments: Partial<AITraits>;
}
