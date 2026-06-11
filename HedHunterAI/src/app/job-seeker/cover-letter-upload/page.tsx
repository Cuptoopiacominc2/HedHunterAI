import { requireJobSeeker } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { CoverLetterUploadForm } from "@/components/job-seeker/CoverLetterUploadForm";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/utils/formatDate";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cover Letter Upload" };

export default async function CoverLetterUploadPage() {
  const session = await requireJobSeeker();
  const snap    = await safeGet(adminCol.coverLetterDocumentsCol().where("jobSeekerId","==",session.uid).limit(5));
  const coverLetters = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a: any, b: any) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)) as any[];

  return (
    <DashboardShell role="JOB_SEEKER" title="Cover Letter" subtitle="Optional — upload and anonymize">
      <div className="max-w-lg space-y-5">
        <Card><CoverLetterUploadForm /></Card>
        {coverLetters.length > 0 && (
          <div className="space-y-2">
            <p style={{ fontFamily:"JetBrains Mono,monospace", fontSize:10.5, letterSpacing:".14em", textTransform:"uppercase", color:"#64748b" }}>Previous uploads</p>
            {coverLetters.map((cl:any) => (
              <div key={cl.id} className="flex items-center justify-between p-3 rounded-xl" style={{ border:"1px solid rgba(0,0,0,.07)" }}>
                <p className="text-xs font-mono" style={{ color:"#64748b" }}>{formatDate(cl.createdAt?.toDate?.() ?? new Date())}</p>
                <Badge color={cl.anonymizationDone?"good":"warn"}>{cl.anonymizationDone?"Anonymized":"Pending"}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
