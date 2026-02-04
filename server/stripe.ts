// DEPRECATED: WEB ONLY - NOT USED IN MOBILE APP
import Stripe from "stripe";
import { ENV } from "./_core/env";

if (!ENV.stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
});

export async function createCheckoutSession(params: {
  productId: string;
  productName: string;
  productDescription: string;
  price: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: params.productName,
            description: params.productDescription,
          },
          unit_amount: params.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata || {},
    allow_promotion_codes: true,
  });

  return session;
}
