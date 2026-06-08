import React, { useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { jobsApi } from "@/lib/api";

export default function CreateJobScreen() {
  const [form, setForm] = useState({
    title: "", description: "", requiredQualifications: "", preferredQualifications: "",
    location: "", salaryMin: "", salaryMax: "", openPositions: "1",
    isRemote: false, isHybrid: false,
  });
  const [loading, setLoading] = useState(false);

  function set(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function create() {
    if (!form.title || !form.description || !form.requiredQualifications || !form.location) {
      Alert.alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await jobsApi.create({
        ...form,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
        openPositions: parseInt(form.openPositions) || 1,
      });
      const jobId = res.data.job.id;
      router.replace(`/(company)/jobs/${jobId}/questions` as never);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not create job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Header title="Post a Job" showBack />
      <View className="gap-4 mt-2">
        <Input label="Job title *" placeholder="Senior Backend Engineer" value={form.title} onChangeText={v => set("title", v)} />
        <Input label="Location *" placeholder="New York, NY" value={form.location} onChangeText={v => set("location", v)} />

        {/* Work type */}
        <Card className="gap-3">
          <Text className="text-subtle text-sm font-medium">Work type</Text>
          {[
            { label: "Remote",  field: "isRemote", value: form.isRemote },
            { label: "Hybrid",  field: "isHybrid", value: form.isHybrid },
          ].map(row => (
            <View key={row.field} className="flex-row items-center justify-between">
              <Text className="text-subtle">{row.label}</Text>
              <Switch
                value={row.value}
                onValueChange={v => set(row.field, v)}
                trackColor={{ false: "#1e2d45", true: "#3ce8ff44" }}
                thumbColor={row.value ? "#3ce8ff" : "#7e8aa3"}
              />
            </View>
          ))}
        </Card>

        <Input
          label="Description *"
          placeholder="Describe the role and responsibilities…"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ minHeight: 100 }}
          value={form.description}
          onChangeText={v => set("description", v)}
        />
        <Input
          label="Required qualifications *"
          placeholder="List must-have skills and experience…"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={{ minHeight: 80 }}
          value={form.requiredQualifications}
          onChangeText={v => set("requiredQualifications", v)}
        />
        <Input
          label="Preferred qualifications"
          placeholder="Nice-to-have skills…"
          multiline
          numberOfLines={2}
          textAlignVertical="top"
          style={{ minHeight: 60 }}
          value={form.preferredQualifications}
          onChangeText={v => set("preferredQualifications", v)}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input label="Min salary ($)" placeholder="80000" keyboardType="numeric" value={form.salaryMin} onChangeText={v => set("salaryMin", v)} />
          </View>
          <View className="flex-1">
            <Input label="Max salary ($)" placeholder="120000" keyboardType="numeric" value={form.salaryMax} onChangeText={v => set("salaryMax", v)} />
          </View>
        </View>
        <Input label="Open positions" keyboardType="numeric" value={form.openPositions} onChangeText={v => set("openPositions", v)} />

        <Button onPress={create} loading={loading} fullWidth size="lg">
          Save & add interview questions →
        </Button>
      </View>
    </Screen>
  );
}
