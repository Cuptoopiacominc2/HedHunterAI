import Stripe from "stripe";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { logPayment } from "@/lib/audit-log";
import { sendPaymentReceiptEmail } from "@/lib/email";
import { formatDate } from "@/utils/formatDate";

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const { userId, type, jobPostId } = session.metadata ?? {};
  if (!userId || !type) return;

  const rawSnap = await adminCol.paymentsCol()
    .where("userId", "==", userId)
    .where("type", "==", type)
    .where("status", "==", "PENDING")
    .get();
  if (rawSnap.empty) return;
  const sorted     = rawSnap.docs.sort((a, b) => (b.data().createdAt?.seconds ?? 0) - (a.data().createdAt?.seconds ?? 0));
  const paymentRef = sorted[0].ref;
  const paymentId  = sorted[0].id;

  await paymentRef.update({ status: "COMPLETED", stripePaymentId: session.payment_intent as string });

  if (type === "SEEKER_ANNUAL") {
    await adminCol.jobSeekerProfiles(userId).update({ registrationPaid: true, updatedAt: FieldValue.serverTimestamp() });
  } else if (type === "COMPANY_ANNUAL") {
    await adminCol.companyProfiles(userId).update({ annualPaid: true, updatedAt: FieldValue.serverTimestamp() });
  } else if (type === "COMPANY_JOB_POST" && jobPostId) {
    await adminCol.jobPosts(jobPostId).update({ paymentConfirmed: true, updatedAt: FieldValue.serverTimestamp() });
  }

  const userSnap = await adminCol.users(userId).get();
  const email    = userSnap.data()?.email;
  if (email) {
    const amount = sorted[0].data().amountCents;
    await logPayment({ userId, paymentId, amount, type });
    await sendPaymentReceiptEmail(email, { amount, type, date: formatDate(new Date()) });
  }
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent): Promise<void> {
  const snap = await adminCol.paymentsCol().where("stripePaymentId", "==", intent.id).get();
  for (const doc of snap.docs) await doc.ref.update({ status: "FAILED" });
}
