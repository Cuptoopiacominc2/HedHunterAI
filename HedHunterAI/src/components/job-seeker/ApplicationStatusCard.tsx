import { Badge, MeritScore } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { HumanReviewNotice } from "@/components/compliance/HumanReviewNotice";
import { formatDate } from "@/utils/formatDate";
import { ArrowRight } from "lucide-react";

interface ApplicationStatusCardProps {
  application: {
    id: string;
    status: string;
    totalScore?: number | null;
    aiConfidence?: number | null;
    requiresHumanReview?: boolean;
    createdAt?: any;
    updatedAt?: any;
    jobTitle?: string;
    companyName?: string;
    jobPost?: { title?: string; company?: { name?: string } };
  };
}

export function ApplicationStatusCard({ application: a }: ApplicationStatusCardProps) {
  const title       = a.jobTitle ?? a.jobPost?.title ?? "Position";
  const companyName = a.companyName ?? a.jobPost?.company?.name ?? "";
  return (
    <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,.05)" }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate" style={{ color: "#0f172a" }}>{title}</p>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{companyName ? `${companyName} · ` : ""}Applied {formatDate(a.createdAt?.toDate?.() ?? a.createdAt ?? new Date())}</p>
          {a.requiresHumanReview && <div className="mt-2"><HumanReviewNotice /></div>}
        </div>
        <div className="flex items-center gap-3 flex-none">
          {a.totalScore != null && <MeritScore score={Math.round(a.totalScore)} />}
          <Badge status={a.status}>{a.status.replace(/_/g, " ")}</Badge>
          <ButtonLink href={`/job-seeker/applications/${a.id}`} variant="ghost" size="sm">
            <ArrowRight size={14} />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
