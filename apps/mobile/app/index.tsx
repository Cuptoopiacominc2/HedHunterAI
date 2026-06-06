import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function Root() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }
    if (user.role === "JOB_SEEKER") router.replace("/(job-seeker)/dashboard");
    else if (user.role === "COMPANY")   router.replace("/(company)/dashboard");
    else                                 router.replace("/(admin)/dashboard");
  }, [user, isLoading]);

  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <ActivityIndicator color="#3ce8ff" size="large" />
      <Text className="text-muted mt-3 text-sm">Loading…</Text>
    </View>
  );
}
