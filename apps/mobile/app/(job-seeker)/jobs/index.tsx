import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { jobsApi } from "@/lib/api";
import { formatSalary } from "@hedhunter/shared";
import type { JobPost } from "@hedhunter/shared";

export default function JobsListScreen() {
  const [jobs, setJobs]       = useState<JobPost[]>([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);
  const [remote, setRemote]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => fetchJobs(), 300);
    return () => clearTimeout(t);
  }, [search, remote]);

  async function fetchJobs() {
    setLoading(true);
    try {
      const res = await jobsApi.list({ search: search || undefined, remote: remote || undefined });
      setJobs(res.data.jobs ?? []);
    } catch {}
    finally { setLoading(false); }
  }

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Open Jobs" />

        {/* Search */}
        <View className="flex-row items-center gap-2 bg-surface border border-border rounded-xl px-3 mb-3">
          <Ionicons name="search" size={18} color="#7e8aa3" />
          <TextInput
            className="flex-1 py-3 text-text text-base"
            placeholder="Search jobs…"
            placeholderTextColor="#7e8aa3"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#7e8aa3" />
            </Pressable>
          )}
        </View>

        {/* Filter chips */}
        <View className="flex-row gap-2 mb-4">
          <Pressable
            onPress={() => setRemote(r => !r)}
            className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${remote ? "bg-accent/15 border-accent/40" : "border-border bg-surface"}`}
          >
            <Ionicons name="globe-outline" size={14} color={remote ? "#3ce8ff" : "#7e8aa3"} />
            <Text style={{ color: remote ? "#3ce8ff" : "#7e8aa3", fontSize: 13 }}>Remote only</Text>
          </Pressable>
        </View>
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
            <View className="items-center py-16 gap-3">
              <Ionicons name="briefcase-outline" size={40} color="#7e8aa3" />
              <Text className="text-muted">No jobs found</Text>
            </View>
          }
          renderItem={({ item: job }) => (
            <Pressable onPress={() => router.push(`/(job-seeker)/jobs/${job.id}` as never)} className="active:opacity-70">
              <Card className="gap-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-text font-semibold text-base" numberOfLines={1}>{job.title}</Text>
                    <Text className="text-muted text-sm mt-0.5">{job.company?.name ?? "Company"}</Text>
                  </View>
                  {job.company?.averageRating > 0 && (
                    <View className="flex-row items-center gap-1 ml-3">
                      <Ionicons name="star" size={12} color="#f5a524" />
                      <Text className="text-yellow-300 text-xs">{job.company.averageRating.toFixed(1)}</Text>
                    </View>
                  )}
                </View>

                <View className="flex-row flex-wrap gap-2">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="location-outline" size={13} color="#7e8aa3" />
                    <Text className="text-muted text-xs">{job.location}</Text>
                  </View>
                  {job.isRemote && (
                    <View className="bg-cyan-500/10 border border-cyan-500/30 rounded-full px-2 py-0.5">
                      <Text className="text-cyan-300 text-xs">Remote</Text>
                    </View>
                  )}
                  {job.isHybrid && (
                    <View className="bg-blue-500/10 border border-blue-500/30 rounded-full px-2 py-0.5">
                      <Text className="text-blue-300 text-xs">Hybrid</Text>
                    </View>
                  )}
                </View>

                <View className="flex-row items-center justify-between">
                  <MonoText>{formatSalary(job.salaryMin, job.salaryMax)}</MonoText>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="people-outline" size={13} color="#7e8aa3" />
                    <MonoText>{job.openPositions} open</MonoText>
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
