import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/cn";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated";
}

export function Card({ children, className, variant = "default", ...props }: CardProps) {
  return (
    <View
      {...props}
      className={cn(
        "rounded-2xl border border-border bg-surface p-4",
        variant === "elevated" && "shadow-lg",
        className
      )}
    >
      {children}
    </View>
  );
}
