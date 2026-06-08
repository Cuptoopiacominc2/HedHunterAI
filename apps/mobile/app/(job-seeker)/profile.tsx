import React from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { MonoText } from "@/components/ui/MonoText";
import { useAuth } from "@/contexts/AuthContext";

export default function SeekerProfileScreen() {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: "document-attach-outline", label: "Upload / update resume",    href: "/(job-seeker)/resume-upload" },
    { icon: "mail-outline",            label: "Upload / update cover letter", href: "/(job-seeker)/cover-letter-upload" },
    { icon: "eye-outline",             label: "Preview anonymized profile", href: "/(job-seeker)/anonymized-preview" },
    { icon: "briefcase-outline",       label: "My applications",           href: "/(job-seeker)/applications" },
    { icon: "gift-outline",            label: "My offers",                 href: "/(job-seeker)/offers" },
  ];

  return (
    <Screen>
      <Header title="Profile" />

      {/* Identity card */}
      <Card className="items-center gap-3 py-6 mb-6">
        <View className="w-16 h-16 rounded-2xl bg-primary/20 items-center justify-center">
          <Ionicons name="person" size={30} color="#5b8def" />
        </View>
        <View className="items-center gap-1">
          <Text className="text-text font-semibold text-lg">{user?.email}</Text>
          <MonoText style={{ color: "#3ce8ff" }}>Identity protected · Anonymous mode</MonoText>
        </View>
      </Card>

      {/* Menu */}
      <Card className="gap-0 p-0 overflow-hidden mb-4">
        {menuItems.map((item, i) => (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href as never)}
            className="flex-row items-center gap-3 px-4 py-3.5 active:bg-white/5"
            style={i > 0 ? { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.07)" } : {}}
          >
            <Ionicons name={item.icon as any} size={20} color="#7e8aa3" />
            <Text className="text-subtle flex-1">{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#7e8aa3" />
          </Pressable>
        ))}
      </Card>

      {/* Logout */}
      <Card className="p-0 overflow-hidden">
        <Pressable onPress={logout} className="flex-row items-center gap-3 px-4 py-3.5 active:bg-red-500/10">
          <Ionicons name="log-out-outline" size={20} color="#f87171" />
          <Text className="text-red-400 flex-1">Sign out</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}
