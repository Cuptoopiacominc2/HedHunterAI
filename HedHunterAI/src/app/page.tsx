import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

function Dot({ color = "#3ce8ff" }: { color?: string }) {
  return <span className="inline-block rounded-full w-1.5 h-1.5 flex-none" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />;
}

function MonoLabel({ children, color = "#64748b" }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color }}>{children}</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#0f172a" }}>
      <style>{`
        @keyframes sc{0%,100%{transform:translateY(-100%)}50%{transform:translateY(100%)}}
        @keyframes fi{from{transform:scaleX(0)}}
        @keyframes sm{0%{top:-55px;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}
        .sc-anim{animation:sc 3.2s ease-in-out infinite}
        .fill-anim{animation:fi 1.5s cubic-bezier(.2,.7,.2,1) both;transform-origin:left}
        .scan-anim{animation:sm 3.8s ease-in-out infinite}
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="relative z-10 pt-20 pb-12" style={{ background: "radial-gradient(1100px 500px at 80% -10%,rgba(91,141,239,.13),transparent 60%),radial-gradient(800px 400px at -5% 35%,rgba(60,232,255,.07),transparent 60%)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-7">
            <Dot /><MonoLabel>FILE // HH-AI // CASE #4827</MonoLabel>
            <span className="flex-1 h-px bg-white/[.07]" />
            <MonoLabel>EST. 2026</MonoLabel>
            <span className="flex-1 h-px bg-white/[.07]" />
            <MonoLabel>IDENTITY LAYER :: ACTIVE</MonoLabel>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-start">
            <div>
              <h1 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(42px,6.5vw,96px)", lineHeight: 1.02, letterSpacing: "-.03em", fontWeight: 400, marginBottom: 28 }}>
                HedHunterAi —<br />
                <em style={{ fontStyle: "italic" }}>Merit-Based</em><br />
                Hiring Platform
              </h1>

              <p style={{ fontSize: 17, lineHeight: 1.55, color: "#475569", maxWidth: 540, marginBottom: 28 }}>
                Hed Hunter AI is a merit-based hiring platform that <strong style={{ color: "#0f172a", fontWeight: 500 }}>strips identity</strong> from résumés, cover letters and transcripts. Candidates are scored by AI <strong style={{ color: "#0f172a", fontWeight: 500 }}>against the company&apos;s own rubric</strong> — then a human reviews every decision.
              </p>

              <div className="flex flex-wrap gap-3 items-center mb-10">
                <Link href="/signup/job-seeker" className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] text-sm font-medium text-white transition-all hover:-translate-y-px hover:brightness-110"
                  style={{ background: "linear-gradient(180deg,#6797ff,#3a6fe0)", boxShadow: "0 8px 22px -8px rgba(91,141,239,.5),inset 0 1px 0 rgba(0,0,0,.13)" }}>
                  Apply as Anonymous →
                </Link>
                <Link href="/signup/company" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm transition-all hover:bg-black/[.04] hover:text-[#0f172a]"
                  style={{ color: "#475569", border: "1px solid rgba(0,0,0,.07)" }}>
                  Hire on merit
                </Link>
                <MonoLabel>$10/yr seekers · $100/yr companies</MonoLabel>
              </div>

              <div className="grid grid-cols-3 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,.07)", maxWidth: 580 }}>
                {[{ n: "14", l: "vectors stripped per doc" }, { n: "0–5", l: "rubric-bound per Q" }, { n: "100%", l: "human-reviewed hires" }].map(s => (
                  <div key={s.l}>
                    <p style={{ fontFamily: "Instrument Serif,serif", fontSize: 38, letterSpacing: "-.02em", lineHeight: 1, color: "#3ce8ff" }}>{s.n}</p>
                    <MonoLabel>{s.l}</MonoLabel>
                  </div>
                ))}
              </div>
            </div>

            {/* Dossier card */}
            <div className="relative overflow-hidden rounded-[17px]" style={{ background: "linear-gradient(180deg,#f5f7fa,#0a1326)", border: "1px solid rgba(0,0,0,.11)", boxShadow: "0 28px 55px -28px rgba(0,0,0,.6)" }}>
              <span className="absolute left-0 right-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(60,232,255,.7),transparent)" }} />
              <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid rgba(0,0,0,.07)", background: "rgba(255,255,255,.015)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-lg grid place-items-center" style={{ background: "repeating-linear-gradient(135deg,#0a0a0a 0 4px,#1a1a1a 4px 8px)", border: "1px solid #000" }}>
                    <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 12, color: "#3ce8ff" }}>#</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 12.5, color: "#0f172a" }}>Applicant #4827</p>
                    <MonoLabel>Identity protected</MonoLabel>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="text-right"><MonoLabel>Merit</MonoLabel><p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11, color: "#475569", fontWeight: 500 }}>87 / 100</p></div>
                  <div className="relative grid place-items-center w-11 h-11 rounded-full" style={{ background: "conic-gradient(#3ce8ff 87%,rgba(0,0,0,.07) 0)" }}>
                    <span className="absolute inset-1.5 rounded-full" style={{ background: "#f5f7fa" }} />
                    <span className="relative" style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 12, fontWeight: 600, color: "#0f172a" }}>87</span>
                  </div>
                </div>
              </div>
              <div className="p-4 grid gap-4">
                {[{ k: "Position", v: "Senior Backend Engineer · Remote" }, { k: "Experience", v: "8 yrs · distributed systems, payments infra" }, { k: "Education", v: "Applicant earned a B.S. in Computer Science" }].map(f => (
                  <div key={f.k} className="grid gap-3" style={{ gridTemplateColumns: "96px 1fr", fontSize: 13, alignItems: "start" }}>
                    <MonoLabel>{f.k}</MonoLabel><span style={{ color: "#475569" }}>{f.v}</span>
                  </div>
                ))}
                <div className="grid gap-2">
                  {[{ q: "Q1·Sys", v: 4.8, w: 96 }, { q: "Q2·DB", v: 4.6, w: 92 }, { q: "Q3·API", v: 4.4, w: 88 }, { q: "Q4·Sec", v: 3.7, w: 74 }].map(b => (
                    <div key={b.q} className="grid items-center gap-2.5" style={{ gridTemplateColumns: "52px 1fr 24px", fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#64748b" }}>
                      <span>{b.q}</span>
                      <div className="rounded-full overflow-hidden" style={{ height: 5, background: "rgba(0,0,0,.06)" }}>
                        <div className="fill-anim h-full rounded-full" style={{ width: `${b.w}%`, background: "linear-gradient(90deg,#5b8def,#3ce8ff)" }} />
                      </div>
                      <span style={{ color: "#0f172a" }}>{b.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-3" style={{ borderTop: "1px solid rgba(0,0,0,.07)", background: "rgba(255,255,255,.015)" }}>
                <span className="flex items-center gap-2"><Dot color="#3ddc97" /><MonoLabel>AI confidence · HIGH</MonoLabel></span>
                <span className="flex items-center gap-2"><Dot color="#f5a524" /><MonoLabel color="#f5a524">Human review required</MonoLabel></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6" style={{ borderTop: "1px solid rgba(0,0,0,.07)", borderBottom: "1px solid rgba(0,0,0,.07)" }}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <MonoLabel>Built for Title VII, EEOC, EU AI Act, NYC LL 144, GDPR.</MonoLabel>
            <div className="flex flex-wrap gap-8 opacity-80">
              {["Title VII","EEOC","EU AI Act","NYC LL 144","GDPR","SOC 2"].map(m=>(
                <span key={m} className="flex items-center gap-2" style={{ fontFamily: "Instrument Serif,serif", fontSize: 18, color: "#475569" }}>
                  <span className="inline-block rounded-full w-1.5 h-1.5" style={{ background: "#475569" }} />{m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
