import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { scoreInterviewAnswer } from "@/services/ai/interview-scorer.service";
import { anonymizeDocument } from "@/services/ai/anonymizer.service";
import { LIMITS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { applicationId } = await req.json();

    const appSnap   = await adminCol.applications(applicationId).get();
    if (!appSnap.exists) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const answersSnap = await adminCol.appAnswers(applicationId).get();
    const results     = [];

    for (const doc of answersSnap.docs) {
      const answer  = doc.data();
      if (!answer.transcript) continue;

      const qSnap = await adminCol.jobQuestion(appSnap.data()!.jobPostId, answer.questionId).get();
      const q     = qSnap.data();
      if (!q) continue;

      const anonResult = await anonymizeDocument(answer.transcript, doc.id, "transcript");
      await doc.ref.update({ anonymizedTranscript: anonResult.anonymizedText });

      const score = await scoreInterviewAnswer(
        { questionText: q.questionText, idealAnswer: q.idealAnswer ?? "", transcript: anonResult.anonymizedText, weight: q.weight ?? 1.0 },
        applicationId, doc.id
      );

      await adminCol.appScores(applicationId).add({
        applicationId, answerId: doc.id,
        score: score.score, explanation: score.explanation,
        strengths: score.strengths, missingPoints: score.missingPoints,
        confidence: score.confidence,
        requiresHumanReview: score.confidence < LIMITS.MIN_AI_CONFIDENCE,
        createdAt: FieldValue.serverTimestamp(),
      });

      results.push({ answerId: doc.id, ...score });
    }

    const totalScore = results.reduce((s, r) => s + r.score, 0);
    const maxScore   = results.length * LIMITS.MAX_SCORE_PER_QUESTION;
    const normalised = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const avgConf    = results.reduce((s, r) => s + r.confidence, 0) / (results.length || 1);

    await adminCol.applications(applicationId).update({
      totalScore: normalised, aiConfidence: avgConf,
      requiresHumanReview: avgConf < LIMITS.MIN_AI_CONFIDENCE,
      status: "SUBMITTED",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ totalScore: normalised, results });
  } catch (err: any) {
    console.error("[score-interview]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
