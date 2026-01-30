import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/db';

export const influencersRouter = router({
  list: publicProcedure.query(async () => {
    return await prisma.influencer.findMany({
      include: {
        _count: {
          select: { signals: true },
        },
      },
      orderBy: { trustScore: 'desc' },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.influencer.findUnique({
        where: { id: input.id },
        include: {
          signals: {
            include: {
              rumor: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });
    }),

  getRanking: publicProcedure.query(async () => {
    return await prisma.influencer.findMany({
      include: {
        _count: {
          select: { signals: true },
        },
      },
      orderBy: { trustScore: 'desc' },
      take: 20,
    });
  }),
});
