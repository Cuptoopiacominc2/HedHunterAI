import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly: your email address, resume, cover letter, skills, and interview responses. We also collect usage data such as how you interact with the platform. For companies, we collect company name, industry, size, and job postings.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to match job seekers with relevant opportunities, evaluate candidates anonymously using AI, facilitate hiring decisions, and improve the platform. Interview audio is transcribed and scored; the original audio is deleted after processing.",
  },
  {
    title: "3. Anonymization",
    body: "HedHunter AI is built on anonymized hiring. Before your profile reaches any employer, personal identifiers — name, contact details, photo, and other identifying information — are removed. Employers see only your skills, experience, and interview scores.",
  },
  {
    title: "4. Data Sharing",
    body: "We do not sell your personal data. We share anonymized profiles with employers on the platform. We use trusted third-party services (Firebase, AWS S3, Groq AI, Stripe) to operate the platform. These providers are bound by data processing agreements.",
  },
  {
    title: "5. Data Retention",
    body: "We retain your data while your account is active and for a reasonable period after deletion to comply with legal obligations. Interview audio is deleted immediately after transcription. You may request deletion of your account and data at any time.",
  },
  {
    title: "6. Your Rights",
    body: "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@hedhunterai.com. We will respond within 30 days.",
  },
  {
    title: "7. Security",
    body: "We implement industry-standard security measures including encryption at rest and in transit, access controls, and regular security reviews. No system is 100% secure; we encourage you to use a strong password.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this policy from time to time. We will notify you of material changes via email or an in-app notice. Continued use of the platform after changes constitutes acceptance.",
  },
  {
    title: "9. Contact",
    body: "Questions about this policy? Contact us at privacy@hedhunterai.com or write to HedHunter AI, Inc.",
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#060d1a" }} edges={["bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <Header title="Privacy Policy" showBack />
          <Text style={{ color: "#7e8aa3", fontFamily: "monospace", fontSize: 11, marginBottom: 24 }}>
            Last updated: June 2025
          </Text>

          <Text style={{ color: "#b4bece", fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
            HedHunter AI ("we", "our", "us") is committed to protecting your privacy.
            This policy explains what data we collect, how we use it, and your rights.
          </Text>

          {SECTIONS.map(section => (
            <View key={section.title} style={{ marginBottom: 24 }}>
              <Text style={{ color: "#e2e8f0", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
                {section.title}
              </Text>
              <Text style={{ color: "#7e8aa3", fontSize: 13, lineHeight: 20 }}>
                {section.body}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
