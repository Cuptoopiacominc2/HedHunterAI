import React, { useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { offersApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";

export default function HireScreen() {
  const { applicationId } = useLocalSearchParams<{ applicationId: string }>();
  const [salary, setSalary]     = useState("");
  const [message, setMessage]   = useState("");
  const [hireDate, setHireDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [loading, setLoading]   = useState(false);

  async function sendOffer() {
    if (!hireDate) { Alert.alert("Please set a start date"); return; }
    setLoading(true);
    try {
      await offersApi.create({
        applicationId,
        hireDate: new Date(hireDate).toISOString(),
        salary: salary ? parseInt(salary) : undefined,
        message: message.trim() || undefined,
      });
      Alert.alert("Offer sent!", "The candidate will be notified. Their identity will be revealed when they accept.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not send offer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Header title="Make an Offer" showBack />
      <View className="gap-5 mt-4">
        <Card className="flex-row gap-3 items-start bg-blue-500/10 border-blue-500/30">
          <Ionicons name="shield-checkmark" size={18} color="#93c5fd" style={{ marginTop: 1 }} />
          <Text className="text-blue-200 text-xs flex-1 leading-relaxed">
            The candidate's identity will only be revealed after they accept this offer. This is the final step in the anonymous hiring process.
          </Text>
        </Card>

        <Input
          label="Start date *"
          placeholder="YYYY-MM-DD"
          value={hireDate}
          onChangeText={setHireDate}
          hint="Format: 2026-09-01"
        />
        <Input
          label="Annual salary ($)"
          placeholder="e.g. 95000"
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
        />
        <Input
          label="Message to candidate"
          placeholder="We're excited to offer you this position…"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ minHeight: 100 }}
          value={message}
          onChangeText={setMessage}
        />

        <Button onPress={sendOffer} loading={loading} fullWidth size="lg">
          Send offer →
        </Button>
      </View>
    </Screen>
  );
}
