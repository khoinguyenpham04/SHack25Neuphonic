export interface CodeAssistance {
  explanation: string;
  hints: string[];
  feedback?: string;
}

export interface AIFeedback {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  line?: number;
  column?: number;
}

export interface CodeAnalysis {
  feedback: AIFeedback[];
  suggestions: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}