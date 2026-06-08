import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { api } from "@/lib/api";
import { formatDate, formatCurrency } from "@hedhunter/shared";
import type { Payment } from "@hedhunter/shared";

const TYPE_LABEL: Record<string, string> = {
  SEEKER_ANNUAL:  "Seeker annual",
  SEEKER_OFFER:   "Seeker offer fee",
  COMPANY_ANNUAL: "Company annual",
  COMPANY_JOB_POST: "Job post fee",
};

export default function AdminPaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("/api/admin?resource=payments")
      .then(r => setPayments(r.data.payments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = payments.filter(p => p.status === "COMPLETED").reduce((s, p) => s + p.amountCents, 0);

  return (
    <Screen scroll={false} padded={false}>
      <View className="px-5 pt-4">
        <Header title="Payments" showBack />
        {!loading && (
          <Card className="mb-4">
            <MonoText>Total revenue</MonoText>
            <Text style={{ fontFamily: "monospace", fontSize: 30, color: "#4ade80", fontWeight: "800", marginTop: 4 }}>
              {formatCurrency(total)}
            </Text>
            <MonoText>{payments.filter(p => p.status === "COMPLETED").length} completed payments</MonoText>
          </Card>
        )}
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={p => p.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 8 }}
          renderItem={({ item: p }) => (
            <Card className="flex-row items-center justify-between py-3">
              <View>
                <Text className="text-subtle text-sm">{TYPE_LABEL[p.type] ?? p.type}</Text>
                <MonoText>{formatDate(p.createdAt)}</MonoText>
              </View>
              <View className="items-end gap-1">
                <Text style={{ color: p.status === "COMPLETED" ? "#4ade80" : p.status === "FAILED" ? "#f87171" : "#fbbf24", fontFamily: "monospace", fontWeight: "700" }}>
                  {formatCurrency(p.amountCents)}
                </Text>
                <MonoText style={{ fontSize: 9, color: p.status === "COMPLETED" ? "#4ade80" : p.status === "FAILED" ? "#f87171" : "#fbbf24" }}>
                  {p.status}
                </MonoText>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
