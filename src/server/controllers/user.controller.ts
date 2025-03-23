import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      providedServices: true,
      bookings: true,
      payments: true,
    },
  });
}

export async function getUserByWalletAddress(walletAddress: string) {
  return prisma.user.findUnique({
    where: { walletAddress },
    include: {
      providedServices: true,
      bookings: true,
      payments: true,
    },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({
    include: {
      providedServices: true,
      bookings: true,
      payments: true,
    },
  });
}

export async function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({
    data,
    include: {
      providedServices: true,
      bookings: true,
      payments: true,
    },
  });
}

export async function updateUser(id: string, data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id },
    data,
    include: {
      providedServices: true,
      bookings: true,
      payments: true,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}

export async function getUserStats(userId: string) {
  const [providedServices, bookings, totalEarnings] = await Promise.all([
    prisma.service.count({ where: { providerId: userId } }),
    prisma.booking.count({ where: { clientId: userId } }),
    prisma.payment.aggregate({
      where: { recipientId: userId, status: "completed" },
      _sum: { paymentAmount: true },
    }),
  ]);

  return {
    providedServices,
    bookings,
    totalEarnings: totalEarnings._sum.paymentAmount || 0,
  };
}
