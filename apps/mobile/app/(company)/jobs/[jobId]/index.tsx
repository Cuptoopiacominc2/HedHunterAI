import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { jobsApi } from "@/lib/api";
import { formatSalary } from "@hedhunter/shared";
import type { JobPost } from "@hedhunter/shared";

export default function CompanyJobDetailScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [job, setJob]     = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi.get(jobId)
      .then(r => setJob(r.data.job))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <Screen scroll={false}>
        <Header title="Job" showBack />
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      </Screen>
    );
  }
  if (!job) return <Screen><Header title="Not found" showBack /><Text className="text-muted">Job not found.</Text></Screen>;

  return (
    <Screen>
      <Header title={job.title} showBack />
      <View className="gap-4 mt-2">
        <Card className="gap-3">
          <View className="flex-row items-center gap-2 flex-wrap">
            <View className={`rounded-full px-2.5 py-0.5 border ${job.isActive ? "bg-green-500/15 border-green-500/30" : "bg-white/10 border-white/15"}`}>
              <Text style={{ fontSize: 11, color: job.isActive ? "#4ade80" : "#7e8aa3" }}>{job.isActive ? "Active" : "Closed"}</Text>
            </View>
            {job.isRemote && <MonoText style={{ color: "#3ce8ff" }}>Remote</MonoText>}
            {job.isHybrid && <MonoText style={{ color: "#5b8def" }}>Hybrid</MonoText>}
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="location-outline" size={14} color="#7e8aa3" />
              <Text className="text-muted text-sm">{job.location}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="people-outline" size={14} color="#7e8aa3" />
              <MonoText>{job.openPositions} positions</MonoText>
            </View>
          </View>
          <MonoText style={{ color: "#3ce8ff" }}>{formatSalary(job.salaryMin, job.salaryMax)}</MonoText>
        </Card>

        {/* Actions */}
        <View className="gap-3">
          <Button onPress={() => router.push(`/(company)/jobs/${jobId}/candidates` as never)} fullWidth>
            View candidates →
          </Button>
          <View className="flex-row gap-3">
            <Button onPress={() => router.push(`/(company)/jobs/${jobId}/questions` as never)} variant="secondary" fullWidth>
              Edit questions
            </Button>
            <Button onPress={() => router.push(`/(company)/jobs/${jobId}/edit` as never)} variant="secondary" fullWidth>
              Edit job
            </Button>
          </View>
        </View>

        <Card className="gap-2">
          <Text className="text-subtle font-semibold text-sm">Description</Text>
          <Text className="text-subtle text-sm leading-relaxed">{job.description}</Text>
        </Card>
        <Card className="gap-2">
          <Text className="text-subtle font-semibold text-sm">Required qualifications</Text>
          <Text className="text-subtle text-sm leading-relaxed">{job.requiredQualifications}</Text>
        </Card>
        {job.preferredQualifications && (
          <Card className="gap-2">
            <Text className="text-subtle font-semibold text-sm">Preferred qualifications</Text>
            <Text className="text-subtle text-sm leading-relaxed">{job.preferredQualifications}</Text>
          </Card>
        )}
      </View>
    </Screen>
  );
}
