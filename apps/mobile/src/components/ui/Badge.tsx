import React from "react";
import { Text, View } from "react-native";
import { cn } from "@/lib/cn";
import type { ApplicationStatus } from "@hedhunter/shared";

type Tone = "blue" | "green" | "yellow" | "red" | "gray" | "cyan";

const tones: Record<Tone, string> = {
  blue:   "bg-blue-500/15 text-blue-300 border-blue-500/30",
  green:  "bg-green-500/15 text-green-300 border-green-500/30",
  yellow: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  red:    "bg-red-500/15 text-red-300 border-red-500/30",
  gray:   "bg-white/10 text-subtle border-white/10",
  cyan:   "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
};

const statusTone: Record<ApplicationStatus, Tone> = {
  DRAFT:       "gray",
  SUBMITTED:   "blue",
  REVIEWING:   "yellow",
  SHORTLISTED: "cyan",
  OFFER_SENT:  "green",
  HIRED:       "green",
  REJECTED:    "red",
  APPEALING:   "yellow",
};

interface BadgeProps {
  label: string;
  tone?: Tone;
  status?: ApplicationStatus;
}

export function Badge({ label, tone, status }: BadgeProps) {
  const t = tone ?? (status ? statusTone[status] : "gray");
  return (
    <View className={cn("flex-row self-start rounded-full border px-2.5 py-0.5", tones[t])}>
      <Text className={cn("text-xs font-medium", tones[t].split(" ").find(c => c.startsWith("text-")))}>{label}</Text>
    </View>
  );
}
