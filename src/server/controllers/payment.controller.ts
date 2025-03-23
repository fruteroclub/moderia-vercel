import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export async function getPaymentById(id: string) {
  return prisma.payment.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          client: true,
        },
      },
      service: {
        include: {
          provider: true,
        },
      },
      recipient: true,
    },
  });
}

export async function createPayment(data: Prisma.PaymentCreateInput) {
  return prisma.payment.create({
    data,
    include: {
      booking: true,
      service: true,
      recipient: true,
    },
  });
}

export async function updatePayment(
  id: string,
  data: Prisma.PaymentUpdateInput
) {
  return prisma.payment.update({
    where: { id },
    data,
    include: {
      booking: true,
      service: true,
      recipient: true,
    },
  });
}

export async function getPaymentsByRecipient(recipientId: string) {
  return prisma.payment.findMany({
    where: { recipientId },
    include: {
      booking: {
        include: {
          client: true,
        },
      },
      service: true,
    },
    orderBy: {
      transactionTime: "desc",
    },
  });
}

export async function getPaymentStats(recipientId: string) {
  const stats = await prisma.payment.aggregate({
    where: {
      recipientId,
      status: "completed",
    },
    _sum: { paymentAmount: true },
    _count: true,
    _avg: { paymentAmount: true },
  });

  return {
    totalEarnings: stats._sum.paymentAmount || 0,
    totalTransactions: stats._count,
    averagePayment: stats._avg.paymentAmount || 0,
  };
}

export async function getPaymentsByBooking(bookingId: string) {
  return prisma.payment.findMany({
    where: { bookingId },
    include: {
      recipient: true,
    },
    orderBy: {
      transactionTime: "desc",
    },
  });
}
