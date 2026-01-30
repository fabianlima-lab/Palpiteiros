import { router } from './trpc';
import { rumorsRouter } from './routers/rumors';
import { influencersRouter } from './routers/influencers';
import { usersRouter } from './routers/users';
import { socialRouter } from './routers/social';
import { notificationsRouter } from './routers/notifications';

export const appRouter = router({
  rumors: rumorsRouter,
  influencers: influencersRouter,
  users: usersRouter,
  social: socialRouter,
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
