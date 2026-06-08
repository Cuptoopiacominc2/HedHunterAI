import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { offersApi } from "@/lib/api";
import { formatDate, formatSalary } from "@hedhunter/shared";
import type { Offer } from "@hedhunter/shared";

export default function OffersScreen() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    offersApi.list()
      .then(r => setOffers(r.data.offers ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Offers" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3ce8ff" size="large" />
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={o => o.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-16 gap-3">
              <Ionicons name="gift-outline" size={40} color="#7e8aa3" />
              <Text className="text-muted">No offers yet</Text>
              <Text className="text-muted text-xs">Offers appear here after an employer wants to hire you.</Text>
            </View>
          }
          renderItem={({ item: offer }) => {
            const accepted = offer.isAccepted === true;
            const declined = offer.isAccepted === false;
            return (
              <Pressable onPress={() => router.push(`/(job-seeker)/offers/${offer.id}` as never)} className="active:opacity-70">
                <Card className="gap-3">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-text font-semibold" numberOfLines={1}>
                        {offer.application?.jobPost?.title ?? "Position"}
                      </Text>
                      <Text className="text-muted text-sm mt-0.5">
                        {offer.application?.jobPost?.company?.name ?? "Company"}
                      </Text>
                    </View>
                    <View className={`rounded-full px-2.5 py-0.5 border ${accepted ? "bg-green-500/15 border-green-500/30" : declined ? "bg-red-500/15 border-red-500/30" : "bg-yellow-500/15 border-yellow-500/30"}`}>
                      <Text style={{ fontSize: 11, color: accepted ? "#4ade80" : declined ? "#f87171" : "#fbbf24", fontWeight: "600" }}>
                        {accepted ? "Accepted" : declined ? "Declined" : "Pending"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <MonoText>Start {formatDate(offer.hireDate)}</MonoText>
                    {offer.salary && <MonoText style={{ color: "#3ce8ff" }}>{formatSalary(offer.salary * 100, null)}/yr</MonoText>}
                  </View>
                </Card>
              </Pressable>
            );
          }}
        />
      )}
    </Screen>
  );
}
