import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export async function getCompletionById(id: string) {
  return prisma.completionRecord.findUnique({
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
    },
  });
}

export async function createCompletion(
  data: Prisma.CompletionRecordCreateInput
) {
  return prisma.completionRecord.create({
    data,
    include: {
      booking: true,
      service: true,
    },
  });
}

export async function updateCompletion(
  id: string,
  data: Prisma.CompletionRecordUpdateInput
) {
  return prisma.completionRecord.update({
    where: { id },
    data,
    include: {
      booking: true,
      service: true,
    },
  });
}

export async function deleteCompletion(id: string) {
  return prisma.completionRecord.delete({ where: { id } });
}

export async function getCompletionsByService(serviceId: string) {
  return prisma.completionRecord.findMany({
    where: { serviceId },
    include: {
      booking: {
        include: {
          client: true,
        },
      },
    },
    orderBy: {
      completionTime: "desc",
    },
  });
}

export async function getServiceRatingStats(serviceId: string) {
  const ratings = await prisma.completionRecord.aggregate({
    where: { serviceId },
    _avg: { rating: true },
    _count: true,
    _min: { rating: true },
    _max: { rating: true },
  });

  return {
    averageRating: ratings._avg.rating || 0,
    totalRatings: ratings._count,
    lowestRating: ratings._min.rating || 0,
    highestRating: ratings._max.rating || 0,
  };
}
