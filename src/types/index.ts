export type SupportedLanguage = 'c' | 'cpp' | 'python' | 'java' | 'javascript' | 'html_css';

export interface LanguageConfig {
  id: SupportedLanguage;
  name: string;
  badge: string;
  extension: string;
  prismLang: string;
  placeholderCode: string;
  compilerName: string;
  iconColor: string;
}

export interface CodeDiffItem {
  lineOrSection: string;
  change: string;
  reason: string;
}

export interface AnalysisResult {
  errorType: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  errorLine: number | null;
  summary: string;
  simpleExplanation: string;
  rootCause: string;
  stepsToFix: string[];
  correctedCode: string;
  codeDiffSummary: CodeDiffItem[];
  preventionTips: string[];
  educationalConcept: string;
  testCase?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  language: SupportedLanguage;
  codeSnippet: string;
  errorMessageSnippet?: string;
  errorType: string;
  summary: string;
  result: AnalysisResult;
}

export interface ExampleError {
  id: string;
  title: string;
  language: SupportedLanguage;
  errorType: string;
  difficulty: 'Beginner' | 'Intermediate';
  tag: string;
  description: string;
  code: string;
  errorMessage: string;
}
