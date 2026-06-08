import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { applicationsApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";
import type { Application } from "@hedhunter/shared";

export default function ApplicationDetailScreen() {
  const { applicationId } = useLocalSearchParams<{ applicationId: string }>();
  const [app, setApp]     = useState<Application & { aiScores?: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsApi.get(applicationId)
      .then(r => setApp(r.data.application))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) {
    return (
      <Screen scroll={false}>
        <Header title="Application" showBack />
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      </Screen>
    );
  }

  if (!app) {
    return <Screen><Header title="Not found" showBack /><Text className="text-muted">Application not found.</Text></Screen>;
  }

  return (
    <Screen>
      <Header title="Application" subtitle={app.jobPost?.title} showBack />

      <View className="gap-4 mt-2">
        {/* Status */}
        <Card className="flex-row items-center justify-between">
          <View>
            <MonoText>Status</MonoText>
            <View className="mt-1"><Badge status={app.status} label={app.status.replace("_", " ")} /></View>
          </View>
          <View className="items-end">
            <MonoText>Applied</MonoText>
            <Text className="text-subtle text-sm mt-0.5">{formatDate(app.createdAt)}</Text>
          </View>
        </Card>

        {/* Score summary */}
        {app.totalScore != null && (
          <Card className="gap-3">
            <View className="flex-row items-center justify-between">
              <MonoText>Merit score</MonoText>
              <Text style={{ fontFamily: "monospace", fontSize: 28, color: "#3ce8ff", fontWeight: "700" }}>
                {app.totalScore.toFixed(1)}<Text style={{ fontSize: 14, color: "#7e8aa3" }}>/5</Text>
              </Text>
            </View>
            {app.aiConfidence != null && (
              <View>
                <View className="flex-row justify-between mb-1">
                  <MonoText>AI confidence</MonoText>
                  <MonoText style={{ color: "#3ce8ff" }}>{Math.round(app.aiConfidence * 100)}%</MonoText>
                </View>
                <View className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <View className="h-full rounded-full" style={{ width: `${app.aiConfidence * 100}%`, backgroundColor: "#3ce8ff" }} />
                </View>
              </View>
            )}
          </Card>
        )}

        {/* Per-question scores */}
        {app.aiScores && app.aiScores.length > 0 && (
          <Card className="gap-3">
            <MonoText>Score breakdown</MonoText>
            {app.aiScores.map((score: any, i: number) => (
              <View key={score.id} className="gap-1.5">
                <View className="flex-row justify-between">
                  <Text className="text-subtle text-xs">Q{i + 1}</Text>
                  <Text style={{ color: "#3ce8ff", fontFamily: "monospace", fontSize: 12 }}>{score.score.toFixed(1)}/5</Text>
                </View>
                <View className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <View className="h-full rounded-full" style={{ width: `${(score.score / 5) * 100}%`, backgroundColor: "#5b8def" }} />
                </View>
                {score.explanation && (
                  <Text className="text-muted text-xs leading-relaxed">{score.explanation}</Text>
                )}
              </View>
            ))}
          </Card>
        )}

        {/* Human review notice */}
        {app.requiresHumanReview && (
          <Card className="flex-row gap-3 items-start bg-yellow-500/10 border-yellow-500/30">
            <Ionicons name="eye" size={20} color="#fbbf24" style={{ marginTop: 1 }} />
            <View className="flex-1">
              <Text className="text-yellow-300 font-medium text-sm">Human review in progress</Text>
              <Text className="text-yellow-200/70 text-xs mt-0.5">
                A reviewer is examining this application. Decisions are never fully automated.
              </Text>
            </View>
          </Card>
        )}

        {/* Accommodation */}
        {app.accommodationRequested && (
          <Card className="flex-row gap-3 items-center bg-blue-500/10 border-blue-500/30">
            <Ionicons name="accessibility" size={18} color="#93c5fd" />
            <Text className="text-blue-300 text-sm">Accommodation requested: {app.accommodationType}</Text>
          </Card>
        )}

        <MonoText className="text-center">{app.anonymousCode}</MonoText>
      </View>
    </Screen>
  );
}
