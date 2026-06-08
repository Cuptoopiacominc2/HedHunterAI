import { stripe, STRIPE_PRICES, createCheckoutSession, getOrCreateStripeCustomer } from "@/lib/stripe";
import { adminCol, FieldValue } from "@/lib/db-admin";
import { PRICING } from "@/lib/constants";
import type { PaymentType } from "@/types/payment";

export async function createSeekerAnnualCheckout(uid: string, email: string, successUrl: string, cancelUrl: string) {
  const customerId = await getOrCreateStripeCustomer(email, uid);
  await adminCol.stripeCustomers(uid).set({ uid, stripeCustomerId: customerId }, { merge: true });
  const session = await createCheckoutSession({
    customerId, priceId: STRIPE_PRICES.SEEKER_ANNUAL,
    successUrl: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl,
    metadata: { userId: uid, type: "SEEKER_ANNUAL" },
  });
  await createPendingPayment(uid, "SEEKER_ANNUAL", PRICING.SEEKER_ANNUAL_CENTS);
  return session;
}

export async function createCompanyAnnualCheckout(uid: string, email: string, successUrl: string, cancelUrl: string) {
  const customerId = await getOrCreateStripeCustomer(email, uid);
  await adminCol.stripeCustomers(uid).set({ uid, stripeCustomerId: customerId }, { merge: true });
  const session = await createCheckoutSession({
    customerId, priceId: STRIPE_PRICES.COMPANY_ANNUAL,
    successUrl: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl,
    metadata: { userId: uid, type: "COMPANY_ANNUAL" },
  });
  await createPendingPayment(uid, "COMPANY_ANNUAL", PRICING.COMPANY_ANNUAL_CENTS);
  return session;
}

export async function createJobPostCheckout(uid: string, email: string, openPositions: number, jobPostId: string, successUrl: string, cancelUrl: string) {
  const amountCents = openPositions * PRICING.COMPANY_PER_POSITION_CENTS;
  const customerId  = await getOrCreateStripeCustomer(email, uid);
  const session     = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency:     "usd",
        unit_amount:  PRICING.COMPANY_PER_POSITION_CENTS,
        product_data: { name: `Job Position (×${openPositions})` },
      },
      quantity: openPositions,
    }],
    mode:        "payment",
    success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  cancelUrl,
    metadata:    { userId: uid, type: "COMPANY_JOB_POST", jobPostId },
  });
  await createPendingPayment(uid, "COMPANY_JOB_POST", amountCents, { jobPostId });
  return session;
}

async function createPendingPayment(uid: string, type: PaymentType, amountCents: number, metadata?: Record<string, unknown>) {
  return adminCol.paymentsCol().add({
    userId: uid, type, status: "PENDING", amountCents,
    metadata: metadata ?? {},
    createdAt: FieldValue.serverTimestamp(),
  });
}
