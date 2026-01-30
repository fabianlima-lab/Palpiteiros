import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/db';

export const socialRouter = router({
  list: publicProcedure
    .input(
      z.object({
        rumorId: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      return await prisma.socialPost.findMany({
        where: input?.rumorId ? { rumorId: input.rumorId } : undefined,
        include: {
          rumor: true,
        },
        orderBy: { postedAt: 'desc' },
        take: input?.limit ?? 20,
      });
    }),

  getByRumor: publicProcedure
    .input(z.object({ rumorId: z.string() }))
    .query(async ({ input }) => {
      return await prisma.socialPost.findMany({
        where: { rumorId: input.rumorId },
        orderBy: { postedAt: 'desc' },
      });
    }),
});
