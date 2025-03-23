import { NextRequest, NextResponse } from "next/server";
import * as paymentController from "@/server/controllers/payment.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const payments = await paymentController.getPaymentsByRecipient(
      params.userId
    );
    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error in GET /api/users/[userId]/payments route:", error);
    return NextResponse.json(
      { error: String(error), errorMessage: "Internal server error" },
      { status: 500 }
    );
  }
}
