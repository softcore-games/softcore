import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@example.com',
      },
    });

    if (!existingAdmin) {
      // Hash password
      const hashedPassword = await hash('admin123', 12);

      // Create admin user
      const admin = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          username: 'admin',
          password: hashedPassword,
          isAdmin: true,
          gameState: {
            create: {
              progress: {},
              relationships: {},
              choices: {},
              settings: {
                volume: 100,
                textSpeed: 'normal',
                autoplay: false,
              },
            },
          },
        },
      });

      console.log('Admin user created successfully:', admin.email);
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();