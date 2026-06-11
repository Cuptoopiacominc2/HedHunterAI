import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { adminApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";

export default function AdminJobSeekersScreen() {
  const [seekers,  setSeekers] = useState<any[]>([]);
  const [search,   setSearch]  = useState("");
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    adminApi.getJobSeekers()
      .then(r => setSeekers(r.data.seekers ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = seekers.filter(s =>
    !search || s.applicantCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Job Seekers" subtitle={`${seekers.length} registered`} />
        <View className="flex-row items-center gap-2 bg-surface border border-border rounded-xl px-3 mb-4">
          <Ionicons name="search" size={16} color="#7e8aa3" />
          <TextInput
            className="flex-1 py-3 text-text text-sm"
            placeholder="Search by code…"
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
          keyExtractor={s => s.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 10 }}
          ListEmptyComponent={<View className="items-center py-12"><Text className="text-muted">No job seekers found</Text></View>}
          renderItem={({ item: s }) => (
            <Card className="gap-2">
              <View className="flex-row items-center justify-between">
                <MonoText style={{ color: "#3ce8ff" }}>{s.applicantCode ?? "—"}</MonoText>
                <View
                  className="rounded-full px-2.5 py-0.5 border"
                  style={s.registrationPaid
                    ? { backgroundColor: "#4ade8018", borderColor: "#4ade8044" }
                    : { backgroundColor: "#fbbf2418", borderColor: "#fbbf2444" }
                  }
                >
                  <Text style={{ fontSize: 10, fontWeight: "600", color: s.registrationPaid ? "#4ade80" : "#fbbf24" }}>
                    {s.registrationPaid ? "PAID" : "UNPAID"}
                  </Text>
                </View>
              </View>
              <Text className="text-muted text-xs">{formatDate(s.createdAt)}</Text>
              {s.skills && s.skills.length > 0 && (
                <View className="flex-row flex-wrap gap-1.5 mt-1">
                  {s.skills.slice(0, 4).map((skill: string) => (
                    <View key={skill} className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                      <Text className="text-muted text-xs">{skill}</Text>
                    </View>
                  ))}
                  {s.skills.length > 4 && (
                    <Text className="text-muted text-xs self-center">+{s.skills.length - 4}</Text>
                  )}
                </View>
              )}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
