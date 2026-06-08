import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { applicationsApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";
import type { Application } from "@hedhunter/shared";

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsApi.list()
      .then(r => setApplications(r.data.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="My Applications" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3ce8ff" size="large" />
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={a => a.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-16 gap-3">
              <Ionicons name="document-text-outline" size={40} color="#7e8aa3" />
              <Text className="text-muted">No applications yet</Text>
              <Pressable onPress={() => router.push("/(job-seeker)/jobs" as never)}>
                <Text className="text-primary text-sm">Browse jobs →</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item: app }) => (
            <Pressable onPress={() => router.push(`/(job-seeker)/applications/${app.id}` as never)} className="active:opacity-70">
              <Card className="gap-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-text font-semibold" numberOfLines={1}>{app.jobPost?.title ?? "Position"}</Text>
                    <Text className="text-muted text-sm mt-0.5">{app.jobPost?.company?.name ?? "Company"}</Text>
                  </View>
                  <Badge status={app.status} label={app.status.replace("_", " ")} />
                </View>

                <View className="flex-row items-center justify-between">
                  <MonoText>{formatDate(app.createdAt)}</MonoText>
                  {app.totalScore != null ? (
                    <View className="flex-row items-center gap-1.5">
                      <MonoText>Merit score</MonoText>
                      <Text style={{ color: "#3ce8ff", fontFamily: "monospace", fontSize: 14, fontWeight: "700" }}>
                        {app.totalScore.toFixed(1)}/5
                      </Text>
                    </View>
                  ) : (
                    <MonoText>Pending scoring</MonoText>
                  )}
                </View>

                {app.requiresHumanReview && (
                  <View className="flex-row gap-2 items-center bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-2.5 py-1.5">
                    <Ionicons name="eye" size={14} color="#fbbf24" />
                    <Text className="text-yellow-300 text-xs">Under human review</Text>
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
