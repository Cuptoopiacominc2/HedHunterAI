import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { applicationsApi } from "@/lib/api";
import type { Application } from "@hedhunter/shared";

export default function CandidatesListScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [candidates, setCandidates] = useState<Application[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    // Fetch applications filtered by jobId
    applicationsApi.list()
      .then(r => {
        const all: Application[] = r.data.applications ?? [];
        setCandidates(all.filter(a => a.jobPostId === jobId).sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Candidates" subtitle="Ranked by merit score" showBack />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      ) : (
        <FlatList
          data={candidates}
          keyExtractor={c => c.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-16 gap-3">
              <Ionicons name="people-outline" size={40} color="#7e8aa3" />
              <Text className="text-muted">No candidates yet</Text>
            </View>
          }
          renderItem={({ item: app, index }) => (
            <Pressable onPress={() => router.push(`/(company)/jobs/${jobId}/candidates/${app.id}` as never)} className="active:opacity-70">
              <Card className="gap-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    {/* Rank badge */}
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center"
                      style={{ backgroundColor: index < 3 ? "#5b8def22" : "#ffffff0a", borderWidth: 1, borderColor: index < 3 ? "#5b8def55" : "#ffffff15" }}
                    >
                      <Text style={{ fontSize: 12, color: index < 3 ? "#5b8def" : "#7e8aa3", fontWeight: "700" }}>#{index + 1}</Text>
                    </View>
                    <View>
                      <Text className="text-text font-semibold">{app.anonymousCode}</Text>
                      <MonoText>Identity protected</MonoText>
                    </View>
                  </View>
                  <View className="items-end gap-1">
                    {app.totalScore != null ? (
                      <Text style={{ fontFamily: "monospace", fontSize: 20, color: "#3ce8ff", fontWeight: "700" }}>
                        {app.totalScore.toFixed(1)}
                      </Text>
                    ) : (
                      <MonoText>Scoring…</MonoText>
                    )}
                    <Badge status={app.status} label={app.status.replace("_", " ")} />
                  </View>
                </View>

                {app.requiresHumanReview && (
                  <View className="flex-row gap-2 items-center bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-2.5 py-1.5">
                    <Ionicons name="eye" size={13} color="#fbbf24" />
                    <Text className="text-yellow-300 text-xs">Human review flagged</Text>
                  </View>
                )}
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
