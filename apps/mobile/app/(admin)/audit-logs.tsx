import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { api } from "@/lib/api";
import { formatDateTime } from "@hedhunter/shared";

const ACTION_COLOR: Record<string, string> = {
  RESUME_ANONYMIZED:    "#3ce8ff",
  ANSWER_SCORED:        "#5b8def",
  CANDIDATE_HIRED:      "#4ade80",
  CANDIDATE_REJECTED:   "#f87171",
  PAYMENT_CHARGED:      "#fbbf24",
  IDENTITY_UNSEALED:    "#c084fc",
  QUESTION_FLAGGED:     "#f87171",
  APPEAL_OPENED:        "#fbbf24",
  ADMIN_OVERRIDE:       "#ef4444",
};

export default function AuditLogsScreen() {
  const [logs, setLogs]     = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin?resource=audit")
      .then(r => setLogs(r.data.logs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.actorType?.toLowerCase().includes(search.toLowerCase()) ||
    l.targetId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Audit Log" subtitle="Immutable event trail" showBack />
        <View className="flex-row items-center gap-2 bg-surface border border-border rounded-xl px-3 mb-4">
          <Ionicons name="search" size={16} color="#7e8aa3" />
          <TextInput
            className="flex-1 py-3 text-text text-sm"
            placeholder="Search action, actor…"
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
          keyExtractor={l => l.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 8 }}
          ListEmptyComponent={<View className="items-center py-12"><Text className="text-muted">No logs</Text></View>}
          renderItem={({ item: l }) => (
            <Card className="gap-1.5 py-3">
              <View className="flex-row items-center justify-between">
                <View
                  className="rounded px-2 py-0.5"
                  style={{ backgroundColor: `${ACTION_COLOR[l.action] ?? "#7e8aa3"}22` }}
                >
                  <Text style={{ fontSize: 10, color: ACTION_COLOR[l.action] ?? "#7e8aa3", fontFamily: "monospace", fontWeight: "600" }}>
                    {l.action}
                  </Text>
                </View>
                <MonoText style={{ fontSize: 9 }}>{formatDateTime(l.createdAt)}</MonoText>
              </View>
              <View className="flex-row gap-3">
                <MonoText style={{ fontSize: 9 }}>Actor: {l.actorType}</MonoText>
                {l.targetId && <MonoText style={{ fontSize: 9 }}>Target: {l.targetId.slice(0, 12)}…</MonoText>}
              </View>
              <View className="flex-row gap-3">
                {l.confidence != null && (
                  <MonoText style={{ fontSize: 9, color: l.confidence >= 0.8 ? "#4ade80" : "#fbbf24" }}>
                    conf: {Math.round(l.confidence * 100)}%
                  </MonoText>
                )}
                <MonoText style={{ fontSize: 9, color: l.status === "FLAG" ? "#f87171" : "#4ade80" }}>
                  {l.status}
                </MonoText>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
