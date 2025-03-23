import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export async function getServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
    include: {
      provider: true,
      bookings: true,
      completions: true,
      payments: true,
      transcript: true,
    },
  });
}

export async function getAllServices() {
  return prisma.service.findMany({
    include: {
      provider: true,
      bookings: {
        include: {
          client: true,
        },
      },
      transcript: true,
    },
  });
}

export async function getServicesByProvider(providerId: string) {
  return prisma.service.findMany({
    where: { providerId },
    include: {
      bookings: {
        include: {
          client: true,
          completions: true,
        },
      },
      transcript: true,
    },
  });
}

export async function createService(data: Prisma.ServiceCreateInput) {
  return prisma.service.create({
    data,
    include: {
      provider: true,
      bookings: true,
      transcript: true,
    },
  });
}

export async function updateService(
  id: string,
  data: Prisma.ServiceUpdateInput
) {
  return prisma.service.update({
    where: { id },
    data,
    include: {
      provider: true,
      bookings: true,
      transcript: true,
    },
  });
}

export async function deleteService(id: string) {
  return prisma.service.delete({ where: { id } });
}

export async function getAvailableServices() {
  return prisma.service.findMany({
    where: { status: "available" },
    include: {
      provider: true,
      transcript: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getServiceMetrics(serviceId: string) {
  const [bookings, completions, payments] = await Promise.all([
    prisma.booking.count({ where: { serviceId } }),
    prisma.completionRecord.aggregate({
      where: { serviceId },
      _avg: { rating: true },
    }),
    prisma.payment.aggregate({
      where: { serviceId, status: "completed" },
      _sum: { paymentAmount: true },
    }),
  ]);

  return {
    totalBookings: bookings,
    averageRating: completions._avg.rating || 0,
    totalRevenue: payments._sum.paymentAmount || 0,
  };
}
