import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Switch, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { jobsApi } from "@/lib/api";
import type { JobPost } from "@hedhunter/shared";

export default function EditJobScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", requiredQualifications: "", preferredQualifications: "",
    location: "", salaryMin: "", salaryMax: "", openPositions: "1",
    isRemote: false, isHybrid: false, isOffice: false, isOnLocation: false, isActive: true,
  });

  useEffect(() => {
    jobsApi.get(jobId)
      .then(r => {
        const j: JobPost & { isOnLocation?: boolean } = r.data.job;
        setForm({
          title:                    j.title ?? "",
          description:              j.description ?? "",
          requiredQualifications:   j.requiredQualifications ?? "",
          preferredQualifications:  j.preferredQualifications ?? "",
          location:                 j.location ?? "",
          salaryMin:                j.salaryMin != null ? String(j.salaryMin) : "",
          salaryMax:                j.salaryMax != null ? String(j.salaryMax) : "",
          openPositions:            j.openPositions != null ? String(j.openPositions) : "1",
          isRemote:                 j.isRemote    ?? false,
          isHybrid:                 j.isHybrid    ?? false,
          isOffice:                 (j as any).isOffice     ?? false,
          isOnLocation:             (j as any).isOnLocation ?? false,
          isActive:                 j.isActive    ?? true,
        });
      })
      .catch(() => Alert.alert("Error", "Could not load job."))
      .finally(() => setLoading(false));
  }, [jobId]);

  function set(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function save() {
    if (!form.title || !form.description || !form.requiredQualifications || !form.location) {
      Alert.alert("Required fields missing", "Title, description, qualifications and location are required.");
      return;
    }
    setSaving(true);
    try {
      await jobsApi.update(jobId, {
        ...form,
        salaryMin:     form.salaryMin     ? parseInt(form.salaryMin)     : null,
        salaryMax:     form.salaryMax     ? parseInt(form.salaryMax)     : null,
        openPositions: parseInt(form.openPositions) || 1,
      });
      Alert.alert("Saved", "Job updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not save job.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <Header title="Edit Job" showBack />
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3ce8ff" size="large" /></View>
      </Screen>
    );
  }

  const workTypes = [
    { label: "Remote",      field: "isRemote",     value: form.isRemote },
    { label: "Hybrid",      field: "isHybrid",     value: form.isHybrid },
    { label: "Office",      field: "isOffice",     value: form.isOffice },
    { label: "On Location", field: "isOnLocation", value: form.isOnLocation },
  ];

  return (
    <Screen>
      <Header title="Edit Job" showBack />
      <View className="gap-4 mt-2">

        {/* Active toggle */}
        <Card className="flex-row items-center justify-between">
          <View>
            <Text className="text-text font-medium">Listing active</Text>
            <Text className="text-muted text-xs mt-0.5">Job seekers can find and apply for this job</Text>
          </View>
          <Switch
            value={form.isActive}
            onValueChange={v => set("isActive", v)}
            trackColor={{ false: "#1e2d45", true: "#3ce8ff44" }}
            thumbColor={form.isActive ? "#3ce8ff" : "#7e8aa3"}
          />
        </Card>

        <Input label="Job title *" value={form.title} onChangeText={v => set("title", v)} />
        <Input label="Location *" placeholder="New York, NY" value={form.location} onChangeText={v => set("location", v)} />

        {/* Work type */}
        <Card className="gap-3">
          <Text className="text-subtle text-sm font-medium">Work type</Text>
          {workTypes.map(row => (
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
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ minHeight: 100 }}
          value={form.description}
          onChangeText={v => set("description", v)}
        />
        <Input
          label="Required qualifications *"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={{ minHeight: 80 }}
          value={form.requiredQualifications}
          onChangeText={v => set("requiredQualifications", v)}
        />
        <Input
          label="Preferred qualifications"
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

        <Button onPress={save} loading={saving} fullWidth size="lg">
          Save changes →
        </Button>
      </View>
    </Screen>
  );
}
