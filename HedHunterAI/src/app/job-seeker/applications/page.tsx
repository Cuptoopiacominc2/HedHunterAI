import { requireJobSeeker } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ApplicationStatusCard } from "@/components/job-seeker/ApplicationStatusCard";
import { ButtonLink } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Applications" };

export default async function ApplicationsPage() {
  const session = await requireJobSeeker();
  const snap    = await safeGet(adminCol.applicationsCol().where("jobSeekerId","==",session.uid));
  const raw     = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  // Enrich with job title + company name (avoids composite index, avoids undefined jobPost crash)
  const apps = await Promise.all(raw.map(async (a: any) => {
    try {
      const jobSnap  = await adminCol.jobPosts(a.jobPostId).get();
      const job      = jobSnap.data();
      const compSnap = job?.companyId ? await adminCol.companyProfiles(job.companyId).get() : null;
      return { ...a, jobTitle: job?.title ?? "Position", companyName: compSnap?.data()?.name ?? "" };
    } catch { return { ...a, jobTitle: "Position", companyName: "" }; }
  }));

  apps.sort((a:any,b:any)=>(b.updatedAt?.seconds??0)-(a.updatedAt?.seconds??0));

  const submitted = apps.filter((a:any) => a.status==="SUBMITTED").length;
  const reviewing = apps.filter((a:any) => ["REVIEWING","SHORTLISTED"].includes(a.status)).length;
  const offers    = apps.filter((a:any) => ["OFFER_SENT","HIRED"].includes(a.status)).length;

  return (
    <DashboardShell role="JOB_SEEKER" title="Applications" subtitle={`${apps.length} total`}
      action={<ButtonLink href="/job-seeker/jobs" variant="accent" size="sm">Browse more jobs →</ButtonLink>}>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {[{l:"Submitted",v:submitted,c:"#5b8def"},{l:"Under review",v:reviewing,c:"#3ce8ff"},{l:"Offers",v:offers,c:"#3ddc97"}].map(s => (
            <div key={s.l} className="p-4 rounded-xl text-center" style={{ border:"1px solid rgba(0,0,0,.07)", background:"rgba(0,0,0,.03)" }}>
              <p style={{ fontFamily:"Instrument Serif,serif", fontSize:30, color:s.c }}>{s.v}</p>
              <p className="text-xs font-mono" style={{ color:"#64748b" }}>{s.l}</p>
            </div>
          ))}
        </div>
        <Card padded={false}>
          <CardHeader><h3 style={{ fontFamily:"Instrument Serif,serif", fontSize:20, fontWeight:400 }}>All applications</h3></CardHeader>
          <CardBody className="p-0">
            {apps.length === 0 ? (
              <div className="p-8 text-center" style={{ color:"#64748b" }}>
                <p className="mb-3">No applications yet.</p>
                <ButtonLink href="/job-seeker/jobs" variant="accent" size="sm">Browse open positions →</ButtonLink>
              </div>
            ) : apps.map((a:any) => <ApplicationStatusCard key={a.id} application={a}/>)}
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}
