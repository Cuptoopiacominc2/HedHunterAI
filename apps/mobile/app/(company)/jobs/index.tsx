import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { jobsApi } from "@/lib/api";
import type { JobPost } from "@hedhunter/shared";

export default function CompanyJobsScreen() {
  const [jobs, setJobs]   = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi.list()
      .then(r => setJobs(r.data.jobs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header
          title="Job Posts"
          right={
            <Button size="sm" onPress={() => router.push("/(company)/jobs/create" as never)}>
              + New
            </Button>
          }
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3ce8ff" size="large" />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={j => j.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-16 gap-4">
              <Ionicons name="briefcase-outline" size={40} color="#7e8aa3" />
              <Text className="text-muted">No jobs posted yet</Text>
              <Button onPress={() => router.push("/(company)/jobs/create" as never)}>Post first job</Button>
            </View>
          }
          renderItem={({ item: job }) => (
            <Pressable onPress={() => router.push(`/(company)/jobs/${job.id}` as never)} className="active:opacity-70">
              <Card className="gap-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-text font-semibold" numberOfLines={1}>{job.title}</Text>
                    <Text className="text-muted text-xs mt-0.5">{job.location}</Text>
                  </View>
                  <View className={`rounded-full px-2.5 py-0.5 border ${job.isActive ? "bg-green-500/15 border-green-500/30" : "bg-white/10 border-white/15"}`}>
                    <Text style={{ fontSize: 11, color: job.isActive ? "#4ade80" : "#7e8aa3" }}>
                      {job.isActive ? "Active" : "Closed"}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row gap-2">
                    {job.isRemote && <MonoText style={{ color: "#3ce8ff" }}>Remote</MonoText>}
                    {job.isHybrid && <MonoText style={{ color: "#5b8def" }}>Hybrid</MonoText>}
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="people-outline" size={13} color="#7e8aa3" />
                    <MonoText>{job.openPositions} positions</MonoText>
                  </View>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
