import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export async function getTranscriptById(id: string) {
  return prisma.transcript.findUnique({
    where: { id },
    include: {
      service: {
        include: {
          provider: true,
        },
      },
    },
  });
}

export async function getTranscriptByService(serviceId: string) {
  return prisma.transcript.findUnique({
    where: { serviceId },
    include: {
      service: {
        include: {
          provider: true,
        },
      },
    },
  });
}

export async function createTranscript(data: Prisma.TranscriptCreateInput) {
  return prisma.transcript.create({
    data,
    include: {
      service: true,
    },
  });
}

export async function updateTranscript(
  id: string,
  data: Prisma.TranscriptUpdateInput
) {
  return prisma.transcript.update({
    where: { id },
    data,
    include: {
      service: true,
    },
  });
}

export async function deleteTranscript(id: string) {
  return prisma.transcript.delete({ where: { id } });
}

export async function getTranscriptsByStatus(status: string) {
  return prisma.transcript.findMany({
    where: { status },
    include: {
      service: {
        include: {
          provider: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function updateTranscriptStatus(
  id: string,
  status: string,
  content?: string
) {
  return prisma.transcript.update({
    where: { id },
    data: {
      status,
      ...(content && { content }),
      updatedAt: new Date(),
    },
    include: {
      service: true,
    },
  });
}

export async function getTranscriptMetrics() {
  const metrics = await prisma.transcript.groupBy({
    by: ["status"],
    _count: true,
  });

  return metrics.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.status]: curr._count,
    }),
    {}
  );
}
