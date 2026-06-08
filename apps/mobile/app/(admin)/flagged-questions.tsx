import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { api } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";

export default function FlaggedQuestionsScreen() {
  const [flags, setFlags]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin?resource=flags")
      .then(r => setFlags(r.data.flags ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function resolve(flagId: string) {
    try {
      await api.patch(`/api/admin`, { flagId, action: "resolve_flag" });
      setFlags(fs => fs.map(f => f.id === flagId ? { ...f, isResolved: true } : f));
    } catch { Alert.alert("Error", "Could not resolve flag."); }
  }

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Flagged Questions" subtitle="Possible bias detected" showBack />
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      ) : (
        <FlatList
          data={flags}
          keyExtractor={f => f.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
          ListEmptyComponent={
            <View className="items-center py-16 gap-3">
              <Ionicons name="checkmark-circle" size={40} color="#4ade80" />
              <Text className="text-muted">No flagged questions</Text>
            </View>
          }
          renderItem={({ item: f }) => (
            <Card className="gap-3" style={f.isResolved ? { opacity: 0.5 } : {}}>
              <View className="flex-row items-start gap-3">
                <Ionicons name="flag" size={16} color={f.isResolved ? "#7e8aa3" : "#f87171"} style={{ marginTop: 2 }} />
                <View className="flex-1">
                  <Text className="text-text text-sm leading-relaxed">"{f.questionText}"</Text>
                  <Text className="text-red-400 text-xs mt-1">{f.flagReason}</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <MonoText>{formatDate(f.createdAt)}</MonoText>
                {!f.isResolved && (
                  <Pressable onPress={() => resolve(f.id)} className="bg-green-500/15 border border-green-500/30 rounded-lg px-3 py-1.5 active:opacity-70">
                    <Text className="text-green-300 text-xs font-medium">Mark resolved</Text>
                  </Pressable>
                )}
                {f.isResolved && <MonoText style={{ color: "#4ade80" }}>Resolved</MonoText>}
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
