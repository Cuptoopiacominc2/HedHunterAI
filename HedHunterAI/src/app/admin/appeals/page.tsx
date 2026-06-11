import { requireAdmin } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AppealReviewPanel } from "@/components/admin/AppealReviewPanel";

export default async function AdminAppealsPage() {
  await requireAdmin();
  const rawSnap = await safeGet(adminCol.appealsCol().where("status", "==", "OPEN").limit(50));
  const snap    = { docs: [...rawSnap.docs].sort((a, b) => (a.data().createdAt?.seconds ?? 0) - (b.data().createdAt?.seconds ?? 0)) };

  const rows = await Promise.all(snap.docs.map(async d => {
    const a        = d.data();
    const appSnap  = await adminCol.applications(a.applicationId).get();
    return {
      id:            d.id,
      applicantCode: appSnap.data()?.anonymousCode ?? "—",
      reason:        a.reason,
      status:        a.status,
      createdAt:     a.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      applicationId: a.applicationId,
    };
  }));

  return (
    <DashboardShell role="ADMIN" title="Appeals" subtitle={`${rows.length} open`}>
      <div className="max-w-2xl">
        <AppealReviewPanel appeals={rows} />
      </div>
    </DashboardShell>
  );
}
