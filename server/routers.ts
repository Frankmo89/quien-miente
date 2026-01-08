import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  stripe: router({
    createCheckoutSession: publicProcedure
      .input(
        z.object({
          packId: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { getProductById } = await import("./products");
        const { createCheckoutSession } = await import("./stripe");
        
        const product = getProductById(input.packId);
        if (!product) {
          throw new Error("Product not found");
        }
        
        const origin = ctx.req.headers.origin || "http://localhost:3000";
        const successUrl = `${origin}/?purchase=success&pack=${input.packId}`;
        const cancelUrl = `${origin}/?purchase=canceled`;
        
        const session = await createCheckoutSession({
          productId: product.id,
          productName: product.name,
          productDescription: product.description,
          price: product.price,
          successUrl,
          cancelUrl,
          metadata: {
            pack_id: input.packId,
          },
        });
        
        return {
          sessionId: session.id,
          url: session.url,
        };
      }),
  }),

  game: router({
    getPacks: publicProcedure.query(async () => {
      const { getActivePacks } = await import("./db");
      return getActivePacks();
    }),
    
    getRandomQuestion: publicProcedure
      .input(
        z.object({
          packIds: z.array(z.string()),
          mode: z.enum(["familiar", "adultos"]),
        })
      )
      .query(async ({ input }) => {
        const { getQuestionsByPackAndMode } = await import("./db");
        const questions = await getQuestionsByPackAndMode(input.packIds, input.mode);
        
        if (questions.length === 0) {
          throw new Error("No questions found for the selected packs and mode");
        }
        
        const randomIndex = Math.floor(Math.random() * questions.length);
        return questions[randomIndex];
      }),
    
    getRandomChallenge: publicProcedure
      .input(
        z.object({
          mode: z.enum(["familiar", "adultos"]),
        })
      )
      .query(async ({ input }) => {
        const { getChallengesByMode } = await import("./db");
        const challenges = await getChallengesByMode(input.mode);
        
        if (challenges.length === 0) {
          throw new Error("No challenges found for the selected mode");
        }
        
        const randomIndex = Math.floor(Math.random() * challenges.length);
        return challenges[randomIndex];
      }),
  }),
});

export type AppRouter = typeof appRouter;
