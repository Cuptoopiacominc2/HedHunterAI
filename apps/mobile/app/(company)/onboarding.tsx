import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { companyApi } from "@/lib/api";

export default function CompanyOnboardingScreen() {
  const [form, setForm] = useState({
    name: "", address: "", contactPerson: "", phone: "", website: "", industry: "",
  });
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function save() {
    if (!form.name) { Alert.alert("Company name is required"); return; }
    setLoading(true);
    try {
      await companyApi.updateProfile(form);
      router.replace("/(company)/payment");
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not save profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Header title="Company Setup" subtitle="Complete your profile" />
      <View className="gap-4 mt-4">
        <Input label="Company name *" placeholder="Acme Corp" value={form.name} onChangeText={v => update("name", v)} />
        <Input label="Industry" placeholder="e.g. Technology, Finance" value={form.industry} onChangeText={v => update("industry", v)} />
        <Input label="Contact person" placeholder="Jane Smith" value={form.contactPerson} onChangeText={v => update("contactPerson", v)} />
        <Input label="Phone" placeholder="+1 555 000 0000" keyboardType="phone-pad" value={form.phone} onChangeText={v => update("phone", v)} />
        <Input label="Website" placeholder="https://acme.com" keyboardType="url" autoCapitalize="none" value={form.website} onChangeText={v => update("website", v)} />
        <Input label="Address" placeholder="123 Main St, City, State" value={form.address} onChangeText={v => update("address", v)} />
        <Button onPress={save} loading={loading} fullWidth size="lg">Save & continue →</Button>
      </View>
    </Screen>
  );
}
