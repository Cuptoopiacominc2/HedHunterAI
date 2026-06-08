import React from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminSettingsScreen() {
  const { user, logout } = useAuth();

  return (
    <Screen>
      <Header title="Settings" showBack />

      <View className="gap-4 mt-2">
        <Card className="items-center gap-2 py-6">
          <View className="w-14 h-14 rounded-2xl bg-red-500/20 items-center justify-center">
            <Ionicons name="shield" size={26} color="#f87171" />
          </View>
          <Text className="text-text font-semibold">{user?.email}</Text>
          <MonoText style={{ color: "#f87171" }}>Administrator</MonoText>
        </Card>

        <Text className="text-subtle text-sm font-medium">Review queues</Text>
        <Card className="gap-0 p-0 overflow-hidden">
          {[
            { icon: "shield-checkmark-outline", label: "Anonymization review", href: "/(admin)/anonymization-review" },
            { icon: "flag-outline",             label: "Flagged questions",     href: "/(admin)/flagged-questions" },
            { icon: "megaphone-outline",        label: "Appeals",               href: "/(admin)/appeals" },
          ].map((item, i) => (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as never)}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-white/5"
              style={i > 0 ? { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.07)" } : {}}
            >
              <Ionicons name={item.icon as any} size={18} color="#3ce8ff" />
              <Text className="text-subtle flex-1">{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#7e8aa3" />
            </Pressable>
          ))}
        </Card>

        <Text className="text-subtle text-sm font-medium">Data</Text>
        <Card className="gap-0 p-0 overflow-hidden">
          {[
            { icon: "people-outline",  label: "Manage users",     href: "/(admin)/users" },
            { icon: "business-outline",label: "Manage companies", href: "/(admin)/companies" },
            { icon: "card-outline",    label: "Payments",         href: "/(admin)/payments" },
            { icon: "list-outline",    label: "Audit logs",       href: "/(admin)/audit-logs" },
          ].map((item, i) => (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as never)}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-white/5"
              style={i > 0 ? { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.07)" } : {}}
            >
              <Ionicons name={item.icon as any} size={18} color="#7e8aa3" />
              <Text className="text-subtle flex-1">{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#7e8aa3" />
            </Pressable>
          ))}
        </Card>

        <Card className="gap-0 p-0 overflow-hidden">
          <Pressable onPress={logout} className="flex-row items-center gap-3 px-4 py-3.5 active:bg-red-500/10">
            <Ionicons name="log-out-outline" size={18} color="#f87171" />
            <Text className="text-red-400 flex-1">Sign out</Text>
          </Pressable>
        </Card>

        <MonoText className="text-center" style={{ fontSize: 9 }}>HedHunter AI · Admin v1.0.0</MonoText>
      </View>
    </Screen>
  );
}
