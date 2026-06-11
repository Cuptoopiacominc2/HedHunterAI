import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar } from "@/components/layout/TabBar";

const TABS = [
  { label: "Overview",  icon: "grid-outline",         activeIcon: "grid",           href: "/(admin)/dashboard"            },
  { label: "Users",     icon: "people-outline",        activeIcon: "people",         href: "/(admin)/users"                },
  { label: "Seekers",   icon: "person-outline",        activeIcon: "person",         href: "/(admin)/job-seekers"          },
  { label: "Companies", icon: "business-outline",      activeIcon: "business",       href: "/(admin)/companies"            },
  { label: "Jobs",      icon: "briefcase-outline",     activeIcon: "briefcase",      href: "/(admin)/jobs"                 },
  { label: "Flags",     icon: "flag-outline",          activeIcon: "flag",           href: "/(admin)/flagged-questions"    },
] as const;

export default function AdminLayout() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["bottom"]}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#060d1a" } }} />
      <TabBar tabs={TABS as any} />
    </SafeAreaView>
  );
}
