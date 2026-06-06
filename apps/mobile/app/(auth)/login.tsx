import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MonoText } from "@/components/ui/MonoText";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin() {
    if (!email || !password) { Alert.alert("Enter email and password"); return; }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (e: any) {
      Alert.alert("Login failed", e?.response?.data?.error ?? "Check credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 justify-center gap-8">
        {/* Brand */}
        <View className="items-center gap-2">
          <MonoText style={{ fontSize: 11, color: "#3ce8ff", letterSpacing: 3 }}>HED HUNTER AI</MonoText>
          <Text style={{ fontFamily: "serif", fontSize: 34, color: "#f3eee4", letterSpacing: -0.5 }}>Sign in</Text>
          <Text className="text-muted text-sm text-center">Merit-based · Anonymous · Human-reviewed</Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="current-password"
            value={password}
            onChangeText={setPassword}
          />
          <Button onPress={handleLogin} loading={loading} fullWidth size="lg">
            Sign in
          </Button>
        </View>

        {/* Divider */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 h-px bg-border" />
          <MonoText>No account?</MonoText>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Signup links */}
        <View className="gap-3">
          <Link href="/(auth)/signup-seeker" asChild>
            <Pressable className="border border-border rounded-xl px-5 py-3 items-center active:bg-white/5">
              <Text className="text-subtle font-medium">Apply as Job Seeker →</Text>
              <MonoText style={{ marginTop: 2 }}>$10 / year · anonymous scoring</MonoText>
            </Pressable>
          </Link>
          <Link href="/(auth)/signup-company" asChild>
            <Pressable className="border border-border rounded-xl px-5 py-3 items-center active:bg-white/5">
              <Text className="text-subtle font-medium">Hire on Merit (Company) →</Text>
              <MonoText style={{ marginTop: 2 }}>$100 / year · merit-based candidates</MonoText>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
