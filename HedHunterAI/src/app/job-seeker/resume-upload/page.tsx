import { requireJobSeeker } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ResumeUploadForm } from "@/components/job-seeker/ResumeUploadForm";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/utils/formatDate";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Resume Upload" };

export default async function ResumeUploadPage() {
  const session = await requireJobSeeker();
  const snap    = await safeGet(adminCol.resumeDocumentsCol().where("jobSeekerId","==",session.uid).limit(10));
  const resumes = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  return (
    <DashboardShell role="JOB_SEEKER" title="Resume" subtitle="Upload and anonymize your resume">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card glowTop>
          <div className="mb-5">
            <p className="text-sm mb-1" style={{ color:"#475569" }}>Your resume will be anonymized by AI before employers see it.</p>
            <p className="text-xs" style={{ color:"#64748b" }}>Accepted: PDF, DOCX · Max 10MB</p>
          </div>
          <ResumeUploadForm />
        </Card>
        {resumes.length > 0 && (
          <Card padded={false}>
            <CardHeader><h3 style={{ fontFamily:"Instrument Serif,serif", fontSize:18, fontWeight:400 }}>Previous uploads</h3></CardHeader>
            <CardBody className="p-0">
              {resumes.map((r:any, i:number) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3"
                  style={{ borderBottom: i<resumes.length-1?"1px solid rgba(0,0,0,.05)":"none" }}>
                  <p className="text-xs font-mono" style={{ color:"#64748b" }}>{formatDate(r.createdAt?.toDate?.() ?? new Date())}</p>
                  <Badge color={r.anonymizationDone?"good":"warn"}>{r.anonymizationDone?"Anonymized":"Pending"}</Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
