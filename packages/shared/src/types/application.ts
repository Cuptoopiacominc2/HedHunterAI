export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "OFFER_SENT"
  | "HIRED"
  | "REJECTED"
  | "APPEALING";

export interface Application {
  id: string;
  jobSeekerId: string;
  jobPostId: string;
  anonymousCode: string;
  status: ApplicationStatus;
  totalScore?: number;
  aiConfidence?: number;
  requiresHumanReview: boolean;
  accommodationRequested: boolean;
  accommodationType?: string;
  identityUnsealed: boolean;
  hireDate?: string;
  createdAt: string;
  jobPost?: { title: string; company?: { name: string } };
}

export interface InterviewAnswer {
  id: string;
  applicationId: string;
  questionId: string;
  audioUrl?: string;
  transcript?: string;
  anonymizedTranscript?: string;
  isWritten: boolean;
  createdAt: string;
}

export interface AIScoreResult {
  id: string;
  applicationId: string;
  answerId: string;
  score: number;
  explanation: string;
  strengths: string[];
  missingPoints: string[];
  confidence: number;
  requiresHumanReview: boolean;
  humanOverrideScore?: number;
}
