import { NextRequest, NextResponse } from "next/server";
import * as bookingController from "@/server/controllers/booking.controller";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Access the userId from params
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const bookings = await bookingController.getBookingsByClient(userId);
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error in GET /api/users/[userId]/bookings route:", error);
    return NextResponse.json(
      { error: String(error), errorMessage: "Internal server error" },
      { status: 500 }
    );
  }
}
