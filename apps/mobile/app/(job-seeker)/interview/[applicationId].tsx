import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MonoText } from "@/components/ui/MonoText";
import { InterviewRecorder } from "@/components/job-seeker/InterviewRecorder";
import { applicationsApi, transcribeApi, scoreApi } from "@/lib/api";
import type { InterviewQuestion } from "@hedhunter/shared";

type Phase = "loading" | "intro" | "recording" | "done" | "error";

export default function InterviewScreen() {
  const { applicationId } = useLocalSearchParams<{ applicationId: string }>();
  const [questions, setQuestions]     = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [recordedUris, setRecordedUris] = useState<Record<string, string>>({});
  const [phase, setPhase]             = useState<Phase>("loading");
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    applicationsApi.getQuestions(applicationId)
      .then(r => {
        setQuestions(r.data.questions ?? []);
        setPhase("intro");
      })
      .catch(() => setPhase("error"));
  }, [applicationId]);

  async function handleAnswerRecorded(audioUri: string) {
    const question = questions[currentIdx];
    setRecordedUris(prev => ({ ...prev, [question.id]: audioUri }));

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      await submitAllAnswers({ ...recordedUris, [question.id]: audioUri });
    }
  }

  async function submitAllAnswers(uris: Record<string, string>) {
    setSubmitting(true);
    try {
      // Transcribe each answer
      for (const [questionId, audioUri] of Object.entries(uris)) {
        const form = new FormData();
        form.append("audio", { uri: audioUri, name: "answer.m4a", type: "audio/m4a" } as any);
        form.append("applicationId", applicationId);
        form.append("questionId", questionId);
        await transcribeApi.transcribe(form);
      }
      // Trigger AI scoring
      await scoreApi.score({ applicationId });
      setPhase("done");
    } catch (e: any) {
      Alert.alert("Submission failed", e?.response?.data?.error ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "loading") {
    return (
      <Screen scroll={false}>
        <Header title="Interview" showBack />
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color="#3ce8ff" size="large" />
          <Text className="text-muted text-sm">Loading questions…</Text>
        </View>
      </Screen>
    );
  }

  if (phase === "error") {
    return (
      <Screen>
        <Header title="Interview" showBack />
        <Text className="text-muted">Could not load interview questions.</Text>
      </Screen>
    );
  }

  if (phase === "done") {
    return (
      <Screen scroll={false}>
        <View className="flex-1 items-center justify-center gap-6 px-4">
          <Text style={{ fontSize: 56 }}>🎉</Text>
          <MonoText style={{ color: "#3ce8ff" }}>Interview complete</MonoText>
          <Text style={{ fontFamily: "serif", fontSize: 26, color: "#f3eee4", textAlign: "center" }}>
            Your answers are being scored
          </Text>
          <Text className="text-muted text-sm text-center leading-relaxed">
            AI is scoring your answers against the company rubric. A human will review the result before any decision is made. You'll be notified when there's an update.
          </Text>
          <Button onPress={() => router.replace("/(job-seeker)/applications")} fullWidth size="lg">
            View my applications →
          </Button>
        </View>
      </Screen>
    );
  }

  if (phase === "intro") {
    return (
      <Screen scroll={false}>
        <Header title="Interview" showBack />
        <View className="flex-1 justify-center gap-6">
          <Card className="gap-4">
            <MonoText style={{ color: "#3ce8ff" }}>{questions.length} questions</MonoText>
            <Text style={{ fontFamily: "serif", fontSize: 22, color: "#f3eee4" }}>Before you start</Text>
            {[
              "Find a quiet place with a stable internet connection",
              "Each question has a time limit — start when you're ready",
              "Your answers are transcribed and anonymized before scoring",
              "You may re-record an answer before submitting it",
            ].map(tip => (
              <View key={tip} className="flex-row gap-2 items-start">
                <Text className="text-accent">•</Text>
                <Text className="text-subtle text-sm flex-1">{tip}</Text>
              </View>
            ))}
          </Card>
          <Button onPress={() => setPhase("recording")} fullWidth size="lg">
            Start interview →
          </Button>
        </View>
      </Screen>
    );
  }

  const question = questions[currentIdx];
  return (
    <Screen scroll={false}>
      <Header title="Interview" subtitle={`Question ${currentIdx + 1} of ${questions.length}`} showBack />
      {submitting ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color="#3ce8ff" size="large" />
          <Text className="text-muted text-sm">Uploading and scoring your answers…</Text>
        </View>
      ) : (
        <View className="flex-1 justify-center">
          <InterviewRecorder
            questionText={question.questionText}
            questionNumber={currentIdx + 1}
            totalQuestions={questions.length}
            timeLimitSec={question.timeLimitSec}
            onAnswerRecorded={handleAnswerRecorded}
          />
        </View>
      )}
    </Screen>
  );
}
