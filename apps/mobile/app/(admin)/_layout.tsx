import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar } from "@/components/layout/TabBar";

const TABS = [
  { label: "Overview",  icon: "grid-outline",         activeIcon: "grid",           href: "/(admin)/dashboard"            },
  { label: "Users",     icon: "people-outline",        activeIcon: "people",         href: "/(admin)/users"                },
  { label: "Companies", icon: "business-outline",      activeIcon: "business",       href: "/(admin)/companies"            },
  { label: "Flags",     icon: "flag-outline",          activeIcon: "flag",           href: "/(admin)/flagged-questions"    },
  { label: "Audit",     icon: "list-outline",          activeIcon: "list",           href: "/(admin)/audit-logs"           },
] as const;

export default function AdminLayout() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["bottom"]}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#060d1a" } }} />
      <TabBar tabs={TABS as any} />
    </SafeAreaView>
  );
}
