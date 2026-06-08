import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { useAuth } from "@/contexts/AuthContext";
import { jobsApi, applicationsApi } from "@/lib/api";

export default function CompanyDashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, candidates: 0, shortlisted: 0, hired: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([jobsApi.list(), applicationsApi.list()])
      .then(([jobsRes, appsRes]) => {
        const jobs = jobsRes.data.jobs ?? [];
        const apps = appsRes.data.applications ?? [];
        setStats({
          jobs:        jobs.length,
          candidates:  apps.length,
          shortlisted: apps.filter((a: any) => a.status === "SHORTLISTED").length,
          hired:       apps.filter((a: any) => a.status === "HIRED").length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <MonoText style={{ color: "#5b8def" }}>Company</MonoText>
          <Text className="text-text text-2xl font-semibold mt-1">Dashboard</Text>
        </View>
        <Pressable onPress={logout} className="p-2 active:opacity-60">
          <Ionicons name="log-out-outline" size={22} color="#7e8aa3" />
        </Pressable>
      </View>

      {loading ? <ActivityIndicator color="#3ce8ff" /> : (
        <View className="flex-row flex-wrap gap-3 mb-6">
          {[
            { label: "Jobs",        value: stats.jobs,        color: "#5b8def" },
            { label: "Candidates",  value: stats.candidates,  color: "#3ce8ff" },
            { label: "Shortlisted", value: stats.shortlisted, color: "#f5a524" },
            { label: "Hired",       value: stats.hired,       color: "#4ade80" },
          ].map(s => (
            <Card key={s.label} className="flex-1 min-w-[44%] items-center py-4 px-0">
              <Text style={{ fontSize: 28, fontWeight: "700", color: s.color }}>{s.value}</Text>
              <MonoText style={{ marginTop: 3 }}>{s.label}</MonoText>
            </Card>
          ))}
        </View>
      )}

      {/* Quick actions */}
      <Text className="text-subtle text-sm font-medium mb-3">Quick actions</Text>
      <View className="gap-3 mb-6">
        {[
          { icon: "add-circle-outline", label: "Post a new job",        href: "/(company)/jobs/create" },
          { icon: "people-outline",     label: "View all candidates",    href: "/(company)/jobs" },
          { icon: "business-outline",   label: "Update company profile", href: "/(company)/profile" },
        ].map(a => (
          <Pressable
            key={a.href}
            onPress={() => router.push(a.href as never)}
            className="flex-row items-center gap-4 bg-surface border border-border rounded-2xl px-4 py-3.5 active:opacity-70"
          >
            <Ionicons name={a.icon as any} size={22} color="#3ce8ff" />
            <Text className="text-subtle font-medium">{a.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#7e8aa3" style={{ marginLeft: "auto" }} />
          </Pressable>
        ))}
      </View>

      {/* Merit pledge reminder */}
      <Card className="flex-row gap-3 items-start bg-green-500/10 border-green-500/30">
        <Ionicons name="ribbon" size={20} color="#4ade80" style={{ marginTop: 1 }} />
        <View className="flex-1">
          <Text className="text-green-300 font-medium text-sm">Merit Pledge active</Text>
          <Text className="text-green-200/60 text-xs mt-0.5">
            You're committed to evaluating candidates solely on merit. All hires require human review.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}
