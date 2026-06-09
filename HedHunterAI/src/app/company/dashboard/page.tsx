import { requireCompany } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";
import { Briefcase, Users, Star, DollarSign, ArrowRight, Plus } from "lucide-react";

export default async function CompanyDashboard() {
  const session = await requireCompany();

  const [profileSnap, jobsSnap] = await Promise.all([
    adminCol.companyProfiles(session.uid).get(),
    safeGet(adminCol.jobPostsCol().where("companyId", "==", session.uid).limit(20)),
  ]);

  const profile = profileSnap.data();
  if (!profile) return <div className="p-8 text-[#64748b]">Profile not found. Please complete onboarding.</div>;

  const jobs = jobsSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a:any,b:any)=>(b.createdAt?.seconds??0)-(a.createdAt?.seconds??0)).slice(0,5) as any[];

  const stats = [
    { label:"Active Jobs",      value: jobs.filter((j:any) => j.isActive).length, icon:<Briefcase size={18}/>, color:"#5b8def" },
    { label:"Total Applicants", value: "—", icon:<Users size={18}/>, color:"#3ce8ff" },
    { label:"Rating",           value: (profile.averageRating ?? 0).toFixed(1)+"★", icon:<Star size={18}/>, color:"#3ddc97" },
    { label:"Status",           value: profile.status, icon:<DollarSign size={18}/>, color:"#f5a524" },
  ];

  return (
    <DashboardShell role="COMPANY" title="Dashboard" subtitle={`${profile.name || "Your Company"} · ${profile.status}`}
      action={<ButtonLink href="/company/jobs/create" variant="accent"><Plus size={14}/>Post a Job</ButtonLink>}>
      <div className="grid gap-6">
        {profile.status==="PENDING" && (
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{background:"rgba(245,165,36,.08)",border:"1px solid rgba(245,165,36,.25)"}}>
            <span className="text-[#f5a524] font-medium text-sm">Your company is pending admin approval. You can set up your profile while you wait.</span>
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s=>(
            <Card key={s.label} padded={false} hover>
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <span style={{color:s.color}}>{s.icon}</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase" style={{color:"#64748b"}}>{s.label}</span>
                </div>
                <p style={{fontFamily:"Instrument Serif,serif",fontSize:34,letterSpacing:"-.02em",lineHeight:1}}>{s.value}</p>
              </div>
            </Card>
          ))}
        </div>
        <Card padded={false} glowTop>
          <CardHeader>
            <h3 style={{fontFamily:"Instrument Serif,serif",fontSize:22,fontWeight:400}}>Active Job Posts</h3>
            <ButtonLink href="/company/jobs" variant="ghost" size="sm">View all <ArrowRight size={14}/></ButtonLink>
          </CardHeader>
          <CardBody className="p-0">
            {jobs.length===0 ? (
              <div className="p-8 text-center" style={{color:"#64748b"}}>
                <p className="mb-3">No jobs posted yet.</p>
                <ButtonLink href="/company/jobs/create" variant="accent" size="sm"><Plus size={14}/>Post your first job →</ButtonLink>
              </div>
            ) : jobs.map((job:any,i:number)=>(
              <div key={job.id} className="flex items-center justify-between px-6 py-4"
                style={{borderBottom:i<jobs.length-1?"1px solid rgba(0,0,0,.07)":"none"}}>
                <div>
                  <p className="font-medium text-sm text-[#0f172a]">{job.title}</p>
                  <p className="text-xs mt-0.5" style={{color:"#64748b"}}>{job.location} · {job.openPositions} open · {formatDate(job.createdAt?.toDate?.() ?? new Date())}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={job.isActive?"good":"muted"}>{job.isActive?"Active":"Closed"}</Badge>
                  <ButtonLink href={`/company/jobs/${job.id}/candidates`} variant="ghost" size="sm"><ArrowRight size={14}/></ButtonLink>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}
