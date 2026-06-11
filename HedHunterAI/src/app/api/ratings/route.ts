import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { ratingSchema } from "@/lib/validators";
import { createAuditLog } from "@/lib/audit-log";

export async function GET(req: NextRequest) {
  const companyId = new URL(req.url).searchParams.get("companyId");
  if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });
  const snap    = await adminCol.companyRatingsCol().where("companyId", "==", companyId).where("isVisible", "==", true).get();
  const ratings = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
  ratings.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
  return NextResponse.json(ratings.slice(0, 50));
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "JOB_SEEKER") return NextResponse.json({ error: "Job seeker required" }, { status: 403 });

  const body   = await req.json();
  const parsed = ratingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { companyId } = body;
  if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });

  // Verify seeker was hired by this company
  const appsSnap = await adminCol.applicationsCol()
    .where("jobSeekerId", "==", session.uid)
    .where("status", "==", "HIRED").get();
  const jobIds   = appsSnap.docs.map(d => d.data().jobPostId);
  if (!jobIds.length) return NextResponse.json({ error: "Must be hired by this company to rate" }, { status: 403 });
  const jobsSnap = await adminCol.jobPostsCol().where("companyId", "==", companyId).get();
  const compJobIds = jobsSnap.docs.map(d => d.id);
  const wasHired = jobIds.some(id => compJobIds.includes(id));
  if (!wasHired) return NextResponse.json({ error: "Must be hired by this company to rate" }, { status: 403 });

  const ref = await adminCol.companyRatingsCol().add({
    companyId, rating: parsed.data.rating, review: parsed.data.review ?? null,
    isVisible: true, createdAt: FieldValue.serverTimestamp(),
  });

  // Recalculate average
  const allSnap = await adminCol.companyRatingsCol().where("companyId", "==", companyId).where("isVisible", "==", true).get();
  const ratings = allSnap.docs.map(d => d.data().rating as number);
  const avg     = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  await adminCol.companyProfiles(companyId).update({ averageRating: avg, totalRatings: ratings.length, updatedAt: FieldValue.serverTimestamp() });

  await createAuditLog({ actorId: session.uid, actorType: "USER", action: "OFFER_ACCEPTED", targetId: ref.id, targetType: "CompanyRating" });
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
