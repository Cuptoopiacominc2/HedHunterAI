import { requireJobSeeker } from "@/lib/auth";
import { adminCol } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge, ScoreBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { HumanReviewNotice } from "@/components/compliance/HumanReviewNotice";
import { Progress } from "@/components/ui/Progress";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Application Detail" };

export default async function ApplicationDetailPage({ params }: { params: { applicationId: string } }) {
  const session = await requireJobSeeker();
  const appSnap = await adminCol.applications(params.applicationId).get();
  if (!appSnap.exists || appSnap.data()?.jobSeekerId !== session.uid) notFound();
  const app = { id: appSnap.id, ...appSnap.data() } as any;

  const [jobSnap, answersSnap, scoresSnap] = await Promise.all([
    adminCol.jobPosts(app.jobPostId).get(),
    adminCol.appAnswers(params.applicationId).get(),
    adminCol.appScores(params.applicationId).get(),
  ]);
  const job     = { id: jobSnap.id, ...jobSnap.data() } as any;
  const compSnap = await adminCol.companyProfiles(job.companyId).get();
  const comp    = compSnap.data() as any;
  const answers = answersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
  const scores  = scoresSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  return (
    <DashboardShell role="JOB_SEEKER" title={job.title} subtitle={`${comp?.name ?? ""} · ${app.anonymousCode}`}>
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge status={app.status}>{app.status.replace(/_/g," ")}</Badge>
          {app.totalScore !== null && <ScoreBadge score={app.totalScore} />}
          {app.requiresHumanReview && <HumanReviewNotice />}
        </div>
        {app.totalScore !== null && (
          <Card>
            <p className="text-xs font-mono mb-2" style={{ color:"#64748b" }}>Merit score</p>
            <Progress value={app.totalScore} />
            <p className="text-right text-xs font-mono mt-1" style={{ color:"#64748b" }}>{app.totalScore}/100</p>
          </Card>
        )}
        {answers.length > 0 && (
          <Card padded={false}>
            <CardHeader><h3 style={{ fontFamily:"Instrument Serif,serif", fontSize:18, fontWeight:400 }}>Interview answers</h3></CardHeader>
            <CardBody className="p-0">
              {answers.map((a:any, i:number) => {
                const sc = scores.find((s:any) => s.answerId === a.id);
                return (
                  <div key={a.id} className="px-6 py-4" style={{ borderBottom: i<answers.length-1?"1px solid rgba(0,0,0,.07)":"none" }}>
                    <p className="text-xs font-mono mb-1" style={{ color:"#64748b" }}>Q{i+1}</p>
                    <p className="text-sm mb-2" style={{ color:"#0f172a" }}>{a.anonymizedTranscript ?? a.transcript ?? "—"}</p>
                    {sc && <p className="text-xs" style={{ color:"#64748b" }}>Score: {sc.score}/5 · {sc.explanation}</p>}
                  </div>
                );
              })}
            </CardBody>
          </Card>
        )}
        <div className="flex gap-3 flex-wrap">
          <ButtonLink href="/job-seeker/applications" variant="ghost" size="sm">← Back</ButtonLink>
          {app.status === "DRAFT" && (
            <ButtonLink href={`/job-seeker/interview/${params.applicationId}`} variant="accent" size="sm">
              {answers.length === 0 ? "Start interview →" : "Continue interview →"}
            </ButtonLink>
          )}
          {app.status === "HIRED" && (
            <ButtonLink href={`/job-seeker/rate-company/${job.companyId}`} variant="accent" size="sm">Rate this company →</ButtonLink>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
