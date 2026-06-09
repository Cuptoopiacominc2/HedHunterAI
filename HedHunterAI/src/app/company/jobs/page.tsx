import { requireCompany } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";
import { ArrowRight, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Job Posts" };

export default async function CompanyJobsPage() {
  const session = await requireCompany();
  const snap    = await safeGet(adminCol.jobPostsCol().where("companyId","==",session.uid));
  const jobs    = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a:any,b:any)=>(b.createdAt?.seconds??0)-(a.createdAt?.seconds??0)) as any[];

  return (
    <DashboardShell role="COMPANY" title="Job Posts" subtitle={`${jobs.length} total`}
      action={<ButtonLink href="/company/jobs/create" variant="accent" size="sm"><Plus size={14}/>New job</ButtonLink>}>
      <div className="max-w-4xl">
        <Card padded={false}>
          <CardBody className="p-0">
            {jobs.length === 0 ? (
              <div className="p-8 text-center" style={{ color:"#64748b" }}>
                <p className="mb-3">No job posts yet.</p>
                <ButtonLink href="/company/jobs/create" variant="accent" size="sm"><Plus size={14}/>Post your first job →</ButtonLink>
              </div>
            ) : jobs.map((job:any, i:number) => (
              <div key={job.id} className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: i<jobs.length-1?"1px solid rgba(0,0,0,.07)":"none" }}>
                <div>
                  <p className="font-medium text-sm text-[#0f172a]">{job.title}</p>
                  <p className="text-xs mt-0.5" style={{ color:"#64748b" }}>{job.location} · {job.openPositions} open · {formatDate(job.createdAt?.toDate?.() ?? new Date())}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={job.isActive?"good":"muted"} size="xs">{job.isActive?"Active":"Closed"}</Badge>
                  <ButtonLink href={`/company/jobs/${job.id}`} variant="ghost" size="sm"><ArrowRight size={14}/></ButtonLink>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}
