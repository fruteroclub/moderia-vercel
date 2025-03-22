import { NextResponse } from "next/server";
import { fullRecallFlow } from "@/lib/recallActions";

export async function GET() {
  try {
    await fullRecallFlow();

    return NextResponse.json({ success: true, message: "Recall SDK ran successfully." });
  } catch (error: any) {
    console.error("Recall API error:", error);
    return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
  }
}
