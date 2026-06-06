import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("hed-session");
  if (token) config.headers.Cookie = `hed-session=${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err.response?.status === 401) {
      await SecureStore.deleteItemAsync("hed-session");
    }
    return Promise.reject(err);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  register: (body: { email: string; password: string; role: string; name?: string }) =>
    api.post("/api/auth/register", body),
  login: (body: { email: string; password: string }) =>
    api.post("/api/auth/session", body),
  me: () => api.get("/api/auth/me"),
};

// ─── Jobs ────────────────────────────────────────────────────────────────────
export const jobsApi = {
  list: (params?: { page?: number; search?: string; remote?: boolean }) =>
    api.get("/api/jobs", { params }),
  get: (jobId: string) => api.get(`/api/jobs/${jobId}`),
  create: (body: unknown) => api.post("/api/jobs", body),
  update: (jobId: string, body: unknown) => api.patch(`/api/jobs/${jobId}`, body),
  delete: (jobId: string) => api.delete(`/api/jobs/${jobId}`),
  getQuestions: (jobId: string) => api.get(`/api/jobs/${jobId}/questions`),
  saveQuestions: (jobId: string, questions: unknown[]) =>
    api.put(`/api/jobs/${jobId}/questions`, { questions }),
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const applicationsApi = {
  list: () => api.get("/api/applications"),
  get: (applicationId: string) => api.get(`/api/applications/${applicationId}`),
  apply: (body: { jobPostId: string }) => api.post("/api/applications", body),
  getQuestions: (applicationId: string) =>
    api.get(`/api/applications/${applicationId}/questions`),
  hire: (applicationId: string) =>
    api.post(`/api/applications/${applicationId}/hire`),
};

// ─── Upload ──────────────────────────────────────────────────────────────────
export const uploadApi = {
  upload: (formData: FormData) =>
    api.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─── Transcribe ───────────────────────────────────────────────────────────────
export const transcribeApi = {
  transcribe: (formData: FormData) =>
    api.post("/api/transcribe", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─── Score ────────────────────────────────────────────────────────────────────
export const scoreApi = {
  score: (body: { applicationId: string }) =>
    api.post("/api/score-interview", body),
};

// ─── Offers ───────────────────────────────────────────────────────────────────
export const offersApi = {
  list: () => api.get("/api/offers"),
  create: (body: { applicationId: string; hireDate: string; salary?: number; message?: string }) =>
    api.post("/api/offers", body),
};

// ─── Ratings ──────────────────────────────────────────────────────────────────
export const ratingsApi = {
  rate: (body: { companyId: string; rating: number; review?: string }) =>
    api.post("/api/ratings", body),
};

// ─── Company Profile ──────────────────────────────────────────────────────────
export const companyApi = {
  getProfile: () => api.get("/api/company/profile"),
  updateProfile: (body: unknown) => api.put("/api/company/profile", body),
};

// ─── Stripe ───────────────────────────────────────────────────────────────────
export const stripeApi = {
  checkout: (body: { type: string }) => api.post("/api/stripe/checkout", body),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  getStats: () => api.get("/api/admin"),
  updateUser: (body: unknown) => api.patch("/api/admin", body),
};

// ─── Anonymize ────────────────────────────────────────────────────────────────
export const anonymizeApi = {
  anonymize: (body: { documentId: string; type: string }) =>
    api.post("/api/anonymize", body),
};
