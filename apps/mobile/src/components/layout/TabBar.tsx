import React from "react";
import { Pressable, Text, View } from "react-native";
import { usePathname, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type Icon = ComponentProps<typeof Ionicons>["name"];

interface Tab { label: string; icon: Icon; activeIcon: Icon; href: string; }

interface TabBarProps { tabs: Tab[]; }

export function TabBar({ tabs }: TabBarProps) {
  const pathname = usePathname();
  return (
    <View className="flex-row border-t border-border bg-surface px-2 pb-2 pt-1">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Pressable
            key={tab.href}
            onPress={() => router.replace(tab.href as never)}
            className="flex-1 items-center py-1.5 active:opacity-70"
          >
            <Ionicons name={active ? tab.activeIcon : tab.icon} size={22} color={active ? "#3ce8ff" : "#7e8aa3"} />
            <Text style={{ fontSize: 10, marginTop: 2, color: active ? "#3ce8ff" : "#7e8aa3", fontWeight: active ? "600" : "400" }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
