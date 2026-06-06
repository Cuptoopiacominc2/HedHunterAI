import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MonoText } from "@/components/ui/MonoText";

export default function SignupCompanyScreen() {
  const { register } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [pledged, setPledged]         = useState(false);
  const [loading, setLoading]         = useState(false);

  async function handleSignup() {
    if (!companyName || !email || !password) { Alert.alert("Fill in all fields"); return; }
    if (!pledged) { Alert.alert("Please sign the Merit Pledge to continue"); return; }
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), password, "COMPANY", companyName);
    } catch (e: any) {
      Alert.alert("Registration failed", e?.response?.data?.error ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 justify-center gap-8">
        <View className="gap-1">
          <MonoText style={{ color: "#3ce8ff" }}>Company · $100 / year</MonoText>
          <Text style={{ fontFamily: "serif", fontSize: 30, color: "#f3eee4" }}>Hire on merit</Text>
          <Text className="text-muted text-sm">Your account will be reviewed by an admin before activation.</Text>
        </View>

        <View className="gap-4">
          <Input label="Company name" placeholder="Acme Corp" value={companyName} onChangeText={setCompanyName} />
          <Input
            label="Admin email"
            placeholder="hiring@yourcompany.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="Min 8 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Merit Pledge */}
          <Pressable
            onPress={() => setPledged(!pledged)}
            className="flex-row gap-3 items-start bg-surface border border-border rounded-xl p-4"
          >
            <View className={`w-5 h-5 rounded border mt-0.5 items-center justify-center ${pledged ? "bg-accent border-accent" : "border-border"}`}>
              {pledged && <Text style={{ color: "#060d1a", fontSize: 12, fontWeight: "bold" }}>✓</Text>}
            </View>
            <View className="flex-1">
              <Text className="text-text text-sm font-medium">I sign the Merit Pledge</Text>
              <Text className="text-muted text-xs mt-1">
                I commit to evaluating candidates solely on merit as scored by HedHunter AI, free from bias based on name, appearance, age, gender, or background.
              </Text>
            </View>
          </Pressable>

          <Button onPress={handleSignup} loading={loading} fullWidth size="lg">
            Create company account
          </Button>
        </View>

        <Link href="/(auth)/login" asChild>
          <Pressable className="items-center py-2">
            <Text className="text-muted text-sm">Already have an account? <Text className="text-subtle">Sign in</Text></Text>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </Screen>
  );
}
