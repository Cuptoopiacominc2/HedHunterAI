import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { api } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";

export default function AnonymizationReviewScreen() {
  const [items, setItems]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin?resource=anonymization")
      .then(r => setItems(r.data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function approve(resumeId: string) {
    try {
      await api.patch("/api/anonymize", { resumeId, action: "approve" });
      setItems(is => is.filter(i => i.resumeId !== resumeId));
    } catch { Alert.alert("Error", "Could not approve."); }
  }

  async function flag(resumeId: string) {
    try {
      await api.patch("/api/anonymize", { resumeId, action: "flag" });
      setItems(is => is.filter(i => i.resumeId !== resumeId));
    } catch { Alert.alert("Error", "Could not flag."); }
  }

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Anonymization Review" subtitle="Low-confidence documents" showBack />
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
          ListEmptyComponent={
            <View className="items-center py-16 gap-3">
              <Ionicons name="shield-checkmark" size={40} color="#4ade80" />
              <Text className="text-muted">No items pending review</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card className="gap-3">
              <View className="flex-row items-center justify-between">
                <MonoText>Resume · {formatDate(item.createdAt)}</MonoText>
                <View style={{ backgroundColor: item.confidenceScore >= 0.8 ? "#4ade8022" : "#fbbf2422", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 11, color: item.confidenceScore >= 0.8 ? "#4ade80" : "#fbbf24", fontFamily: "monospace" }}>
                    {Math.round(item.confidenceScore * 100)}% conf
                  </Text>
                </View>
              </View>

              {item.flaggedItems?.length > 0 && (
                <View className="gap-1.5">
                  <MonoText>Flagged items</MonoText>
                  {item.flaggedItems.slice(0, 3).map((fi: any, j: number) => (
                    <View key={j} className="flex-row gap-2 items-start">
                      <Ionicons name="alert-circle" size={13} color="#fbbf24" style={{ marginTop: 1 }} />
                      <Text className="text-yellow-300 text-xs flex-1">
                        "{fi.original}" — {fi.reason}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View className="flex-row gap-2">
                <Pressable onPress={() => approve(item.resumeId)} className="flex-1 bg-green-500/15 border border-green-500/30 rounded-xl py-2.5 items-center active:opacity-70">
                  <Text className="text-green-300 text-sm font-medium">Approve</Text>
                </Pressable>
                <Pressable onPress={() => flag(item.resumeId)} className="flex-1 bg-red-500/15 border border-red-500/30 rounded-xl py-2.5 items-center active:opacity-70">
                  <Text className="text-red-300 text-sm font-medium">Re-flag</Text>
                </Pressable>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
