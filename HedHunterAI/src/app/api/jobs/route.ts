import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { jobPostSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search   = searchParams.get("search")?.toLowerCase() ?? "";
  const isRemote = searchParams.get("isRemote");
  const page     = parseInt(searchParams.get("page") ?? "1");
  const limit    = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);

  const snap = await adminCol.jobPostsCol()
    .where("isActive", "==", true)
    .where("paymentConfirmed", "==", true)
    .get();
  let jobs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
  jobs.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));

  if (search)           jobs = jobs.filter((j: any) => j.title?.toLowerCase().includes(search));
  if (isRemote === "true") jobs = jobs.filter((j: any) => j.isRemote);

  const total  = jobs.length;
  const paged  = jobs.slice((page - 1) * limit, page * limit);

  // Enrich with company profile
  const enriched = await Promise.all(paged.map(async (j: any) => {
    const compSnap = await adminCol.companyProfiles(j.companyId).get();
    const comp     = compSnap.data();
    return { ...j, company: { uid: j.companyId, name: comp?.name, averageRating: comp?.averageRating, meritPledgeSigned: comp?.meritPledgeSigned } };
  }));

  return NextResponse.json({ jobs: enriched.filter(Boolean), total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "COMPANY") return NextResponse.json({ error: "Company only" }, { status: 403 });

  const compSnap = await adminCol.companyProfiles(session.uid).get();
  if (!compSnap.exists || !compSnap.data()?.annualPaid) {
    return NextResponse.json({ error: "Annual fee required before posting jobs" }, { status: 402 });
  }

  const body   = await req.json();
  const parsed = jobPostSchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fieldMsgs = Object.entries(flat.fieldErrors)
      .map(([f, errs]) => `${f}: ${(errs as string[]).join(", ")}`)
      .join("; ");
    const msg = fieldMsgs || flat.formErrors.join("; ") || "Validation failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const ref = await adminCol.jobPostsCol().add({
    ...parsed.data,
    companyId:        session.uid,
    isActive:         true,
    paymentConfirmed: false,
    createdAt:        FieldValue.serverTimestamp(),
    updatedAt:        FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ job: { id: ref.id } }, { status: 201 });
}
