import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { createAuditLog } from "@/lib/audit-log";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "JOB_SEEKER") {
    const appsSnap = await adminCol.applicationsCol().where("jobSeekerId", "==", session.uid).get();
    const appIds   = appsSnap.docs.map(d => d.id);
    if (!appIds.length) return NextResponse.json([]);
    const snap  = await adminCol.offersCol().where("applicationId", "in", appIds.slice(0, 10)).get();
    const offers = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
    offers.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
    return NextResponse.json(offers);
  }

  if (session.role === "COMPANY") {
    const jobsSnap = await adminCol.jobPostsCol().where("companyId", "==", session.uid).get();
    const jobIds   = jobsSnap.docs.map(d => d.id);
    if (!jobIds.length) return NextResponse.json([]);
    const appsSnap = await adminCol.applicationsCol().where("jobPostId", "in", jobIds.slice(0, 10)).get();
    const appIds   = appsSnap.docs.map(d => d.id);
    if (!appIds.length) return NextResponse.json([]);
    const snap = await adminCol.offersCol().where("applicationId", "in", appIds.slice(0, 10)).get();
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "COMPANY") return NextResponse.json({ error: "Company only" }, { status: 403 });

  const { applicationId, hireDate, salary, message } = await req.json();
  if (!applicationId || !hireDate) return NextResponse.json({ error: "applicationId and hireDate required" }, { status: 400 });

  const ref = await adminCol.offersCol().add({
    applicationId,
    hireDate:    new Date(hireDate),
    salary:      salary ?? null,
    message:     message ?? null,
    isAccepted:  null,
    paymentDone: false,
    createdAt:   FieldValue.serverTimestamp(),
  });

  await adminCol.applications(applicationId).update({ status: "OFFER_SENT", updatedAt: FieldValue.serverTimestamp() });
  await createAuditLog({ actorId: session.uid, actorType: "USER", action: "OFFER_SENT", targetId: ref.id, targetType: "Offer", metadata: { applicationId } });

  return NextResponse.json({ id: ref.id }, { status: 201 });
}
