export interface JobPost {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requiredQualifications: string;
  preferredQualifications?: string;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  isRemote: boolean;
  isHybrid: boolean;
  openPositions: number;
  isActive: boolean;
  paymentConfirmed: boolean;
  createdAt: string;
  company?: { name: string; logo?: string; averageRating: number };
}

export interface InterviewQuestion {
  id: string;
  jobPostId: string;
  order: number;
  questionText: string;
  timeLimitSec: number;
  idealAnswer?: string;
  weight: number;
  isFlagged: boolean;
  flagReason?: string;
}

export interface CreateJobPostInput {
  title: string;
  description: string;
  requiredQualifications: string;
  preferredQualifications?: string;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  isRemote: boolean;
  isHybrid: boolean;
  openPositions: number;
}
