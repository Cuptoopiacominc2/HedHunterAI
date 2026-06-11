import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { adminApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";
import type { CompanyProfile } from "@hedhunter/shared";

export default function AdminCompaniesScreen() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    adminApi.getFull()
      .then(r => setCompanies(r.data.companies ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function approve(companyId: string) {
    try {
      await adminApi.updateUser({ companyId, action: "approve" });
      setCompanies(cs => cs.map(c => c.id === companyId ? { ...c, status: "APPROVED" } : c));
    } catch { Alert.alert("Error", "Could not approve."); }
  }

  async function suspend(companyId: string) {
    try {
      await adminApi.updateUser({ companyId, action: "suspend_company" });
      setCompanies(cs => cs.map(c => c.id === companyId ? { ...c, status: "SUSPENDED" } : c));
    } catch { Alert.alert("Error", "Could not suspend."); }
  }

  const statusColor = { PENDING: "#fbbf24", APPROVED: "#4ade80", SUSPENDED: "#f87171" };

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Companies" subtitle={`${companies.length} total`} />
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      ) : (
        <FlatList
          data={companies}
          keyExtractor={c => c.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 10 }}
          ListEmptyComponent={<View className="items-center py-12"><Text className="text-muted">No companies</Text></View>}
          renderItem={({ item: c }) => (
            <Card className="gap-3">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-text font-semibold" numberOfLines={1}>{c.name}</Text>
                  <MonoText>{c.industry ?? "—"}</MonoText>
                </View>
                <View
                  className="rounded-full px-2.5 py-0.5 border ml-2"
                  style={{ borderColor: `${statusColor[c.status]}44`, backgroundColor: `${statusColor[c.status]}18` }}
                >
                  <Text style={{ fontSize: 10, color: statusColor[c.status], fontWeight: "600" }}>{c.status}</Text>
                </View>
              </View>
              <MonoText>{formatDate(c.createdAt)}</MonoText>
              {c.status === "PENDING" && (
                <View className="flex-row gap-2">
                  <Pressable onPress={() => approve(c.id)} className="flex-1 bg-green-500/15 border border-green-500/30 rounded-xl py-2.5 items-center active:opacity-70">
                    <Text className="text-green-300 text-sm font-medium">Approve</Text>
                  </Pressable>
                  <Pressable onPress={() => suspend(c.id)} className="flex-1 bg-red-500/15 border border-red-500/30 rounded-xl py-2.5 items-center active:opacity-70">
                    <Text className="text-red-300 text-sm font-medium">Reject</Text>
                  </Pressable>
                </View>
              )}
              {c.status === "APPROVED" && (
                <Pressable onPress={() => suspend(c.id)} className="bg-red-500/10 border border-red-500/25 rounded-xl py-2 items-center active:opacity-70">
                  <Text className="text-red-300 text-sm">Suspend</Text>
                </Pressable>
              )}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
