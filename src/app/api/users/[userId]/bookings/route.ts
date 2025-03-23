import { NextRequest, NextResponse } from "next/server";
import * as bookingController from "@/server/controllers/booking.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const bookings = await bookingController.getBookingsByClient(params.userId);
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error in GET /api/users/[userId]/bookings route:", error);
    return NextResponse.json(
      { error: String(error), errorMessage: "Internal server error" },
      { status: 500 }
    );
  }
}
