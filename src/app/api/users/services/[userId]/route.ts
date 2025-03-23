import { NextRequest, NextResponse } from "next/server";
import * as serviceController from "@/server/controllers/service.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Access the userId from params
    const { userId } = await params;
    const services = await serviceController.getServicesByProvider(userId);
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error in GET /api/users/[userId]/services route:", error);
    return NextResponse.json(
      { error: String(error), errorMessage: "Internal server error" },
      { status: 500 }
    );
  }
}
