"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ComplianceFlagBadge } from "@/components/compliance/ComplianceFlagBadge";
import { Plus, Trash2 } from "lucide-react";

const BIAS_WORDS = ["age","born","birthday","religion","church","muslim","christian","married","single","children","pregnant","disability","national origin","nationality","race","gender","sexual"];

interface Question {
  id?: string; order: number; questionText: string;
  timeLimitSec: number; idealAnswer: string; weight: number; isFlagged?: boolean;
}

interface InterviewQuestionBuilderProps {
  jobPostId: string;
  initialQuestions?: Question[];
  autoGenerate?: boolean;
}

function detectBias(text: string): boolean {
  const lower = text.toLowerCase();
  return BIAS_WORDS.some(w => lower.includes(w));
}

export function InterviewQuestionBuilder({ jobPostId, initialQuestions = [], autoGenerate = false }: InterviewQuestionBuilderProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions.length ? initialQuestions : [{ order: 1, questionText: "", timeLimitSec: 120, idealAnswer: "", weight: 1.0 }]
  );
  const [saving,      setSaving]    = useState(false);
  const [saved,       setSaved]     = useState(false);
  const [error,       setError]     = useState<string | null>(null);
  const [generating,  setGenerating] = useState(false);

  useEffect(() => {
    if (!autoGenerate || initialQuestions.length > 0) return;
    generateQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate]);

  async function generateQuestions() {
    setGenerating(true); setError(null);
    try {
      const res = await fetch(`/api/jobs/${jobPostId}/generate-questions`, { method: "POST" });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? "Generation failed"); }
      // Reload questions from server
      const q = await fetch(`/api/jobs/${jobPostId}/questions`);
      const { questions: fresh } = await q.json();
      if (fresh?.length) setQuestions(fresh);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "AI generation failed");
    } finally {
      setGenerating(false);
    }
  }

  function update(i: number, k: keyof Question, v: unknown) {
    setQuestions(qs => qs.map((q, j) => j === i ? { ...q, [k]: v } : q));
  }

  function addQuestion() {
    if (questions.length >= 20) return;
    setQuestions(qs => [...qs, { order: qs.length + 1, questionText: "", timeLimitSec: 120, idealAnswer: "", weight: 1.0 }]);
  }

  function removeQuestion(i: number) {
    setQuestions(qs => qs.filter((_, j) => j !== i).map((q, j) => ({ ...q, order: j + 1 })));
  }

  async function handleSave() {
    if (questions.some(q => !q.questionText.trim())) {
      setError("All questions must have text before saving.");
      return;
    }
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/jobs/${jobPostId}/questions`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questions }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Save failed");
      }
      setSaved(true);
      setTimeout(() => router.push("/company/jobs"), 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (generating) {
    return (
      <div className="py-16 flex flex-col items-center gap-4" style={{ color: "#64748b" }}>
        <div className="w-8 h-8 rounded-full border-2 border-[#3ce8ff]/30 border-t-[#3ce8ff] animate-spin" />
        <p className="text-sm font-mono">Generating 20 interview questions with AI…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#64748b" }}>
          {questions.length} / 20 questions
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={generateQuestions} loading={generating}>Re-generate with AI</Button>
          {questions.length < 20 && (
            <Button variant="ghost" size="sm" onClick={addQuestion}><Plus size={13}/>Add question</Button>
          )}
        </div>
      </div>

      {questions.map((q, i) => {
        const biased = detectBias(q.questionText);
        return (
          <div key={i} className="p-4 rounded-xl space-y-3" style={{ border: `1px solid ${biased ? "rgba(255,94,94,.3)" : "rgba(0,0,0,.07)"}`, background: "rgba(0,0,0,.03)" }}>
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: "#64748b" }}>Q{q.order}</span>
              <div className="flex items-center gap-2">
                <ComplianceFlagBadge isFlagged={biased} flagReason={biased ? "Question may contain protected characteristic" : undefined} />
                {questions.length > 1 && <button onClick={() => removeQuestion(i)} className="p-1 rounded hover:bg-black/[.04]" style={{ color: "#94a3b8" }}><Trash2 size={14}/></button>}
              </div>
            </div>
            <Textarea label="Question" value={q.questionText} onChange={e => update(i, "questionText", e.target.value)} rows={2} />
            <Textarea label="Ideal answer / scoring guide (optional)" value={q.idealAnswer} onChange={e => update(i, "idealAnswer", e.target.value)} rows={2} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[10px] tracking-[.14em] uppercase mb-1.5 block" style={{ color: "#64748b" }}>Time limit</label>
                <select value={q.timeLimitSec} onChange={e => update(i, "timeLimitSec", Number(e.target.value))}
                  className="w-full bg-[#f5f7fa] border border-black/[.08] rounded-[10px] px-3 py-2.5 text-sm text-[#0f172a] outline-none">
                  {[30,60,90,120,180,300,600].map(s => <option key={s} value={s}>{s < 60 ? `${s}s` : `${s/60}min`}</option>)}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[.14em] uppercase mb-1.5 block" style={{ color: "#64748b" }}>Weight</label>
                <select value={q.weight} onChange={e => update(i, "weight", Number(e.target.value))}
                  className="w-full bg-[#f5f7fa] border border-black/[.08] rounded-[10px] px-3 py-2.5 text-sm text-[#0f172a] outline-none">
                  {[0.5,1.0,1.5,2.0,3.0].map(w => <option key={w} value={w}>{w}×</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      })}

      {error && <p className="text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}
      <Button variant="accent" loading={saving} onClick={handleSave} fullWidth>
        {saved ? "Saved ✓ — redirecting to jobs…" : "Save all questions"}
      </Button>
    </div>
  );
}
