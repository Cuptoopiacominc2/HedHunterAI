import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { api } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";
import type { CompanyRating } from "@hedhunter/shared";

export default function CompanyRatingsScreen() {
  const [ratings, setRatings] = useState<CompanyRating[]>([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/ratings")
      .then(r => {
        const list: CompanyRating[] = r.data.ratings ?? [];
        setRatings(list);
        if (list.length) setAverage(list.reduce((s, r) => s + r.rating, 0) / list.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Company Ratings" />
        {!loading && ratings.length > 0 && (
          <Card className="flex-row items-center gap-4 mb-4">
            <Text style={{ fontFamily: "monospace", fontSize: 40, color: "#f5a524", fontWeight: "800" }}>{average.toFixed(1)}</Text>
            <View>
              <View className="flex-row gap-1">
                {[1,2,3,4,5].map(s => (
                  <Ionicons key={s} name={s <= Math.round(average) ? "star" : "star-outline"} size={16} color="#f5a524" />
                ))}
              </View>
              <MonoText>{ratings.length} reviews</MonoText>
            </View>
          </Card>
        )}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      ) : (
        <FlatList
          data={ratings}
          keyExtractor={r => r.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
          ListEmptyComponent={
            <View className="items-center py-16 gap-3">
              <Ionicons name="star-outline" size={40} color="#7e8aa3" />
              <Text className="text-muted">No ratings yet</Text>
            </View>
          }
          renderItem={({ item: r }) => (
            <Card className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Ionicons key={s} name={s <= r.rating ? "star" : "star-outline"} size={14} color="#f5a524" />
                  ))}
                </View>
                <MonoText>{formatDate(r.createdAt)}</MonoText>
              </View>
              {r.review && <Text className="text-subtle text-sm leading-relaxed">{r.review}</Text>}
              <MonoText>Anonymous candidate</MonoText>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
