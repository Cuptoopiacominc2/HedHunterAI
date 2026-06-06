import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { cn } from "@/lib/cn";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <View className="gap-1.5">
      {label && <Text className="text-subtle text-sm font-medium">{label}</Text>}
      <TextInput
        {...props}
        placeholderTextColor="#7e8aa3"
        className={cn(
          "rounded-xl border bg-surface px-4 py-3 text-base text-text",
          error ? "border-red-500" : "border-border",
          "focus:border-primary",
          className
        )}
      />
      {error && <Text className="text-red-400 text-xs">{error}</Text>}
      {hint && !error && <Text className="text-muted text-xs">{hint}</Text>}
    </View>
  );
}
