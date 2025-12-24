import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as process from 'process';

const prisma = new PrismaClient();

const cleanDatabase = async (prisma: PrismaClient) => {
    try {
        await prisma.user.deleteMany();
    } catch (e) {
        // Ignore if table doesn't exist
    }
};

const seeders = async () => {
    await cleanDatabase(prisma);

    await prisma.user.create({
        data: {
            email: 'admin@gmail.com',
            password: await bcrypt.hash('Admin@123', 10),
        },
    });
};

seeders()
    .then(() => {
        Logger.log('seeder done');
        prisma.$disconnect();
        process.exit();
    })
    .catch((e) => {
        Logger.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
