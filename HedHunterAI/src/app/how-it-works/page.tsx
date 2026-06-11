import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Cpu, Eye } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "How It Works" };

const GUARDRAILS = [
  { icon: <ShieldCheck size={18}/>, title: "14 identity vectors stripped", desc: "Names, pronouns, age, race indicators, school names, addresses, ZIP codes, photos, and more are removed from every document." },
  { icon: <Cpu size={18}/>, title: "Rubric-only scoring", desc: "AI scores answers 0–5 against the company's own rubric — never based on voice, accent, grammar unrelated to the role, or demographics." },
  { icon: <Eye size={18}/>, title: "Human review required", desc: "No hire or reject decision is final without a human reviewer. Every AI action generates an immutable audit log." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff", color: "#0f172a" }}>
      <Navbar />
      <div className="relative z-10 pt-20 pb-4 text-center px-6">
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#3ce8ff" }}>Process</p>
        <h1 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 400, marginTop: 8, lineHeight: 1.05 }}>
          How it works
        </h1>
        <p className="text-base mt-4 max-w-xl mx-auto" style={{ color: "#475569", lineHeight: 1.6 }}>
          Every step is designed to evaluate what matters — skill and experience — and nothing else.
        </p>
      </div>
      <HowItWorks />
      <section id="guardrails" className="relative z-10 pb-24 px-6 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#3ce8ff", textAlign: "center", marginBottom: 8 }}>Guardrails</p>
          <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400, marginBottom: 16, textAlign: "center" }}>
            Built-in compliance guardrails
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {GUARDRAILS.map((g, i) => (
              <Card key={i} hover>
                <div className="flex items-center gap-2.5 mb-3" style={{ color: "#3ce8ff" }}>{g.icon}
                  <h3 className="font-medium text-sm" style={{ color: "#0f172a" }}>{g.title}</h3>
                </div>
                <p className="text-sm" style={{ color: "#64748b", lineHeight: 1.6 }}>{g.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
