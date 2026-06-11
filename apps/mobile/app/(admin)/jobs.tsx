import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { adminApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";

export default function AdminJobsScreen() {
  const [jobs,    setJobs]   = useState<any[]>([]);
  const [search,  setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getJobs()
      .then(r => setJobs(r.data.jobs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j =>
    !search ||
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="All Jobs" subtitle={`${jobs.length} total`} />
        <View className="flex-row items-center gap-2 bg-surface border border-border rounded-xl px-3 mb-4">
          <Ionicons name="search" size={16} color="#7e8aa3" />
          <TextInput
            className="flex-1 py-3 text-text text-sm"
            placeholder="Search by title or company…"
            placeholderTextColor="#7e8aa3"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={j => j.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 10 }}
          ListEmptyComponent={<View className="items-center py-12"><Text className="text-muted">No jobs found</Text></View>}
          renderItem={({ item: j }) => (
            <Card className="gap-2">
              <View className="flex-row items-start justify-between gap-2">
                <Text className="text-text font-medium flex-1" numberOfLines={2}>{j.title}</Text>
                <View
                  className="rounded-full px-2.5 py-0.5 border shrink-0"
                  style={j.isActive
                    ? { backgroundColor: "#4ade8018", borderColor: "#4ade8044" }
                    : { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }
                  }
                >
                  <Text style={{ fontSize: 10, fontWeight: "600", color: j.isActive ? "#4ade80" : "#7e8aa3" }}>
                    {j.isActive ? "ACTIVE" : "CLOSED"}
                  </Text>
                </View>
              </View>
              <MonoText>{j.companyName}</MonoText>
              <View className="flex-row items-center justify-between">
                <Text className="text-muted text-xs">{j.openPositions} position{j.openPositions !== 1 ? "s" : ""}</Text>
                <Text className="text-muted text-xs">{formatDate(j.createdAt)}</Text>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
