# Prisma + PostgreSQL CRUD Demo

Prisma 7 দিয়ে PostgreSQL (Neon) CRUD ডেমো — CREATE, READ, UPDATE, DELETE।

## সেটআপ

```bash
npm install          # ডিপেন্ডেন্সি ইনস্টল + prisma generate অটো চলবে
```

`.env` ফাইলে ডাটাবেস কানেকশন URL রাখতে হবে:

```
DATABASE_URL="postgresql://..."
```

## কমান্ড

| কমান্ড | কাজ |
|---|---|
| `npm run dev` | CRUD ডেমো চালানো (tsx দিয়ে) |
| `npm run generate` | Prisma Client জেনারেট |
| `npm run db:push` | স্কিমা ডাটাবেসে পুশ করা |

## Prisma 7 নোট

- Prisma 7-এ Rust query engine নেই — কানেকশনের জন্য **driver adapter** (`@prisma/adapter-pg`) `PrismaClient` কনস্ট্রাক্টরে পাস করতে হয় (`index.ts` দেখুন)।
- স্কিমা ফাইলে `datasource url` আর রাখা যায় না — migrate/db push-এর URL `prisma.config.ts`-এ থাকে।
- `.env` ফাইল অটো-লোড হয় না — তাই `dotenv` ব্যবহার করা হয়েছে।

## ⚠️ সিকিউরিটি

`.env` ফাইলটা `.gitignore`-এ আছে — কখনো git-এ commit করবেন না।
# nest.js_learning
