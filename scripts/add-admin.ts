import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const email = 'yusaku.suzuki@sou-zou-do.com';
    const password = 'Yusaku0310!'; // Note: Should be hashed in production

    // Check if user exists
    const existing = await prisma.user.findUnique({
        where: { email }
    });

    if (existing) {
        console.log(`User ${email} already exists.`);
    } else {
        const user = await prisma.user.create({
            data: {
                email,
                password,
                name: "Yusaku Suzuki",
                role: "admin"
            }
        });
        console.log(`Created admin user: ${user.email}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
