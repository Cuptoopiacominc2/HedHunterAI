import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const COLS = [
  {h:"Platform",links:[{l:"How it works",h:"/how-it-works"},{l:"Guardrails",h:"/how-it-works#guardrails"},{l:"Merit Pledge",h:"/merit-based-hiring"},{l:"Pricing",h:"/pricing"}]},
  {h:"Seekers",links:[{l:"Apply anonymously",h:"/signup/job-seeker"},{l:"Accommodation",h:"/job-seeker/onboarding"},{l:"Appeals",h:"/job-seeker/applications"},{l:"Status",h:"/job-seeker/applications"}]},
  {h:"Companies",links:[{l:"Verify company",h:"/signup/company"},{l:"Post a role",h:"/company/jobs/create"},{l:"Question builder",h:"/company/jobs"},{l:"Ratings",h:"/company/ratings"}]},
  {h:"Legal",links:[{l:"Privacy policy",h:"/privacy"},{l:"Terms of service",h:"/terms"},{l:"AI disclosure",h:"/ai-hiring-disclosure"},{l:"EEOC compliance",h:"/merit-based-hiring"}]},
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-20" style={{borderTop:"1px solid rgba(0,0,0,.07)",padding:"56px 0 36px"}}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-3"><Logo height={32} href="/" /></div>
            <p style={{fontSize:13,color:"#64748b",lineHeight:1.6,maxWidth:280}}>Merit-based employment platform. Identity stripped, skill revealed. AI-assisted, human-reviewed, audit-logged.</p>
          </div>
          {COLS.map(col=>(
            <div key={col.h}>
              <h5 style={{fontFamily:"JetBrains Mono,monospace",fontSize:10,letterSpacing:".17em",textTransform:"uppercase",color:"#64748b",marginBottom:14}}>{col.h}</h5>
              <ul className="grid gap-2">
                {col.links.map(l=><li key={l.l}><Link href={l.h} style={{fontSize:13,color:"#475569"}} className="transition-colors hover:text-[#0f172a]">{l.l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center flex-wrap gap-4 mt-12 pt-8" style={{borderTop:"1px solid rgba(0,0,0,.07)"}}>
          <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:10.5,letterSpacing:".13em",textTransform:"uppercase",color:"#64748b"}}>© 2026 Hed Hunter AI — All systems audit-logged.</span>
          <span className="flex items-center gap-2" style={{fontFamily:"JetBrains Mono,monospace",fontSize:10.5,letterSpacing:".13em",textTransform:"uppercase",color:"#64748b"}}>
            <span className="inline-block rounded-full w-1.5 h-1.5" style={{background:"#3ddc97",boxShadow:"0 0 10px #3ddc97"}}/>All systems · operational
          </span>
        </div>
      </div>
    </footer>
  );
}
