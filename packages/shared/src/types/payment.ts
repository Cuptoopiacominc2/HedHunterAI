export type PaymentType =
  | "SEEKER_ANNUAL"
  | "SEEKER_OFFER"
  | "COMPANY_ANNUAL"
  | "COMPANY_JOB_POST";

export type PaymentStatus = "PENDING" | "COMPLETED" | "REFUNDED" | "FAILED";

export interface Payment {
  id: string;
  userId: string;
  type: PaymentType;
  status: PaymentStatus;
  amountCents: number;
  stripePaymentId?: string;
  createdAt: string;
}
