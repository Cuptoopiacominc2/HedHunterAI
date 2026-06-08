import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { uploadApi } from "@/lib/api";

export default function ResumeUploadScreen() {
  const [file, setFile]       = useState<{ name: string; uri: string; mimeType?: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone]       = useState(false);

  async function pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      setFile(result.assets[0]);
      setDone(false);
    }
  }

  async function upload() {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", { uri: file.uri, name: file.name, type: file.mimeType ?? "application/octet-stream" } as any);
      form.append("type", "resume");
      await uploadApi.upload(form);
      setDone(true);
    } catch (e: any) {
      Alert.alert("Upload failed", e?.response?.data?.error ?? "Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Screen>
      <Header title="Upload Resume" subtitle="PDF or DOCX · max 10 MB" showBack />

      <View className="gap-6 mt-4">
        <Card className="gap-3">
          <MonoText>What happens to your resume</MonoText>
          {[
            { icon: "shield-checkmark", text: "Name, photo, email and address are stripped" },
            { icon: "school",           text: "University names are generalised" },
            { icon: "location",         text: "Location is replaced with region only" },
            { icon: "eye-off",          text: "Employer sees only skills and experience" },
          ].map(i => (
            <View key={i.text} className="flex-row gap-3 items-center">
              <Ionicons name={i.icon as any} size={18} color="#3ce8ff" />
              <Text className="text-subtle text-sm flex-1">{i.text}</Text>
            </View>
          ))}
        </Card>

        {/* Drop zone */}
        <Button onPress={pickDocument} variant="secondary" fullWidth size="lg">
          {file ? `📄  ${file.name}` : "Select resume (PDF / DOCX)"}
        </Button>

        {file && !done && (
          <Button onPress={upload} loading={uploading} fullWidth size="lg">
            Upload & anonymize
          </Button>
        )}

        {done && (
          <View className="gap-4">
            <Card className="flex-row gap-3 items-center bg-green-500/10 border-green-500/30">
              <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
              <View className="flex-1">
                <Text className="text-green-300 font-medium">Resume uploaded</Text>
                <Text className="text-muted text-xs mt-0.5">AI anonymization is running in the background.</Text>
              </View>
            </Card>
            <Button onPress={() => router.push("/(job-seeker)/cover-letter-upload" as never)} fullWidth>
              Add cover letter →
            </Button>
            <Button onPress={() => router.replace("/(job-seeker)/dashboard")} variant="ghost" fullWidth>
              Skip for now
            </Button>
          </View>
        )}
      </View>
    </Screen>
  );
}
