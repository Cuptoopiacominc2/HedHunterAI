import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MonoText } from "@/components/ui/MonoText";
import { useAuth } from "@/contexts/AuthContext";
import { applicationsApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";
import type { Application } from "@hedhunter/shared";

export default function JobSeekerDashboard() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsApi.list()
      .then(r => setApplications(r.data.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:       applications.length,
    active:      applications.filter(a => !["HIRED","REJECTED"].includes(a.status)).length,
    offers:      applications.filter(a => a.status === "OFFER_SENT").length,
    hired:       applications.filter(a => a.status === "HIRED").length,
  };

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <MonoText style={{ color: "#3ce8ff" }}>Job Seeker</MonoText>
          <Text className="text-text text-2xl font-semibold mt-1">Dashboard</Text>
        </View>
        <Pressable onPress={logout} className="p-2 active:opacity-60">
          <Ionicons name="log-out-outline" size={22} color="#7e8aa3" />
        </Pressable>
      </View>

      {/* Stats row */}
      <View className="flex-row gap-3 mb-6">
        {[
          { label: "Applied",  value: stats.total,  color: "#5b8def" },
          { label: "Active",   value: stats.active, color: "#3ce8ff" },
          { label: "Offers",   value: stats.offers, color: "#f5a524" },
          { label: "Hired",    value: stats.hired,  color: "#4ade80" },
        ].map(s => (
          <Card key={s.label} className="flex-1 items-center py-3 px-0">
            <Text style={{ fontSize: 24, fontWeight: "700", color: s.color }}>{s.value}</Text>
            <MonoText style={{ marginTop: 2 }}>{s.label}</MonoText>
          </Card>
        ))}
      </View>

      {/* Quick actions */}
      <Text className="text-subtle text-sm font-medium mb-3">Quick actions</Text>
      <View className="flex-row gap-3 mb-6">
        {[
          { icon: "search", label: "Browse Jobs",    href: "/(job-seeker)/jobs" },
          { icon: "document-attach", label: "Upload Resume", href: "/(job-seeker)/resume-upload" },
          { icon: "eye", label: "Anon Preview",  href: "/(job-seeker)/anonymized-preview" },
        ].map(a => (
          <Pressable
            key={a.href}
            onPress={() => router.push(a.href as never)}
            className="flex-1 bg-surface border border-border rounded-2xl items-center py-4 gap-2 active:opacity-70"
          >
            <Ionicons name={a.icon as any} size={22} color="#3ce8ff" />
            <Text className="text-subtle text-xs text-center">{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recent applications */}
      <Text className="text-subtle text-sm font-medium mb-3">Recent applications</Text>
      {loading ? (
        <ActivityIndicator color="#3ce8ff" />
      ) : applications.length === 0 ? (
        <Card className="items-center py-8 gap-2">
          <Ionicons name="briefcase-outline" size={32} color="#7e8aa3" />
          <Text className="text-muted text-sm">No applications yet</Text>
          <Pressable onPress={() => router.push("/(job-seeker)/jobs" as never)} className="mt-1">
            <Text className="text-primary text-sm">Browse open jobs →</Text>
          </Pressable>
        </Card>
      ) : (
        <View className="gap-3">
          {applications.slice(0, 4).map(app => (
            <Pressable
              key={app.id}
              onPress={() => router.push(`/(job-seeker)/applications/${app.id}` as never)}
              className="active:opacity-70"
            >
              <Card className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-text font-medium" numberOfLines={1}>
                    {app.jobPost?.title ?? "Position"}
                  </Text>
                  <Text className="text-muted text-xs mt-0.5">
                    {app.jobPost?.company?.name ?? "Company"} · {formatDate(app.createdAt)}
                  </Text>
                </View>
                <View className="ml-3 items-end gap-1">
                  <Badge status={app.status} label={app.status.replace("_", " ")} />
                  {app.totalScore != null && (
                    <MonoText style={{ color: "#3ce8ff" }}>{app.totalScore.toFixed(1)} / 5</MonoText>
                  )}
                </View>
              </Card>
            </Pressable>
          ))}
          {applications.length > 4 && (
            <Pressable onPress={() => router.push("/(job-seeker)/applications" as never)} className="items-center py-2">
              <Text className="text-primary text-sm">View all {applications.length} applications →</Text>
            </Pressable>
          )}
        </View>
      )}
    </Screen>
  );
}
