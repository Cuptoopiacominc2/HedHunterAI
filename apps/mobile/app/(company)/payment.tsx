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

export default function CompanyPaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await stripeApi.checkout({ type: "COMPANY_ANNUAL" });
      const { clientSecret } = res.data;
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "HedHunter AI",
        style: "alwaysDark",
      });
      if (initError) throw new Error(initError.message);
      const { error: payError } = await presentPaymentSheet();
      if (payError) throw new Error(payError.message);
      router.replace("/(company)/dashboard");
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
          <MonoText style={{ color: "#5b8def" }}>Company plan</MonoText>
          <Text style={{ fontFamily: "serif", fontSize: 32, color: "#f3eee4", textAlign: "center" }}>Activate hiring</Text>
          <Text className="text-muted text-sm text-center">Post jobs and access merit-scored anonymous candidates.</Text>
        </View>

        <Card className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-text font-semibold text-lg">Company Annual</Text>
            <Text style={{ fontFamily: "serif", fontSize: 28, color: "#5b8def" }}>$100</Text>
          </View>
          <View className="h-px bg-border" />
          {[
            "Unlimited job postings",
            "View anonymized + AI-scored candidates",
            "Set custom interview rubrics per job",
            "Candidate ranking by merit score",
            "Human review on all hires",
            "Compliance with EEOC, Title VII & EU AI Act",
          ].map(f => (
            <View key={f} className="flex-row gap-2 items-start">
              <Ionicons name="checkmark-circle" size={16} color="#4ade80" style={{ marginTop: 2 }} />
              <Text className="text-subtle text-sm flex-1">{f}</Text>
            </View>
          ))}
        </Card>

        <Button onPress={handlePay} loading={loading} fullWidth size="lg">Pay $100 / year</Button>
        <Text className="text-muted text-xs text-center">Secured by Stripe. Account activation requires admin approval.</Text>
      </View>
    </Screen>
  );
}
