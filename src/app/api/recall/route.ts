import { NextResponse } from "next/server";
import { fullRecallFlow } from "@/lib/recallActions";

export async function GET() {
  try {
    await fullRecallFlow();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
