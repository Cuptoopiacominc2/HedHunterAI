import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { ratingsApi } from "@/lib/api";

export default function RateCompanyScreen() {
  const { companyId } = useLocalSearchParams<{ companyId: string }>();
  const [rating, setRating]   = useState(0);
  const [review, setReview]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  async function submit() {
    if (rating === 0) { Alert.alert("Please select a star rating"); return; }
    setLoading(true);
    try {
      await ratingsApi.rate({ companyId, rating, review: review.trim() || undefined });
      setDone(true);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not submit rating.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <Screen scroll={false}>
        <View className="flex-1 items-center justify-center gap-6">
          <Text style={{ fontSize: 56 }}>⭐</Text>
          <Text style={{ fontFamily: "serif", fontSize: 26, color: "#f3eee4", textAlign: "center" }}>Thank you for your review</Text>
          <Text className="text-muted text-sm text-center">Your rating helps other candidates make informed decisions.</Text>
          <Button onPress={() => router.replace("/(job-seeker)/dashboard")} fullWidth>Back to dashboard</Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Rate Company" showBack />
      <View className="gap-6 mt-4">
        <Text className="text-subtle text-sm leading-relaxed">
          How was your hiring experience? Your review is anonymous and helps other candidates.
        </Text>

        {/* Stars */}
        <Card className="items-center gap-3 py-6">
          <Text className="text-subtle text-sm">Tap to rate</Text>
          <View className="flex-row gap-3">
            {[1, 2, 3, 4, 5].map(star => (
              <Pressable key={star} onPress={() => setRating(star)} className="active:scale-110">
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={36}
                  color={star <= rating ? "#f5a524" : "#7e8aa3"}
                />
              </Pressable>
            ))}
          </View>
          {rating > 0 && (
            <Text className="text-subtle text-sm">
              {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
            </Text>
          )}
        </Card>

        <View className="gap-1.5">
          <Text className="text-subtle text-sm font-medium">Review (optional)</Text>
          <TextInput
            className="bg-surface border border-border rounded-xl px-4 py-3 text-text text-base"
            placeholder="Share your experience with the hiring process…"
            placeholderTextColor="#7e8aa3"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
            value={review}
            onChangeText={setReview}
          />
        </View>

        <Button onPress={submit} loading={loading} fullWidth size="lg">
          Submit rating
        </Button>
        <Button onPress={() => router.replace("/(job-seeker)/dashboard")} variant="ghost" fullWidth>
          Skip
        </Button>
      </View>
    </Screen>
  );
}
