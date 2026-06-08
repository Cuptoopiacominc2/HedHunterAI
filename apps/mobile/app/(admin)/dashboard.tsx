import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/api";

interface AdminStats {
  totalUsers?: number;
  totalCompanies?: number;
  pendingCompanies?: number;
  totalApplications?: number;
  flaggedItems?: number;
  openAppeals?: number;
  totalPayments?: number;
  revenueTotal?: number;
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<AdminStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(r => setStats(r.data.stats ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Users",       value: stats.totalUsers,        color: "#5b8def", href: "/(admin)/users" },
    { label: "Companies",   value: stats.totalCompanies,    color: "#3ce8ff", href: "/(admin)/companies" },
    { label: "Pending",     value: stats.pendingCompanies,  color: "#f5a524", href: "/(admin)/companies" },
    { label: "Applications",value: stats.totalApplications, color: "#c084fc", href: "/(admin)/audit-logs" },
    { label: "Flagged",     value: stats.flaggedItems,      color: "#f87171", href: "/(admin)/flagged-questions" },
    { label: "Appeals",     value: stats.openAppeals,       color: "#fbbf24", href: "/(admin)/appeals" },
  ];

  return (
    <Screen>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <MonoText style={{ color: "#f87171" }}>Admin</MonoText>
          <Text className="text-text text-2xl font-semibold mt-1">Control Panel</Text>
        </View>
        <Pressable onPress={logout} className="p-2 active:opacity-60">
          <Ionicons name="log-out-outline" size={22} color="#7e8aa3" />
        </Pressable>
      </View>

      {loading ? <ActivityIndicator color="#3ce8ff" /> : (
        <View className="flex-row flex-wrap gap-3 mb-6">
          {statCards.map(s => (
            <Pressable key={s.label} onPress={() => router.push(s.href as never)} className="active:opacity-70" style={{ width: "30%", flexGrow: 1 }}>
              <Card className="items-center py-4 px-2">
                <Text style={{ fontSize: 24, fontWeight: "700", color: s.color }}>{s.value ?? 0}</Text>
                <MonoText style={{ marginTop: 2, textAlign: "center" }}>{s.label}</MonoText>
              </Card>
            </Pressable>
          ))}
        </View>
      )}

      <Text className="text-subtle text-sm font-medium mb-3">Admin actions</Text>
      <View className="gap-3">
        {[
          { icon: "shield-checkmark-outline", label: "Anonymization review", href: "/(admin)/anonymization-review", badge: undefined },
          { icon: "flag-outline",             label: "Flagged questions",     href: "/(admin)/flagged-questions",   badge: stats.flaggedItems },
          { icon: "megaphone-outline",        label: "Open appeals",          href: "/(admin)/appeals",             badge: stats.openAppeals },
          { icon: "card-outline",             label: "Payments",              href: "/(admin)/payments",            badge: undefined },
          { icon: "list-outline",             label: "Audit logs",            href: "/(admin)/audit-logs",          badge: undefined },
          { icon: "settings-outline",         label: "Settings",              href: "/(admin)/settings",            badge: undefined },
        ].map(a => (
          <Pressable
            key={a.href}
            onPress={() => router.push(a.href as never)}
            className="flex-row items-center gap-4 bg-surface border border-border rounded-2xl px-4 py-3.5 active:opacity-70"
          >
            <Ionicons name={a.icon as any} size={20} color="#3ce8ff" />
            <Text className="text-subtle font-medium flex-1">{a.label}</Text>
            {a.badge != null && a.badge > 0 && (
              <View className="bg-red-500 rounded-full min-w-5 h-5 items-center justify-center px-1.5">
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{a.badge}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color="#7e8aa3" />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
