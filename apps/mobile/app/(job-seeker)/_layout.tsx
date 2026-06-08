import { Stack } from "expo-router";
import { View } from "react-native";
import { TabBar } from "@/components/layout/TabBar";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = [
  { label: "Home",     icon: "home-outline",         activeIcon: "home",          href: "/(job-seeker)/dashboard"    },
  { label: "Jobs",     icon: "briefcase-outline",     activeIcon: "briefcase",     href: "/(job-seeker)/jobs"         },
  { label: "Applied",  icon: "document-text-outline", activeIcon: "document-text", href: "/(job-seeker)/applications" },
  { label: "Offers",   icon: "gift-outline",          activeIcon: "gift",          href: "/(job-seeker)/offers"       },
  { label: "Profile",  icon: "person-outline",        activeIcon: "person",        href: "/(job-seeker)/profile"      },
] as const;

export default function JobSeekerLayout() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["bottom"]}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#060d1a" } }} />
      <TabBar tabs={TABS as any} />
    </SafeAreaView>
  );
}
