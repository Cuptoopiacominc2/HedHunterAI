import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { api } from "@/lib/api";

export default function AnonymizedPreviewScreen() {
  const [preview, setPreview] = useState<{ anonymizedText?: string; vectorsRemoved?: string[]; confidenceScore?: number } | null>(null);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    api.get("/api/anonymize?preview=true")
      .then(r => setPreview(r.data))
      .catch(() => setPreview(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen>
      <Header title="Anonymized Preview" subtitle="What employers see" showBack />

      <View className="gap-4 mt-4">
        <Card className="flex-row gap-3 items-start bg-primary/5 border-primary/20">
          <Ionicons name="shield-checkmark" size={18} color="#5b8def" style={{ marginTop: 1 }} />
          <Text className="text-subtle text-sm flex-1 leading-relaxed">
            This is how your profile appears to employers — your identity is fully removed.
          </Text>
        </Card>

        {loading ? (
          <View className="items-center py-12"><ActivityIndicator color="#3ce8ff" size="large" /></View>
        ) : !preview ? (
          <Card className="items-center py-8 gap-2">
            <Ionicons name="document-outline" size={32} color="#7e8aa3" />
            <Text className="text-muted text-sm">Upload your resume to see the anonymized preview.</Text>
          </Card>
        ) : (
          <>
            {preview.vectorsRemoved && preview.vectorsRemoved.length > 0 && (
              <Card className="gap-3">
                <MonoText>{preview.vectorsRemoved.length} identity vectors removed</MonoText>
                <View className="flex-row flex-wrap gap-2">
                  {preview.vectorsRemoved.map((v: string) => (
                    <View key={v} className="bg-red-500/10 border border-red-500/30 rounded-full px-2.5 py-0.5">
                      <Text className="text-red-300 text-xs">{v}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {preview.confidenceScore != null && (
              <Card className="gap-2">
                <View className="flex-row justify-between">
                  <MonoText>Anonymization confidence</MonoText>
                  <MonoText style={{ color: preview.confidenceScore >= 0.8 ? "#4ade80" : "#fbbf24" }}>
                    {Math.round(preview.confidenceScore * 100)}%
                  </MonoText>
                </View>
                <View className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${preview.confidenceScore * 100}%`, backgroundColor: preview.confidenceScore >= 0.8 ? "#4ade80" : "#fbbf24" }}
                  />
                </View>
                {preview.confidenceScore < 0.8 && (
                  <Text className="text-yellow-300 text-xs">
                    Confidence is below 80% — an admin will review before your profile is shared.
                  </Text>
                )}
              </Card>
            )}

            {preview.anonymizedText && (
              <Card className="gap-2">
                <MonoText>Anonymized document text</MonoText>
                <Text className="text-subtle text-sm leading-relaxed">{preview.anonymizedText}</Text>
              </Card>
            )}
          </>
        )}
      </View>
    </Screen>
  );
}
