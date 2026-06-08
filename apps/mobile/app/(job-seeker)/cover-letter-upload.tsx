import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { uploadApi } from "@/lib/api";

export default function CoverLetterUploadScreen() {
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
      form.append("type", "cover-letter");
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
      <Header title="Cover Letter" subtitle="Optional · PDF or DOCX" showBack />

      <View className="gap-6 mt-4">
        <Card className="flex-row gap-3 items-start">
          <Ionicons name="information-circle" size={20} color="#5b8def" style={{ marginTop: 1 }} />
          <Text className="text-subtle text-sm flex-1 leading-relaxed">
            Your cover letter will have all personal identifiers removed before employers see it, just like your resume.
          </Text>
        </Card>

        <Button onPress={pickDocument} variant="secondary" fullWidth size="lg">
          {file ? `📄  ${file.name}` : "Select cover letter (PDF / DOCX)"}
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
              <Text className="text-green-300 font-medium">Cover letter uploaded</Text>
            </Card>
            <Button onPress={() => router.replace("/(job-seeker)/dashboard")} fullWidth>
              Go to dashboard →
            </Button>
          </View>
        )}

        <Button onPress={() => router.replace("/(job-seeker)/dashboard")} variant="ghost" fullWidth>
          Skip
        </Button>
      </View>
    </Screen>
  );
}
