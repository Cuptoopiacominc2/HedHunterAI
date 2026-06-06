import "../src/globals.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { AuthProvider } from "@/contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StripeProvider } from "@stripe/stripe-react-native";

SplashScreen.preventAutoHideAsync();

const STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export default function RootLayout() {
  const [loaded] = useFonts({});

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <AuthProvider>
          <StatusBar style="light" backgroundColor="#060d1a" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#060d1a" } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(job-seeker)" />
            <Stack.Screen name="(company)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </AuthProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
