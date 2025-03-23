import { NextRequest, NextResponse } from "next/server";
import * as userController from "@/server/controllers/user.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const stats = await userController.getUserStats(params.userId);
    if (!stats) {
      return NextResponse.json(
        {
          error: "Not found",
          errorMessage: `Stats for user ${params.userId} not found`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error in GET /api/users/[userId]/stats route:", error);
    return NextResponse.json(
      { error: String(error), errorMessage: "Internal server error" },
      { status: 500 }
    );
  }
}
