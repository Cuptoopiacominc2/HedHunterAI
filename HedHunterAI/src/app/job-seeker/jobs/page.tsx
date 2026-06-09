import { requireJobSeeker } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { MapPin, ArrowRight, Star, Shield } from "lucide-react";

export default async function JobBoard() {
  await requireJobSeeker();
  // Single-field where to avoid composite index requirement; filter + sort in memory
  const snap = await safeGet(adminCol.jobPostsCol().where("isActive","==",true));
  const jobsRaw = snap.docs
    .map(d => ({ id: d.id, ...d.data() })) as any[];
  const sorted = jobsRaw.sort((a:any,b:any) => (b.createdAt?.seconds??0)-(a.createdAt?.seconds??0));
  const jobs = (await Promise.all(sorted.map(async (j:any) => {
    const c = (await adminCol.companyProfiles(j.companyId).get()).data();
    return { ...j, company: { name: c?.name ?? "", averageRating: c?.averageRating ?? 0, meritPledgeSigned: c?.meritPledgeSigned ?? false } };
  }))).filter(Boolean) as any[];

  return (
    <DashboardShell role="JOB_SEEKER" title="Browse Jobs" subtitle={`${jobs.length} open positions`}>
      <div className="grid gap-4">
        {jobs.length === 0 && <div className="text-center py-16" style={{ color:"#64748b" }}><p>No open positions right now. Check back soon.</p></div>}
        {jobs.map((job:any) => (
          <Card key={job.id} padded={false} hover>
            <div className="flex items-start justify-between gap-6 p-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-[#0f172a]" style={{ fontSize:16 }}>{job.title}</h3>
                  {job.company.meritPledgeSigned && (
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded"
                      style={{ background:"rgba(61,220,151,.09)", color:"#3ddc97", border:"1px solid rgba(61,220,151,.22)" }}>
                      <Shield size={10}/>Merit Pledge
                    </span>
                  )}
                </div>
                <p className="text-sm mb-3" style={{ color:"#64748b" }}>{job.company.name}</p>
                <div className="flex flex-wrap gap-4 text-xs" style={{ color:"#64748b" }}>
                  <span className="flex items-center gap-1.5"><MapPin size={12}/>{job.location}{job.isRemote && " · Remote"}</span>
                  {job.salaryMin && job.salaryMax && <span>{formatCurrency(job.salaryMin*100)} – {formatCurrency(job.salaryMax*100)}</span>}
                  <span>{job.openPositions} position{job.openPositions>1?"s":""} open</span>
                  {job.company.averageRating>0 && <span className="flex items-center gap-1"><Star size={12}/>{job.company.averageRating.toFixed(1)}</span>}
                </div>
              </div>
              <ButtonLink href={`/job-seeker/jobs/${job.id}`} variant="accent" size="sm">Apply anonymously <ArrowRight size={14}/></ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
