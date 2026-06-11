import { adminCol, FieldValue } from "@/lib/db-admin";
import type { JobPostInput } from "@/lib/validators";

export async function createJobPost(data: JobPostInput, companyId: string) {
  const ref = await adminCol.jobPostsCol().add({
    ...data, companyId, isActive: true, paymentConfirmed: false,
    createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id };
}

export async function updateJobPost(id: string, data: Partial<JobPostInput>, companyId: string) {
  const snap = await adminCol.jobPosts(id).get();
  if (!snap.exists || snap.data()?.companyId !== companyId) throw new Error("Not found");
  await adminCol.jobPosts(id).update({ ...data, updatedAt: FieldValue.serverTimestamp() });
}

export async function getJobPostWithDetails(id: string) {
  const snap     = await adminCol.jobPosts(id).get();
  if (!snap.exists) return null;
  const job      = snap.data()!;
  const qSnap    = await adminCol.jobQuestions(id).orderBy("order", "asc").get();
  const compSnap = await adminCol.companyProfiles(job.companyId).get();
  const appSnap  = await adminCol.applicationsCol().where("jobPostId", "==", id).get();
  return {
    id, ...job,
    questions: qSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    company:   compSnap.exists ? { uid: job.companyId, ...compSnap.data() } : null,
    _count:    { applications: appSnap.size },
  };
}

export async function getCompanyJobs(companyId: string) {
  const rawSnap = await adminCol.jobPostsCol().where("companyId", "==", companyId).get();
  const snap    = { docs: [...rawSnap.docs].sort((a, b) => (b.data().createdAt?.seconds ?? 0) - (a.data().createdAt?.seconds ?? 0)) };
  return Promise.all(snap.docs.map(async d => {
    const qSnap  = await adminCol.jobQuestions(d.id).get();
    const aSnap  = await adminCol.applicationsCol().where("jobPostId", "==", d.id).get();
    return { id: d.id, ...d.data(), _count: { questions: qSnap.size, applications: aSnap.size } };
  }));
}

export async function deleteJobPost(id: string, companyId: string) {
  const snap = await adminCol.jobPosts(id).get();
  if (!snap.exists || snap.data()?.companyId !== companyId) throw new Error("Not found");
  await adminCol.jobPosts(id).update({ isActive: false, updatedAt: FieldValue.serverTimestamp() });
}

export function calculateJobPostCost(openPositions: number): number {
  return openPositions * 5000;
}
