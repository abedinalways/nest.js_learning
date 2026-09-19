import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Prisma 7-এ schema ফাইলে datasource url আর থাকে না (P1012) —
  // migration / db push-এর জন্য কানেকশন URL এখানে দিতে হয়
  datasource: {
    url: env('DATABASE_URL'),
  },
});
