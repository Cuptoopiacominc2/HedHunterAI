import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar } from "@/components/layout/TabBar";

const TABS = [
  { label: "Home",      icon: "home-outline",     activeIcon: "home",       href: "/(company)/dashboard"  },
  { label: "Jobs",      icon: "briefcase-outline", activeIcon: "briefcase",  href: "/(company)/jobs"       },
  { label: "Profile",   icon: "business-outline",  activeIcon: "business",   href: "/(company)/profile"    },
  { label: "Ratings",   icon: "star-outline",      activeIcon: "star",       href: "/(company)/ratings"    },
] as const;

export default function CompanyLayout() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["bottom"]}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#060d1a" } }} />
      <TabBar tabs={TABS as any} />
    </SafeAreaView>
  );
}
