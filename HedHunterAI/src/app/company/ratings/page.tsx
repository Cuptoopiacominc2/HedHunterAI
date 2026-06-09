import { requireCompany } from "@/lib/auth";
import { adminCol, safeGet } from "@/lib/db-admin";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { CompanyRatingSummary } from "@/components/company/CompanyRatingSummary";
import { Star } from "lucide-react";

export default async function CompanyRatingsPage() {
  const session = await requireCompany();
  const snap    = await safeGet(adminCol.companyRatingsCol().where("companyId", "==", session.uid));
  const ratings = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a:any,b:any)=>(b.createdAt?.seconds??0)-(a.createdAt?.seconds??0)) as any[];
  const total   = ratings.length;
  const average = total > 0 ? ratings.reduce((s, r: any) => s + r.rating, 0) / total : 0;
  const distribution: Record<number, number> = {};
  for (const r of ratings as any[]) distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;

  return (
    <DashboardShell role="COMPANY" title="Company ratings" subtitle="Ratings left by hired candidates">
      <div className="max-w-2xl space-y-5">
        <Card><CompanyRatingSummary total={total} average={average} distribution={distribution} /></Card>
        {(ratings as any[]).map((r: any) => (
          <Card key={r.id}>
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={13} fill={s <= r.rating ? "#f5c518" : "transparent"} style={{ color: s <= r.rating ? "#f5c518" : "#94a3b8" }}/>
              ))}
            </div>
            {r.review && <p className="text-sm leading-relaxed italic" style={{ color: "#475569" }}>&ldquo;{r.review}&rdquo;</p>}
            <p className="text-xs font-mono mt-2" style={{ color: "#94a3b8" }}>
              {new Date(r.createdAt?.toDate?.() ?? new Date()).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })}
            </p>
          </Card>
        ))}
        {ratings.length === 0 && (
          <div className="py-10 text-center" style={{ color: "#64748b" }}>
            <p className="text-sm font-mono">No ratings yet.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
