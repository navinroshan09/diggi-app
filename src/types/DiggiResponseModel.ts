export interface Claim {
  claim: string;
  actors: string[];
  evidence: string;
}

export interface ClaimLevelFocus {
  claims: Claim[];
}

export interface SourceDetail {
  source: string;
  stance: string;
  key_points: string[];
}

export interface MultiSourceComparison {
  consensus_points: string[];
  disagreement_points: string[];
  sources: SourceDetail[];
}

export interface EvidenceDetail {
  statement: string;
  supporting_passage: string;
  source: string;
  link?: string;
}

export interface EvidenceTraceability {
  evidence: EvidenceDetail[];
}

export interface CredibilitySignals {
  source_reliability: string;
  confidence_level: string;
  verified_facts: string[];
  uncertain_claims: string[];
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface HistoricalContext {
  background: string;
  timeline: TimelineEvent[];
}

export interface PerspectiveDetail {
  stakeholder: string;
  viewpoint: string;
  reasoning: string;
}

export interface Perspectives {
  perspectives: PerspectiveDetail[];
}

export interface ExploratoryQuestions {
  questions: string[];
  related_topics: string[];
}

export interface DiggiResponse {
  data: {
    claim_level_focus: ClaimLevelFocus;
    multi_source_comparison: MultiSourceComparison;
    evidence_traceability: EvidenceTraceability;
    credibility_signals: CredibilitySignals;
    historical_context: HistoricalContext;
    perspectives: Perspectives;
    exploratory_questions: ExploratoryQuestions;
  };
}
