"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useInterviewRecorder } from "@/hooks/useInterviewRecorder";
import { Mic, Square, Play, Send } from "lucide-react";

interface InterviewRecorderProps {
  question: { questionText: string; timeLimitSec: number; order: number; totalQuestions: number };
  applicationId: string;
  questionId: string;
  hasAccommodation: boolean;
  onComplete: (answerId: string) => void;
}

export function InterviewRecorder({ question, applicationId, questionId, hasAccommodation, onComplete }: InterviewRecorderProps) {
  const { isRecording, audioBlob, duration, start, stop, reset } = useInterviewRecorder();
  const [timeLeft, setTimeLeft]     = useState(question.timeLimitSec);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const timedOut                    = useRef(false);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(question.timeLimitSec);
    timedOut.current = false;
  }, [question.timeLimitSec, questionId]);

  // Countdown timer — auto-stop when time expires
  useEffect(() => {
    if (!isRecording) return;
    if (hasAccommodation) return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          timedOut.current = true;
          stop();
          clearInterval(t);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isRecording, hasAccommodation, stop]);

  // Auto-submit when recording stops due to timer expiry
  useEffect(() => {
    if (timedOut.current && audioBlob && !submitting) {
      void handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  async function handleSubmit() {
    if (!audioBlob) return;
    setSubmitting(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("audio", audioBlob, "answer.webm");
      fd.append("applicationId", applicationId);
      fd.append("questionId", questionId);
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Transcription failed");
      const { answerId } = await res.json();
      onComplete(answerId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Submission failed");
      timedOut.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(0,0,0,.07)" }}>
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#64748b", marginBottom: 8 }}>
          Question {question.order} of {question.totalQuestions}
        </p>
        <p className="text-base" style={{ color: "#0f172a", lineHeight: 1.6 }}>{question.questionText}</p>
        {!hasAccommodation && (
          <p className="mt-3 text-xs font-mono" style={{ color: "#64748b" }}>Time limit: {question.timeLimitSec}s</p>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(255,94,94,.07)", border: "1px solid rgba(255,94,94,.2)" }}>
          <div className="flex gap-1 items-end">
            {[3,5,4,6,3,5,4].map((h,i) => (
              <div key={i} className="w-1 rounded-full animate-pulse" style={{ height: h*4, background: "#ff5e5e", animationDelay: `${i*0.1}s` }} />
            ))}
          </div>
          <span className="text-sm font-medium" style={{ color: "#ff5e5e" }}>Recording…</span>
          {!hasAccommodation && (
            <span className="ml-auto font-mono text-sm" style={{ color: timeLeft < 15 ? "#ff5e5e" : "#475569" }}>
              {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}
            </span>
          )}
        </div>
      )}

      {!isRecording && audioBlob && (
        <div className="p-3 rounded-xl text-sm" style={{ background: "rgba(61,220,151,.07)", border: "1px solid rgba(61,220,151,.2)", color: "#3ddc97" }}>
          {submitting ? "Submitting answer…" : `Recording complete · ${duration}s recorded`}
        </div>
      )}

      {timeLeft === 0 && !audioBlob && !isRecording && (
        <div className="p-3 rounded-xl text-sm" style={{ background: "rgba(245,165,36,.07)", border: "1px solid rgba(245,165,36,.25)", color: "#f5a524" }}>
          Time expired — no recording captured.
        </div>
      )}

      {error && <p className="text-xs font-mono" style={{ color: "#ff5e5e" }}>{error}</p>}

      <div className="flex gap-3">
        {!isRecording && !audioBlob && (
          <Button variant="danger" onClick={start} fullWidth>
            <Mic size={14}/> Start recording
          </Button>
        )}
        {isRecording && (
          <Button variant="ghost" onClick={stop} fullWidth>
            <Square size={14}/> Stop recording
          </Button>
        )}
        {!isRecording && audioBlob && !submitting && (
          <>
            <Button variant="ghost" onClick={reset}><Play size={14}/> Re-record</Button>
            <Button variant="accent" loading={submitting} onClick={handleSubmit} fullWidth>
              <Send size={14}/> Submit answer
            </Button>
          </>
        )}
      </div>

      <p className="text-xs text-center" style={{ color: "#94a3b8" }}>
        Need more time?{" "}
        <a href="#accommodation" style={{ color: "#64748b", textDecoration: "underline" }}>Request written accommodation below</a>
      </p>
    </div>
  );
}
