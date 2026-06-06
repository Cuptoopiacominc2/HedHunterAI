import React from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function Header({ title, subtitle, showBack = false, right }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between py-3 mb-2">
      <View className="flex-row items-center gap-3 flex-1">
        {showBack && (
          <Pressable onPress={() => router.back()} className="p-1 -ml-1 active:opacity-60">
            <Ionicons name="arrow-back" size={22} color="#c7cfdf" />
          </Pressable>
        )}
        <View className="flex-1">
          <Text className="text-text font-semibold text-xl" numberOfLines={1}>{title}</Text>
          {subtitle && <Text className="text-muted text-sm" numberOfLines={1}>{subtitle}</Text>}
        </View>
      </View>
      {right && <View className="ml-3">{right}</View>}
    </View>
  );
}
