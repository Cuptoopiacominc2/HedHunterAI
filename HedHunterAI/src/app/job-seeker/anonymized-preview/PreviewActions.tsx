"use client";
import { useRouter } from "next/navigation";
import { AnonymizedPreview } from "@/components/job-seeker/AnonymizedPreview";

interface Props {
  anonymizedText: string;
  confidenceScore: number;
}

export function PreviewActions({ anonymizedText, confidenceScore }: Props) {
  const router = useRouter();
  return (
    <AnonymizedPreview
      anonymizedText={anonymizedText}
      confidenceScore={confidenceScore}
      flaggedItems={[]}
      onApprove={() => router.push("/job-seeker/cover-letter-upload")}
      onRequestReanonymization={() => router.push("/job-seeker/resume-upload")}
    />
  );
}
