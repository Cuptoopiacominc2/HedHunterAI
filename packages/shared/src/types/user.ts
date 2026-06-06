export type UserRole = "JOB_SEEKER" | "COMPANY" | "ADMIN";

export interface SessionPayload {
  uid: string;
  email: string;
  role: UserRole;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
