import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MonoText } from "@/components/ui/MonoText";

interface InterviewRecorderProps {
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
  timeLimitSec: number;
  onAnswerRecorded: (audioUri: string) => void;
  onSkip?: () => void;
}

export function InterviewRecorder({
  questionText,
  questionNumber,
  totalQuestions,
  timeLimitSec,
  onAnswerRecorded,
  onSkip,
}: InterviewRecorderProps) {
  const [phase, setPhase] = useState<"idle" | "recording" | "done">("idle");
  const [timeLeft, setTimeLeft] = useState(timeLimitSec);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Audio.requestPermissionsAsync();
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    return () => { stopTimer(); };
  }, []);

  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  const startRecording = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setPhase("recording");
      setTimeLeft(timeLimitSec);

      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { stopRecording(); return 0; }
          return t - 1;
        });
      }, 1000);
    } catch {
      Alert.alert("Microphone error", "Could not access microphone. Please allow permission in Settings.");
    }
  }, [timeLimitSec]);

  const stopRecording = useCallback(async () => {
    stopTimer();
    const rec = recordingRef.current;
    if (!rec) return;
    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      recordingRef.current = null;
      if (uri) {
        setAudioUri(uri);
        setPhase("done");
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      setPhase("idle");
    }
  }, []);

  const submit = useCallback(() => {
    if (audioUri) onAnswerRecorded(audioUri);
  }, [audioUri, onAnswerRecorded]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const pct = ((timeLimitSec - timeLeft) / timeLimitSec) * 100;

  return (
    <Card className="gap-4">
      <View className="flex-row items-center justify-between">
        <MonoText>Q{questionNumber} of {totalQuestions}</MonoText>
        {phase === "recording" && (
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-red-500" />
            <MonoText style={{ color: "#ef4444" }}>REC {formatTime(timeLeft)}</MonoText>
          </View>
        )}
      </View>

      <Text className="text-text text-base leading-relaxed">{questionText}</Text>

      {phase === "recording" && (
        <View className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <View className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }} />
        </View>
      )}

      {phase === "done" && (
        <View className="flex-row items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2">
          <Ionicons name="checkmark-circle" size={18} color="#4ade80" />
          <Text className="text-green-300 text-sm">Answer recorded</Text>
        </View>
      )}

      <View className="flex-row gap-3">
        {phase === "idle" && (
          <Button onPress={startRecording} fullWidth>
            Start Recording
          </Button>
        )}
        {phase === "recording" && (
          <Button onPress={stopRecording} variant="danger" fullWidth>
            Stop Recording
          </Button>
        )}
        {phase === "done" && (
          <>
            <Button onPress={() => { setPhase("idle"); setAudioUri(null); }} variant="secondary">
              Re-record
            </Button>
            <Button onPress={submit} fullWidth>
              Submit Answer
            </Button>
          </>
        )}
      </View>

      {onSkip && phase === "idle" && (
        <Pressable onPress={onSkip} className="items-center py-1">
          <Text className="text-muted text-sm">Skip this question</Text>
        </Pressable>
      )}
    </Card>
  );
}
