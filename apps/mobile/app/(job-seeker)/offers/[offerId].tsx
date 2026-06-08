import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { api, offersApi } from "@/lib/api";
import { formatDate } from "@hedhunter/shared";
import type { Offer } from "@hedhunter/shared";

export default function OfferDetailScreen() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const [offer, setOffer]   = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    // Fetch individual offer — the list endpoint filters by user, so we reuse list and find
    offersApi.list()
      .then(r => {
        const found = (r.data.offers ?? []).find((o: Offer) => o.id === offerId);
        setOffer(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [offerId]);

  async function respond(accept: boolean) {
    setResponding(true);
    try {
      await api.patch(`/api/offers/${offerId}`, { isAccepted: accept });
      setOffer(prev => prev ? { ...prev, isAccepted: accept } : prev);
      if (accept) {
        // Navigate to rate the company after accepting
        const companyId = (offer as any)?.application?.jobPost?.companyId;
        if (companyId) router.push(`/(job-seeker)/rate-company/${companyId}` as never);
        else router.replace("/(job-seeker)/offers");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not respond to offer.");
    } finally {
      setResponding(false);
    }
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <Header title="Offer" showBack />
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      </Screen>
    );
  }

  if (!offer) {
    return <Screen><Header title="Not found" showBack /><Text className="text-muted">Offer not found.</Text></Screen>;
  }

  const isPending = offer.isAccepted == null;

  return (
    <Screen>
      <Header title="Job Offer" showBack />

      <View className="gap-4 mt-2">
        <Card className="items-center gap-2 py-6">
          <Text style={{ fontSize: 48 }}>🎉</Text>
          <Text style={{ fontFamily: "serif", fontSize: 24, color: "#f3eee4", textAlign: "center" }}>
            You've received an offer!
          </Text>
          <Text className="text-muted text-sm text-center">
            {offer.application?.jobPost?.company?.name ?? "A company"} wants to hire you for{" "}
            <Text className="text-subtle">{offer.application?.jobPost?.title ?? "this position"}</Text>.
          </Text>
        </Card>

        <Card className="gap-3">
          {[
            { icon: "calendar-outline", label: "Start date", value: formatDate(offer.hireDate) },
            ...(offer.salary ? [{ icon: "cash-outline", label: "Salary", value: `$${offer.salary.toLocaleString()} / year` }] : []),
            { icon: "time-outline", label: "Offer received", value: formatDate(offer.createdAt) },
          ].map(row => (
            <View key={row.label} className="flex-row items-center gap-3">
              <Ionicons name={row.icon as any} size={18} color="#3ce8ff" />
              <View className="flex-1 flex-row justify-between">
                <MonoText>{row.label}</MonoText>
                <Text className="text-subtle text-sm">{row.value}</Text>
              </View>
            </View>
          ))}
        </Card>

        {offer.message && (
          <Card className="gap-2">
            <MonoText>Message from employer</MonoText>
            <Text className="text-subtle text-sm leading-relaxed">{offer.message}</Text>
          </Card>
        )}

        <Card className="flex-row gap-3 items-start bg-blue-500/10 border-blue-500/30">
          <Ionicons name="information-circle" size={18} color="#93c5fd" style={{ marginTop: 1 }} />
          <Text className="text-blue-200 text-xs flex-1 leading-relaxed">
            Your identity will be revealed to the employer only after you accept this offer. This is the final step in the anonymous process.
          </Text>
        </Card>

        {isPending && (
          <View className="flex-row gap-3">
            <Button onPress={() => respond(false)} variant="danger" loading={responding}>
              Decline
            </Button>
            <Button onPress={() => respond(true)} loading={responding} fullWidth>
              Accept offer →
            </Button>
          </View>
        )}

        {!isPending && (
          <Card className="items-center py-4">
            <Text style={{ color: offer.isAccepted ? "#4ade80" : "#f87171", fontWeight: "600" }}>
              {offer.isAccepted ? "✓ Offer accepted" : "✕ Offer declined"}
            </Text>
          </Card>
        )}
      </View>
    </Screen>
  );
}
