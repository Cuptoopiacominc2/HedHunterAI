import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { companyApi } from "@/lib/api";
import type { CompanyProfile } from "@hedhunter/shared";

export default function CompanyProfileScreen() {
  const [profile, setProfile] = useState<Partial<CompanyProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    companyApi.getProfile()
      .then(r => setProfile(r.data.company ?? {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function set(field: string, value: string) {
    setProfile(p => ({ ...p, [field]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      await companyApi.updateProfile(profile);
      Alert.alert("Profile saved");
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <Header title="Company Profile" />
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Company Profile" />

      {/* Status badge */}
      {profile.status && (
        <Card className="flex-row items-center gap-3 mb-2">
          <Ionicons
            name={profile.status === "APPROVED" ? "checkmark-circle" : profile.status === "SUSPENDED" ? "close-circle" : "time"}
            size={20}
            color={profile.status === "APPROVED" ? "#4ade80" : profile.status === "SUSPENDED" ? "#f87171" : "#fbbf24"}
          />
          <View>
            <Text className="text-subtle font-medium">Account status</Text>
            <MonoText style={{ color: profile.status === "APPROVED" ? "#4ade80" : profile.status === "SUSPENDED" ? "#f87171" : "#fbbf24" }}>
              {profile.status}
            </MonoText>
          </View>
        </Card>
      )}

      <View className="gap-4 mt-2">
        <Input label="Company name" value={profile.name ?? ""} onChangeText={v => set("name", v)} />
        <Input label="Industry" placeholder="Technology, Finance…" value={profile.industry ?? ""} onChangeText={v => set("industry", v)} />
        <Input label="Contact person" value={profile.contactPerson ?? ""} onChangeText={v => set("contactPerson", v)} />
        <Input label="Phone" keyboardType="phone-pad" value={profile.phone ?? ""} onChangeText={v => set("phone", v)} />
        <Input label="Website" keyboardType="url" autoCapitalize="none" value={profile.website ?? ""} onChangeText={v => set("website", v)} />
        <Input label="Address" value={profile.address ?? ""} onChangeText={v => set("address", v)} />

        {profile.averageRating != null && profile.averageRating > 0 && (
          <Card className="flex-row items-center gap-3">
            <Ionicons name="star" size={20} color="#f5a524" />
            <View>
              <MonoText>Company rating</MonoText>
              <Text className="text-yellow-300 text-lg font-bold">{profile.averageRating.toFixed(1)} / 5</Text>
            </View>
            <MonoText className="ml-auto">{profile.totalRatings} reviews</MonoText>
          </Card>
        )}

        <Button onPress={save} loading={saving} fullWidth size="lg">Save profile</Button>
      </View>
    </Screen>
  );
}
