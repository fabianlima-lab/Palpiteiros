import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/db';

export const notificationsRouter = router({
  list: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await prisma.notification.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }),

  markAsRead: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.notification.update({
        where: { id: input.id },
        data: { read: true },
      });
    }),

  markAllAsRead: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.notification.updateMany({
        where: { userId: input.userId, read: false },
        data: { read: true },
      });
    }),

  getUnreadCount: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await prisma.notification.count({
        where: { userId: input.userId, read: false },
      });
    }),
});
