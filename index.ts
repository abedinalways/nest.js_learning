import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma 7-এ Rust query engine নেই — তাই driver adapter দিয়ে কানেক্ট করতে হয়
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL পাওয়া যায়নি — প্রজেক্ট রুটে .env ফাইল আছে কি না চেক করুন',
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log('--- 1. CREATE (ডেটা তৈরি করা) ---');
  // upsert: ইউজার না থাকলে তৈরি হবে, থাকলে আপডেট হবে —
  // তাই স্ক্রিপ্ট বারবার রান করলেও ইউনিক কনস্ট্রেইন্ট এরর (P2002) হবে না
  const newUser = await prisma.user.upsert({
    where: { email: 'rahim@example.com' },
    update: { name: 'Rahim Uddin' },
    create: {
      name: 'Rahim Uddin',
      email: 'rahim@example.com',
      posts: {
        create: {
          title: 'Prisma শেখা শুরু করলাম',
          content: 'আজকে আমি Prisma-এর CRUD শিখছি। বেশ মজার!',
          published: true,
        },
      },
    },
  });
  console.log('নতুন ইউজার তৈরি হয়েছে:', newUser);

  console.log('\n--- 2. READ (ডেটা পড়া) ---');
  // ডেটাবেস থেকে সব ইউজার এবং তাদের পোস্টগুলো নিয়ে আসব
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true, // এই লাইনের কারণে ইউজারের সাথে তার পোস্টগুলোও চলে আসবে
    },
  });
  console.log('সব ইউজারদের ডেটা:\n', JSON.stringify(allUsers, null, 2));

  console.log('\n--- 3. UPDATE (ডেটা আপডেট করা) ---');
  // ইমেইল ধরে ইউজারের নাম পরিবর্তন করব
  const updatedUser = await prisma.user.update({
    where: { email: 'rahim@example.com' },
    data: { name: 'Rahim Uddin (Updated)' },
  });
  console.log('আপডেটেড ইউজার:', updatedUser);

  console.log('\n--- 4. DELETE (ডেটা মুছে ফেলা) ---');
  // রহিম ভাইয়ের একটি নির্দিষ্ট পোস্ট মুছে ফেলব (প্রথম পোস্টটি)
  // findFirst দিয়ে আগে তার একটি পোস্ট খুঁজছি
  const userPost = await prisma.post.findFirst({
    where: { authorId: updatedUser.id },
  });

  if (userPost) {
    const deletedPost = await prisma.post.delete({
      where: { id: userPost.id },
    });
    console.log(`পোস্টটি ডিলিট করা হয়েছে: ${deletedPost.title}`);
  } else {
    console.log('মুছার মতো কোনো পোস্ট নেই (আগের রানে মুছে ফেলা হয়েছিল)');
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    // এরর হলেও আগে কানেকশন প্রপারলি বন্ধ করে তারপর exit করা,
    // নাহলে finally-এর $disconnect আর চলবে না
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    // কাজ শেষে ডেটাবেস কানেকশন ক্লোজ করা
    await prisma.$disconnect();
  });
