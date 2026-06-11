import { requireAdmin } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { FlaggedQuestionTable } from "@/components/admin/FlaggedQuestionTable";

export default async function FlaggedQuestionsPage() {
  await requireAdmin();

  const rawSnap = await safeGet(adminCol.complianceFlagsCol().where("isResolved", "==", false).limit(100));
  const snap    = { docs: [...rawSnap.docs].sort((a, b) => (a.data().createdAt?.seconds ?? 0) - (b.data().createdAt?.seconds ?? 0)) };
  const questions = await Promise.all(snap.docs.map(async d => {
    const f       = d.data();
    const jobSnap = await adminCol.jobPosts(f.jobPostId).get();
    return { id: d.id, jobTitle: jobSnap.data()?.title ?? "—", companyName: "—", questionText: f.questionText, flagReason: f.flagReason, isFlagged: true };
  }));

  return (
    <DashboardShell role="ADMIN" title="Flagged questions"
      subtitle={`${questions.length} unresolved`}>
      <div className="max-w-5xl">
        <Card><FlaggedQuestionTable questions={questions} /></Card>
      </div>
    </DashboardShell>
  );
}
