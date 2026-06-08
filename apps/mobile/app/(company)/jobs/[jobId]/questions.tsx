import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { jobsApi } from "@/lib/api";

interface Q { id?: string; questionText: string; idealAnswer: string; timeLimitSec: number; weight: number; }

export default function InterviewQuestionsScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [questions, setQuestions] = useState<Q[]>([
    { questionText: "", idealAnswer: "", timeLimitSec: 120, weight: 1 },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    jobsApi.getQuestions(jobId)
      .then(r => { if (r.data.questions?.length) setQuestions(r.data.questions); })
      .catch(() => {});
  }, [jobId]);

  function addQuestion() {
    setQuestions(qs => [...qs, { questionText: "", idealAnswer: "", timeLimitSec: 120, weight: 1 }]);
  }

  function removeQuestion(i: number) {
    if (questions.length === 1) return;
    setQuestions(qs => qs.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: keyof Q, value: any) {
    setQuestions(qs => qs.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  }

  async function save() {
    if (questions.some(q => !q.questionText.trim())) {
      Alert.alert("Every question needs text.");
      return;
    }
    setSaving(true);
    try {
      await jobsApi.saveQuestions(jobId, questions.map((q, i) => ({ ...q, order: i + 1 })));
      router.replace(`/(company)/jobs/${jobId}` as never);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not save questions.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Header title="Interview Questions" subtitle={`${questions.length} question${questions.length !== 1 ? "s" : ""}`} showBack />

      <View className="gap-4 mt-2">
        <Card className="flex-row gap-3 items-start bg-primary/5 border-primary/20">
          <Ionicons name="information-circle" size={18} color="#5b8def" style={{ marginTop: 1 }} />
          <Text className="text-subtle text-xs flex-1 leading-relaxed">
            Provide ideal answers as a rubric — AI scores each candidate's answer 0–5 against it. Avoid questions about age, family, nationality or personal identity.
          </Text>
        </Card>

        {questions.map((q, i) => (
          <Card key={i} className="gap-3">
            <View className="flex-row items-center justify-between">
              <MonoText>Question {i + 1}</MonoText>
              {questions.length > 1 && (
                <Pressable onPress={() => removeQuestion(i)} className="p-1 active:opacity-60">
                  <Ionicons name="trash-outline" size={18} color="#f87171" />
                </Pressable>
              )}
            </View>
            <Input
              label="Question *"
              placeholder="e.g. Describe a time you optimized a slow database query."
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              style={{ minHeight: 70 }}
              value={q.questionText}
              onChangeText={v => update(i, "questionText", v)}
            />
            <Input
              label="Ideal answer / rubric"
              placeholder="Key points you expect in a strong answer…"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              style={{ minHeight: 70 }}
              value={q.idealAnswer}
              onChangeText={v => update(i, "idealAnswer", v)}
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  label="Time limit (sec)"
                  keyboardType="numeric"
                  value={String(q.timeLimitSec)}
                  onChangeText={v => update(i, "timeLimitSec", parseInt(v) || 120)}
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Weight (1–3)"
                  keyboardType="decimal-pad"
                  value={String(q.weight)}
                  onChangeText={v => update(i, "weight", parseFloat(v) || 1)}
                />
              </View>
            </View>
          </Card>
        ))}

        <Button onPress={addQuestion} variant="secondary" fullWidth>
          + Add another question
        </Button>
        <Button onPress={save} loading={saving} fullWidth size="lg">
          Save questions →
        </Button>
      </View>
    </Screen>
  );
}
