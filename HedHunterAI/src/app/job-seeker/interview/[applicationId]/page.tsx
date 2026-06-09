"use client";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InterviewRecorder } from "@/components/job-seeker/InterviewRecorder";
import { Card } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { AccommodationRequest } from "@/components/compliance/AccommodationRequest";
import { AIConsentBanner } from "@/components/compliance/AIConsentBanner";
import { CheckCircle, ChevronLeft, ChevronRight, MicOff } from "lucide-react";

interface Question {
  id: string;
  order: number;
  questionText: string;
  timeLimitSec: number;
}

export default function InterviewPage({ params }: { params: { applicationId: string } }) {
  const [questions, setQuestions]       = useState<Question[]>([]);
  const [current, setCurrent]           = useState(0);
  const [answered, setAnswered]         = useState<string[]>([]);
  const [hasAccommodation, setAccom]    = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading]           = useState(true);
  const [scoring, setScoring]           = useState(false);
  const [micError, setMicError]         = useState<string | null>(null);
  const [micChecked, setMicChecked]     = useState(false);

  // Check microphone access on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        stream.getTracks().forEach(t => t.stop());
        setMicChecked(true);
      })
      .catch(err => {
        if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setMicError("No microphone found. This interview requires a working microphone. Please use a device with a built-in or connected microphone.");
        } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setMicError("Microphone access was denied. Please allow microphone access in your browser settings, then refresh this page.");
        } else {
          setMicError("Could not access your microphone. Please check your browser permissions and try again.");
        }
      });
  }, []);

  useEffect(() => {
    fetch(`/api/applications/${params.applicationId}/questions`)
      .then(r => r.json())
      .then(d => { setQuestions(d.questions ?? []); setLoading(false); });
  }, [params.applicationId]);

  // Auto-score when all questions answered
  useEffect(() => {
    if (questions.length > 0 && answered.length === questions.length && !scoring) {
      setScoring(true);
      fetch("/api/score-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: params.applicationId }),
      }).catch(() => {}).finally(() => setScoring(false));
    }
  }, [answered.length, questions.length, params.applicationId, scoring]);

  // Blocking: no microphone
  if (micError) return (
    <DashboardShell role="JOB_SEEKER" title="Microphone required">
      <Card glowTop className="max-w-md">
        <div className="flex items-start gap-4">
          <MicOff size={28} style={{ color: "#ff5e5e", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="font-medium mb-2" style={{ color: "#0f172a" }}>Microphone access required</p>
            <p className="text-sm mb-4" style={{ color: "#475569", lineHeight: 1.6 }}>{micError}</p>
            <p className="text-xs font-mono mb-4" style={{ color: "#64748b" }}>
              This is a live spoken interview. Text-based answers are not accepted to ensure fairness and authenticity.
            </p>
            <ButtonLink href={`/job-seeker/applications/${params.applicationId}`} variant="ghost" size="sm">← Back to application</ButtonLink>
          </div>
        </div>
      </Card>
    </DashboardShell>
  );

  if (loading || !micChecked) return (
    <DashboardShell role="JOB_SEEKER" title="Interview">
      <div className="p-8 text-center" style={{ color: "#64748b" }}>
        {loading ? "Loading questions…" : "Checking microphone…"}
      </div>
    </DashboardShell>
  );

  if (!consentGiven) return (
    <DashboardShell role="JOB_SEEKER" title="Interview consent">
      <div className="max-w-lg">
        <AIConsentBanner type="audio" onAccept={() => setConsentGiven(true)} onDecline={() => window.history.back()} />
      </div>
    </DashboardShell>
  );

  const isAllAnswered = answered.length === questions.length && questions.length > 0;

  if (isAllAnswered) return (
    <DashboardShell role="JOB_SEEKER" title="Interview complete">
      <Card glowTop className="max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle size={24} style={{ color: "#3ddc97" }}/>
          <div>
            <p className="font-medium" style={{ color: "#0f172a" }}>All questions answered</p>
            <p className="text-sm" style={{ color: "#64748b" }}>
              {scoring ? "AI is scoring your answers…" : "Your answers have been scored."}
            </p>
          </div>
        </div>
        <ButtonLink href={`/job-seeker/applications/${params.applicationId}`} variant="accent" fullWidth>
          View application status →
        </ButtonLink>
      </Card>
    </DashboardShell>
  );

  const q = questions[current];
  const isCurrentAnswered = current < answered.length;

  return (
    <DashboardShell role="JOB_SEEKER" title="Interview" subtitle={`${current + 1} of ${questions.length} questions`}>
      <div className="max-w-xl space-y-5">
        {/* Progress bar */}
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full"
              style={{ background: i < answered.length ? "#3ddc97" : i === current ? "#3ce8ff" : "rgba(0,0,0,.09)" }}/>
          ))}
        </div>

        {/* Already-answered review mode */}
        {isCurrentAnswered ? (
          <div className="p-5 rounded-xl space-y-3" style={{ background: "rgba(61,220,151,.05)", border: "1px solid rgba(61,220,151,.2)" }}>
            <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#3ddc97" }}>
              Question {q.order} — Answered ✓
            </p>
            <p className="text-base" style={{ color: "#0f172a", lineHeight: 1.6 }}>{q.questionText}</p>
            <p className="text-xs font-mono" style={{ color: "#64748b" }}>This question has been submitted and cannot be re-recorded.</p>
          </div>
        ) : (
          q && (
            <InterviewRecorder
              question={{ ...q, totalQuestions: questions.length }}
              applicationId={params.applicationId}
              questionId={q.id}
              hasAccommodation={hasAccommodation}
              onComplete={answerId => {
                setAnswered(p => [...p, answerId]);
                setCurrent(p => p + 1);
              }}
            />
          )
        )}

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrent(c => c - 1)}
            disabled={current === 0}
          >
            <ChevronLeft size={14}/> Previous
          </Button>

          <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>
            {answered.length}/{questions.length} answered
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrent(c => c + 1)}
            disabled={current >= answered.length || current >= questions.length - 1}
          >
            Next <ChevronRight size={14}/>
          </Button>
        </div>

        <div id="accommodation">
          <AccommodationRequest
            applicationId={params.applicationId}
            currentAccommodation={null}
            onSave={async (type) => setAccom(type !== "")}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
