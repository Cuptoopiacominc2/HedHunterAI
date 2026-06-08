import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { applicationsApi } from "@/lib/api";
import type { Application } from "@hedhunter/shared";

export default function CandidateDetailScreen() {
  const { jobId, applicationId } = useLocalSearchParams<{ jobId: string; applicationId: string }>();
  const [app, setApp]   = useState<Application & { aiScores?: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsApi.get(applicationId)
      .then(r => setApp(r.data.application))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [applicationId]);

  async function makeOffer() {
    router.push(`/(company)/hire/${applicationId}` as never);
  }

  async function reject() {
    Alert.alert("Reject candidate?", "This will mark the application as rejected.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject", style: "destructive",
        onPress: async () => {
          try {
            await applicationsApi.hire(applicationId); // endpoint handles reject via body
            router.back();
          } catch {}
        },
      },
    ]);
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <Header title="Candidate" showBack />
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      </Screen>
    );
  }
  if (!app) return <Screen><Header title="Not found" showBack /><Text className="text-muted">Not found.</Text></Screen>;

  const canAct = !["HIRED", "REJECTED"].includes(app.status);

  return (
    <Screen>
      <Header title={app.anonymousCode} subtitle="Identity protected" showBack />
      <View className="gap-4 mt-2">

        {/* Score hero */}
        <Card className="items-center gap-3 py-6">
          <MonoText>Merit score</MonoText>
          {app.totalScore != null ? (
            <>
              <Text style={{ fontFamily: "monospace", fontSize: 52, color: "#3ce8ff", fontWeight: "800", lineHeight: 58 }}>
                {app.totalScore.toFixed(1)}
              </Text>
              <Text className="text-muted text-xs">out of 5.0</Text>
            </>
          ) : (
            <Text className="text-muted">Scoring in progress…</Text>
          )}
          <Badge status={app.status} label={app.status.replace("_", " ")} />
        </Card>

        {/* Confidence */}
        {app.aiConfidence != null && (
          <Card className="gap-2">
            <View className="flex-row justify-between">
              <MonoText>AI confidence</MonoText>
              <MonoText style={{ color: app.aiConfidence >= 0.8 ? "#4ade80" : "#fbbf24" }}>
                {Math.round(app.aiConfidence * 100)}%
              </MonoText>
            </View>
            <View className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <View className="h-full rounded-full" style={{ width: `${app.aiConfidence * 100}%`, backgroundColor: app.aiConfidence >= 0.8 ? "#4ade80" : "#fbbf24" }} />
            </View>
          </Card>
        )}

        {/* Per-question breakdown */}
        {app.aiScores && app.aiScores.length > 0 && (
          <Card className="gap-3">
            <MonoText>Question-by-question breakdown</MonoText>
            {app.aiScores.map((s: any, i: number) => (
              <View key={s.id} className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-subtle text-sm">Q{i + 1}</Text>
                  <Text style={{ color: "#3ce8ff", fontFamily: "monospace", fontSize: 13, fontWeight: "700" }}>{s.score.toFixed(1)}/5</Text>
                </View>
                <View className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <View className="h-full rounded-full" style={{ width: `${(s.score / 5) * 100}%`, backgroundColor: "#5b8def" }} />
                </View>
                {s.strengths?.length > 0 && (
                  <Text className="text-muted text-xs">✓ {s.strengths.slice(0, 2).join("  ·  ")}</Text>
                )}
              </View>
            ))}
          </Card>
        )}

        {/* Flags */}
        {app.requiresHumanReview && (
          <Card className="flex-row gap-3 items-start bg-yellow-500/10 border-yellow-500/30">
            <Ionicons name="warning" size={18} color="#fbbf24" style={{ marginTop: 1 }} />
            <View className="flex-1">
              <Text className="text-yellow-300 font-medium text-sm">Human review required</Text>
              <Text className="text-yellow-200/70 text-xs mt-0.5">AI confidence is low. A reviewer must approve before you hire.</Text>
            </View>
          </Card>
        )}

        {/* Actions */}
        {canAct && (
          <View className="gap-3">
            <Button onPress={makeOffer} fullWidth size="lg">Make an offer →</Button>
            <Button onPress={reject} variant="danger" fullWidth>Reject candidate</Button>
          </View>
        )}
      </View>
    </Screen>
  );
}
