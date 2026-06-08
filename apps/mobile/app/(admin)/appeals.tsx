import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { api } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";

export default function AppealsScreen() {
  const [appeals, setAppeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get("/api/admin?resource=appeals")
      .then(r => setAppeals(r.data.appeals ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function resolveAppeal(appealId: string, outcome: "APPROVED" | "DENIED") {
    try {
      await api.patch("/api/admin", { appealId, outcome, reviewerNotes: noteMap[appealId] });
      setAppeals(as => as.map(a => a.id === appealId ? { ...a, status: outcome } : a));
    } catch { Alert.alert("Error", "Could not resolve appeal."); }
  }

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Appeals" subtitle="Candidate challenges" showBack />
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      ) : (
        <FlatList
          data={appeals}
          keyExtractor={a => a.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
          ListEmptyComponent={
            <View className="items-center py-16 gap-3">
              <Ionicons name="checkmark-circle" size={40} color="#4ade80" />
              <Text className="text-muted">No open appeals</Text>
            </View>
          }
          renderItem={({ item: a }) => {
            const isOpen = a.status === "OPEN";
            return (
              <Card className="gap-3" style={!isOpen ? { opacity: 0.6 } : {}}>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-text text-sm font-medium">{a.application?.anonymousCode ?? "Unknown"}</Text>
                    <MonoText>{formatDate(a.createdAt)}</MonoText>
                  </View>
                  <View className={`rounded-full px-2.5 py-0.5 border ${isOpen ? "bg-yellow-500/15 border-yellow-500/30" : a.status === "APPROVED" ? "bg-green-500/15 border-green-500/30" : "bg-red-500/15 border-red-500/30"}`}>
                    <Text style={{ fontSize: 10, color: isOpen ? "#fbbf24" : a.status === "APPROVED" ? "#4ade80" : "#f87171", fontWeight: "600" }}>{a.status}</Text>
                  </View>
                </View>
                <Text className="text-subtle text-sm leading-relaxed">{a.reason}</Text>
                {isOpen && (
                  <View className="gap-2">
                    <TextInput
                      className="bg-bg border border-border rounded-xl px-3 py-2 text-text text-sm"
                      placeholder="Reviewer notes (optional)…"
                      placeholderTextColor="#7e8aa3"
                      value={noteMap[a.id] ?? ""}
                      onChangeText={v => setNoteMap(m => ({ ...m, [a.id]: v }))}
                    />
                    <View className="flex-row gap-2">
                      <Pressable onPress={() => resolveAppeal(a.id, "APPROVED")} className="flex-1 bg-green-500/15 border border-green-500/30 rounded-xl py-2.5 items-center active:opacity-70">
                        <Text className="text-green-300 text-sm font-medium">Approve</Text>
                      </Pressable>
                      <Pressable onPress={() => resolveAppeal(a.id, "DENIED")} className="flex-1 bg-red-500/15 border border-red-500/30 rounded-xl py-2.5 items-center active:opacity-70">
                        <Text className="text-red-300 text-sm font-medium">Deny</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </Card>
            );
          }}
        />
      )}
    </Screen>
  );
}
