export type CompanyStatus = "PENDING" | "APPROVED" | "SUSPENDED";

export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  logo?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  website?: string;
  industry?: string;
  annualRevenue?: string;
  meritPledgeSigned: boolean;
  status: CompanyStatus;
  averageRating: number;
  totalRatings: number;
  annualPaid: boolean;
  createdAt: string;
}

export interface CompanyRating {
  id: string;
  companyId: string;
  rating: number;
  review?: string;
  isVisible: boolean;
  createdAt: string;
}
