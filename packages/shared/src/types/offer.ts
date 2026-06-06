export interface Offer {
  id: string;
  applicationId: string;
  hireDate: string;
  salary?: number;
  message?: string;
  isAccepted?: boolean;
  acceptedAt?: string;
  paymentDone: boolean;
  createdAt: string;
  application?: {
    jobPost?: { title: string; company?: { name: string } };
  };
}
