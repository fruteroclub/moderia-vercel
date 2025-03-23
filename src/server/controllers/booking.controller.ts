import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      client: true,
      service: {
        include: {
          provider: true,
        },
      },
      completions: true,
      payments: true,
    },
  });
}

export async function getAllBookings() {
  return prisma.booking.findMany({
    include: {
      client: true,
      service: {
        include: {
          provider: true,
        },
      },
      completions: true,
      payments: true,
    },
  });
}

export async function createBooking(data: Prisma.BookingCreateInput) {
  return prisma.booking.create({
    data,
    include: {
      client: true,
      service: true,
    },
  });
}

export async function updateBooking(
  id: string,
  data: Prisma.BookingUpdateInput
) {
  return prisma.booking.update({
    where: { id },
    data,
    include: {
      client: true,
      service: true,
      completions: true,
      payments: true,
    },
  });
}

export async function deleteBooking(id: string) {
  return prisma.booking.delete({ where: { id } });
}

export async function getBookingsByClient(clientId: string) {
  return prisma.booking.findMany({
    where: { clientId },
    include: {
      service: {
        include: {
          provider: true,
        },
      },
      completions: true,
      payments: true,
    },
    orderBy: {
      bookingTime: "desc",
    },
  });
}

export async function getBookingStatus(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      payments: true,
      completions: true,
    },
  });

  if (!booking) return null;

  return {
    status: booking.status,
    isPaid: booking.payments.some((p) => p.status === "completed"),
    isCompleted: booking.completions.length > 0,
    lastCompletion: booking.completions[0]?.completionTime || null,
  };
}
