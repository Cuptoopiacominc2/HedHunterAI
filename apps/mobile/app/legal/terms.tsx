import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account or using HedHunter AI, you agree to these Terms of Service. If you do not agree, do not use the platform.",
  },
  {
    title: "2. Description of Service",
    body: "HedHunter AI is a merit-based anonymous hiring platform. Job seekers can apply for positions, complete AI-scored interviews, and receive offers — all while keeping their identity protected until an offer is made. Companies can post jobs, review anonymous candidate scores, and make hiring decisions.",
  },
  {
    title: "3. Accounts",
    body: "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You may not share your account with others or use the platform for any unlawful purpose.",
  },
  {
    title: "4. Job Seeker Registration Fee",
    body: "A one-time registration fee is required to access interview features. This fee covers AI processing costs and deters bad-faith applications. The fee is non-refundable except where required by law.",
  },
  {
    title: "5. Company Subscription",
    body: "Companies pay a subscription to access candidate scores and contact shortlisted candidates. Subscription fees are billed as described at the time of purchase. You may cancel at any time; access continues until the end of the billing period.",
  },
  {
    title: "6. Prohibited Conduct",
    body: "You may not: submit false or misleading information; attempt to de-anonymize other users; scrape, copy, or redistribute platform content; use the platform to discriminate unlawfully; attempt to circumvent AI scoring; or use the platform in a way that violates applicable law.",
  },
  {
    title: "7. AI Scoring and Decisions",
    body: "AI scores are advisory and provide a starting point for human review. HedHunter AI does not guarantee any hiring outcome. All final hiring decisions are made by humans. We are not liable for employment decisions made by companies on this platform.",
  },
  {
    title: "8. Intellectual Property",
    body: "All platform software, design, and content are owned by HedHunter AI. You retain ownership of content you submit (resume, cover letter, interview responses) and grant us a limited license to process it to provide the service.",
  },
  {
    title: "9. Disclaimers",
    body: "The platform is provided \"as is\" without warranties of any kind. We do not guarantee uptime, accuracy of AI assessments, or hiring outcomes. Use the platform at your own risk.",
  },
  {
    title: "10. Limitation of Liability",
    body: "To the maximum extent permitted by law, HedHunter AI is not liable for indirect, incidental, special, or consequential damages arising from your use of the platform.",
  },
  {
    title: "11. Termination",
    body: "We may suspend or terminate accounts that violate these terms. You may delete your account at any time. Termination does not affect obligations incurred before termination.",
  },
  {
    title: "12. Changes to Terms",
    body: "We may update these terms. Material changes will be communicated via email or in-app notice. Continued use after the effective date of changes constitutes acceptance.",
  },
  {
    title: "13. Governing Law",
    body: "These terms are governed by applicable law. Disputes will be resolved through binding arbitration where permitted, or in courts of competent jurisdiction.",
  },
  {
    title: "14. Contact",
    body: "Questions about these terms? Contact us at legal@hedhunterai.com.",
  },
];

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#060d1a" }} edges={["bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <Header title="Terms of Service" showBack />
          <Text style={{ color: "#7e8aa3", fontFamily: "monospace", fontSize: 11, marginBottom: 24 }}>
            Last updated: June 2025
          </Text>

          <Text style={{ color: "#b4bece", fontSize: 14, lineHeight: 22, marginBottom: 24 }}>
            These Terms of Service govern your use of the HedHunter AI platform.
            Please read them carefully before using the service.
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
