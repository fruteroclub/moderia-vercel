import { NextRequest, NextResponse } from "next/server";
import * as paymentController from "@/server/controllers/payment.controller";

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
    const payments = await paymentController.getPaymentsByRecipient(userId);
    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error in GET /api/users/[userId]/payments route:", error);
    return NextResponse.json(
      { error: String(error), errorMessage: "Internal server error" },
      { status: 500 }
    );
  }
}
