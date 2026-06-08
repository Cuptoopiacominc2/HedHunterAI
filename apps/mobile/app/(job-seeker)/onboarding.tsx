import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { MonoText } from "@/components/ui/MonoText";

const STEPS = [
  {
    icon: "🔒",
    title: "Your identity is protected",
    body: "We strip 14 identity vectors — name, photo, school, location and more — from every document before any employer sees it.",
  },
  {
    icon: "🎙️",
    title: "Record your answers",
    body: "For each job you apply to, you'll answer the company's interview questions by audio recording. Answers are transcribed and anonymized.",
  },
  {
    icon: "🤖",
    title: "AI scores you fairly",
    body: "Your answers are scored 0–5 against the company's own rubric. The score is the only thing employers see — not your voice or identity.",
  },
  {
    icon: "👤",
    title: "Humans review every hire",
    body: "No automated rejections. A human reviews every decision and your identity is only revealed after a hire offer is accepted.",
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function next() {
    if (isLast) {
      router.replace("/(job-seeker)/payment");
    } else {
      setStep(s => s + 1);
    }
  }

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-between py-8">
        <View className="items-center gap-6 flex-1 justify-center px-4">
          <Text style={{ fontSize: 64 }}>{current.icon}</Text>
          <MonoText style={{ color: "#3ce8ff" }}>Step {step + 1} of {STEPS.length}</MonoText>
          <Text style={{ fontFamily: "serif", fontSize: 28, color: "#f3eee4", textAlign: "center", lineHeight: 34 }}>
            {current.title}
          </Text>
          <Text className="text-subtle text-base text-center leading-relaxed">{current.body}</Text>
        </View>

        {/* Progress dots */}
        <View className="flex-row justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <View
              key={i}
              className="rounded-full"
              style={{ width: i === step ? 20 : 6, height: 6, backgroundColor: i === step ? "#3ce8ff" : "#1e2d45" }}
            />
          ))}
        </View>

        <View className="gap-3">
          <Button onPress={next} fullWidth size="lg">
            {isLast ? "Continue to payment →" : "Next"}
          </Button>
          {step > 0 && (
            <Button onPress={() => setStep(s => s - 1)} variant="ghost" fullWidth>
              Back
            </Button>
          )}
        </View>
      </View>
    </Screen>
  );
}
