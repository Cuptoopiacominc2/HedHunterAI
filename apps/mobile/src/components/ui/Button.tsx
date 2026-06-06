import React from "react";
import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: "bg-primary active:opacity-80",
    text: "text-white font-semibold",
  },
  secondary: {
    container: "bg-surface border border-border active:opacity-80",
    text: "text-text font-medium",
  },
  ghost: {
    container: "active:bg-white/5",
    text: "text-subtle",
  },
  danger: {
    container: "bg-red-600/90 active:opacity-80",
    text: "text-white font-semibold",
  },
};

const sizeClasses: Record<Size, { container: string; text: string }> = {
  sm: { container: "px-3 py-2 rounded-lg", text: "text-sm" },
  md: { container: "px-5 py-3 rounded-xl", text: "text-base" },
  lg: { container: "px-6 py-4 rounded-xl", text: "text-base" },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const v = variantClasses[variant];
  const s = sizeClasses[size];
  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      className={cn(
        "flex-row items-center justify-center",
        v.container,
        s.container,
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50"
      )}
    >
      {loading && <ActivityIndicator color="#fff" size="small" className="mr-2" />}
      <Text className={cn(v.text, s.text)}>{children}</Text>
    </Pressable>
  );
}
