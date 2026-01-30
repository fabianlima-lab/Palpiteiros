import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/db';

export const usersRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.user.findUnique({
        where: { id: input.id },
        include: {
          badges: {
            include: {
              badge: true,
            },
          },
          predictions: {
            include: {
              rumor: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }),

  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      return await prisma.user.findUnique({
        where: { username: input.username },
        include: {
          badges: {
            include: {
              badge: true,
            },
          },
          predictions: {
            include: {
              rumor: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }),

  getRanking: publicProcedure.query(async () => {
    return await prisma.user.findMany({
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
        _count: {
          select: { predictions: true },
        },
      },
      orderBy: { points: 'desc' },
      take: 50,
    });
  }),

  updateTeam: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        team: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.user.update({
        where: { id: input.userId },
        data: { team: input.team },
      });
    }),

  getDemo: publicProcedure.query(async () => {
    return await prisma.user.findFirst({
      where: { username: 'torcedor_demo' },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
        predictions: {
          include: {
            rumor: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }),
});
