import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("game.getPacks", () => {
  it("should return all active packs", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const packs = await caller.game.getPacks();

    expect(packs).toBeDefined();
    expect(Array.isArray(packs)).toBe(true);
    expect(packs.length).toBeGreaterThan(0);
    
    // Check that free pack exists
    const freePack = packs.find((p) => p.price === 0);
    expect(freePack).toBeDefined();
    expect(freePack?.name).toBe("Para Romper el Hielo");
  });
});

describe("game.getRandomQuestion", () => {
  it("should return a random question for familiar mode", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const packs = await caller.game.getPacks();
    const freePack = packs.find((p) => p.price === 0);
    
    if (!freePack) {
      throw new Error("Free pack not found");
    }

    const question = await caller.game.getRandomQuestion({
      packIds: [freePack.packId],
      mode: "familiar",
    });

    expect(question).toBeDefined();
    expect(question.questionText).toBeDefined();
    expect(typeof question.questionText).toBe("string");
    expect(question.questionText.length).toBeGreaterThan(0);
  });

  it("should return a random question for adultos mode", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const packs = await caller.game.getPacks();
    const freePack = packs.find((p) => p.price === 0);
    
    if (!freePack) {
      throw new Error("Free pack not found");
    }

    const question = await caller.game.getRandomQuestion({
      packIds: [freePack.packId],
      mode: "adultos",
    });

    expect(question).toBeDefined();
    expect(question.questionText).toBeDefined();
    expect(typeof question.questionText).toBe("string");
    expect(question.questionText.length).toBeGreaterThan(0);
  });

  it("should throw error when no packs are provided", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.game.getRandomQuestion({
        packIds: [],
        mode: "familiar",
      })
    ).rejects.toThrow();
  });
});

describe("game.getRandomChallenge", () => {
  it("should return a random challenge for familiar mode", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const challenge = await caller.game.getRandomChallenge({
      mode: "familiar",
    });

    expect(challenge).toBeDefined();
    expect(challenge.challengeText).toBeDefined();
    expect(typeof challenge.challengeText).toBe("string");
    expect(challenge.challengeText.length).toBeGreaterThan(0);
  });

  it("should return a random challenge for adultos mode", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const challenge = await caller.game.getRandomChallenge({
      mode: "adultos",
    });

    expect(challenge).toBeDefined();
    expect(challenge.challengeText).toBeDefined();
    expect(typeof challenge.challengeText).toBe("string");
    expect(challenge.challengeText.length).toBeGreaterThan(0);
  });
});

describe("stripe.createCheckoutSession", () => {
  it("should create a checkout session for a valid pack", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stripe.createCheckoutSession({
      packId: "salseo-total",
    });

    expect(result).toBeDefined();
    expect(result.sessionId).toBeDefined();
    expect(result.url).toBeDefined();
    expect(typeof result.url).toBe("string");
  });

  it("should throw error for invalid pack", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.stripe.createCheckoutSession({
        packId: "invalid-pack-id",
      })
    ).rejects.toThrow("Product not found");
  });
});
