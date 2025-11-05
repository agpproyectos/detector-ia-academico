
export interface ModuleResult {
  module: string;
  score: number;
  contribution: string; // e.g., "+25%"
  finding: string;
}

export interface ModuleDetail {
  module: string;
  score: number;
  contribution: string;
  analysis: string;
}

export interface Evidence {
  quote: string;
  indicator: string;
  impact: string; // e.g., "+15%"
}

export interface FalsePositive {
  factor: string;
  applied: 'Sí' | 'No';
  correction: string; // e.g., "-5%"
}

export interface DetailedAnalysisResult {
  mainResult: {
    probability: number; // The XX% value
    verdict: string; // e.g., "PROBABLE IA"
    confidence: 'BAJA' | 'MEDIA' | 'ALTA';
  };
  justification: string;
  moduleTable: ModuleResult[];
  moduleDetails: ModuleDetail[];
  topEvidences: Evidence[];
  falsePositives: FalsePositive[];
  finalCalculation: string;
  recommendation: string;
}
