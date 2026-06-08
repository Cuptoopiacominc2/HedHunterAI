import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MonoText } from "@/components/ui/MonoText";
import { stripeApi } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";

export default function SeekerPaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await stripeApi.checkout({ type: "SEEKER_ANNUAL" });
      const { clientSecret } = res.data;

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "HedHunter AI",
        style: "alwaysDark",
      });
      if (initError) throw new Error(initError.message);

      const { error: payError } = await presentPaymentSheet();
      if (payError) throw new Error(payError.message);

      router.replace("/(job-seeker)/resume-upload");
    } catch (e: any) {
      Alert.alert("Payment failed", e.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-center gap-8">
        <View className="items-center gap-2">
          <MonoText style={{ color: "#3ce8ff" }}>One-time setup</MonoText>
          <Text style={{ fontFamily: "serif", fontSize: 32, color: "#f3eee4", textAlign: "center" }}>
            Activate your account
          </Text>
          <Text className="text-muted text-sm text-center">
            A small annual fee keeps HedHunter AI independent and bias-free.
          </Text>
        </View>

        <Card className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-text font-semibold text-lg">Job Seeker Annual</Text>
            <Text style={{ fontFamily: "serif", fontSize: 28, color: "#3ce8ff" }}>$10</Text>
          </View>
          <View className="h-px bg-border" />
          {[
            "Unlimited job applications",
            "AI-anonymized resume & cover letter",
            "Audio interview recording + transcription",
            "AI merit scoring against company rubric",
            "Human review on every decision",
          ].map(f => (
            <View key={f} className="flex-row gap-2 items-start">
              <Ionicons name="checkmark-circle" size={16} color="#4ade80" style={{ marginTop: 2 }} />
              <Text className="text-subtle text-sm flex-1">{f}</Text>
            </View>
          ))}
        </Card>

        <Button onPress={handlePay} loading={loading} fullWidth size="lg">
          Pay $10 / year
        </Button>

        <Text className="text-muted text-xs text-center">
          Secured by Stripe. Your payment info is never stored on our servers.
        </Text>
      </View>
    </Screen>
  );
}
