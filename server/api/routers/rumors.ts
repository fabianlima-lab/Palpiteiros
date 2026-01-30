import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/db';

export const rumorsRouter = router({
  list: publicProcedure.query(async () => {
    return await prisma.rumor.findMany({
      where: { status: 'open' },
      include: {
        signals: {
          include: {
            influencer: true,
          },
        },
        predictions: true,
        _count: {
          select: { predictions: true, signals: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.rumor.findUnique({
        where: { id: input.id },
        include: {
          signals: {
            include: {
              influencer: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          predictions: {
            include: {
              user: true,
            },
          },
          socialPosts: {
            orderBy: { postedAt: 'desc' },
          },
        },
      });
    }),

  vote: publicProcedure
    .input(
      z.object({
        rumorId: z.string(),
        prediction: z.boolean(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const prediction = await prisma.prediction.upsert({
        where: {
          rumorId_userId: {
            rumorId: input.rumorId,
            userId: input.userId,
          },
        },
        update: {
          prediction: input.prediction,
        },
        create: {
          rumorId: input.rumorId,
          userId: input.userId,
          prediction: input.prediction,
        },
      });

      // Recalculate sentiment based on all predictions
      const allPredictions = await prisma.prediction.findMany({
        where: { rumorId: input.rumorId },
      });

      const favorableCount = allPredictions.filter(p => p.prediction).length;
      const newSentiment = allPredictions.length > 0
        ? favorableCount / allPredictions.length
        : 0.5;

      await prisma.rumor.update({
        where: { id: input.rumorId },
        data: { sentiment: newSentiment },
      });

      return prediction;
    }),

  getUserPrediction: publicProcedure
    .input(
      z.object({
        rumorId: z.string(),
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.prediction.findUnique({
        where: {
          rumorId_userId: {
            rumorId: input.rumorId,
            userId: input.userId,
          },
        },
      });
    }),
});
