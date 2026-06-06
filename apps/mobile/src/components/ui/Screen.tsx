import React from "react";
import { ScrollView, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  padded?: boolean;
}

export function Screen({ children, scroll = true, style, padded = true }: ScreenProps) {
  const inner = padded ? <View className="flex-1 px-5 py-4">{children}</View> : children;

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={style}
        >
          {inner}
        </ScrollView>
      ) : (
        <View className="flex-1" style={style}>{inner}</View>
      )}
    </SafeAreaView>
  );
}
