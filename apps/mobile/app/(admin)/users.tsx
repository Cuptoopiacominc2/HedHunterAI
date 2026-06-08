import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { adminApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";

export default function AdminUsersScreen() {
  const [users, setUsers]   = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(r => setUsers(r.data.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleSuspend(userId: string, suspended: boolean) {
    try {
      await adminApi.updateUser({ userId, action: suspended ? "unsuspend" : "suspend" });
      setUsers(us => us.map(u => u.id === userId ? { ...u, suspended: !suspended } : u));
    } catch {
      Alert.alert("Error", "Could not update user.");
    }
  }

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Users" subtitle={`${users.length} total`} />
        <View className="flex-row items-center gap-2 bg-surface border border-border rounded-xl px-3 mb-4">
          <Ionicons name="search" size={16} color="#7e8aa3" />
          <TextInput
            className="flex-1 py-3 text-text text-sm"
            placeholder="Search by email or role…"
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
          keyExtractor={u => u.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 10 }}
          ListEmptyComponent={<View className="items-center py-12"><Text className="text-muted">No users found</Text></View>}
          renderItem={({ item: u }) => (
            <Card className="gap-2">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-text text-sm font-medium" numberOfLines={1}>{u.email}</Text>
                  <MonoText>{formatDate(u.createdAt)}</MonoText>
                </View>
                <View className="flex-row gap-2 items-center">
                  <View className={`rounded-full px-2 py-0.5 border ${
                    u.role === "ADMIN" ? "bg-red-500/15 border-red-500/30" :
                    u.role === "COMPANY" ? "bg-blue-500/15 border-blue-500/30" :
                    "bg-white/10 border-white/15"
                  }`}>
                    <Text style={{ fontSize: 10, color: u.role === "ADMIN" ? "#f87171" : u.role === "COMPANY" ? "#93c5fd" : "#7e8aa3" }}>
                      {u.role}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => toggleSuspend(u.id, u.suspended)}
                    className="p-1.5 rounded-lg active:opacity-60"
                    style={{ backgroundColor: u.suspended ? "#4ade8022" : "#f8717122" }}
                  >
                    <Ionicons
                      name={u.suspended ? "checkmark-circle-outline" : "ban-outline"}
                      size={16}
                      color={u.suspended ? "#4ade80" : "#f87171"}
                    />
                  </Pressable>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
