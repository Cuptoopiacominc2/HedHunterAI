import { requireJobSeeker } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PreviewActions } from "./PreviewActions";
import { ButtonLink } from "@/components/ui/Button";

export default async function AnonymizedPreviewPage() {
  const session = await requireJobSeeker();
  // No orderBy to avoid composite index requirement — sort in memory
  const snap    = await safeGet(adminCol.resumeDocumentsCol().where("jobSeekerId","==",session.uid).limit(20));
  const sorted  = snap.docs.sort((a, b) => (b.data().createdAt?.seconds ?? 0) - (a.data().createdAt?.seconds ?? 0));
  const resume  = sorted.length === 0 ? null : { id: sorted[0].id, ...sorted[0].data() } as any;

  return (
    <DashboardShell role="JOB_SEEKER" title="Anonymized preview" subtitle="This is what employers see">
      <div className="max-w-2xl space-y-5">
        {!resume ? (
          <div className="py-10 text-center" style={{ color:"#64748b" }}>
            <p className="mb-3">No resume uploaded yet.</p>
            <ButtonLink href="/job-seeker/resume-upload" variant="accent" size="sm">Upload resume →</ButtonLink>
          </div>
        ) : !resume.anonymizationDone ? (
          <div className="py-10 text-center" style={{ color:"#f5a524" }}>
            <p>Anonymization in progress…</p>
          </div>
        ) : (
          <PreviewActions
            anonymizedText={resume.anonymizedText ?? ""}
            confidenceScore={resume.confidenceScore ?? 1}
          />
        )}
      </div>
    </DashboardShell>
  );
}
