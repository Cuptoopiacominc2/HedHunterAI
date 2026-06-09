import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { createAuditLog } from "@/lib/audit-log";
import { generateApplicantCode } from "@/utils/generateApplicantCode";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { uid, role } = session;

  if (role === "JOB_SEEKER") {
    const snap = await adminCol.applicationsCol().where("jobSeekerId", "==", uid).orderBy("updatedAt", "desc").get();
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  if (role === "COMPANY") {
    // Get all jobPost IDs for this company
    const jobsSnap = await adminCol.jobPostsCol().where("companyId", "==", uid).get();
    const jobIds   = jobsSnap.docs.map(d => d.id);
    if (!jobIds.length) return NextResponse.json([]);
    const snap = await adminCol.applicationsCol().where("jobPostId", "in", jobIds.slice(0, 10)).orderBy("totalScore", "desc").get();
    return NextResponse.json(snap.docs.map(d => {
      const d2 = d.data();
      return { id: d.id, anonymousCode: d2.anonymousCode, status: d2.status, totalScore: d2.totalScore, aiConfidence: d2.aiConfidence, requiresHumanReview: d2.requiresHumanReview, createdAt: d2.createdAt, jobPostId: d2.jobPostId };
    }));
  }

  if (role === "ADMIN") {
    const snap = await adminCol.applicationsCol().orderBy("createdAt", "desc").limit(100).get();
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "JOB_SEEKER") return NextResponse.json({ error: "Job seeker only" }, { status: 403 });

  const profileSnap = await adminCol.jobSeekerProfiles(session.uid).get();
  if (!profileSnap.exists || !profileSnap.data()?.registrationPaid) {
    return NextResponse.json({ error: "Registration fee required" }, { status: 402 });
  }

  const { jobPostId, resumeDocId, coverLetterDocId } = await req.json();
  if (!jobPostId) return NextResponse.json({ error: "jobPostId required" }, { status: 400 });

  const existing = await adminCol.applicationsCol()
    .where("jobSeekerId", "==", session.uid)
    .where("jobPostId", "==", jobPostId).get();
  if (!existing.empty) return NextResponse.json({ error: "Already applied" }, { status: 409 });

  const ref = await adminCol.applicationsCol().add({
    jobSeekerId:    session.uid,
    jobPostId,
    anonymousCode:  generateApplicantCode(),
    status:         "DRAFT",
    totalScore:     null,
    aiConfidence:   null,
    requiresHumanReview:    false,
    accommodationRequested: false,
    identityUnsealed:       false,
    hireDate:               null,
    ...(resumeDocId      && { resumeDocId }),
    ...(coverLetterDocId && { coverLetterDocId }),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await createAuditLog({ actorId: session.uid, actorType: "USER", action: "APPLICATION_SUBMITTED", targetId: ref.id, targetType: "Application" });
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
