import { NextRequest, NextResponse } from "next/server";
import * as userController from "@/server/controllers/user.controller";
import { z } from "zod";

// Validation schemas
const createUserSchema = z.object({
  walletAddress: z.string().min(1),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

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

    // Handle user ID lookup
    if (userId) {
      const user = await userController.getUserById(userId);
      if (!user) {
        return NextResponse.json(
          {
            error: "Not found",
            errorMessage: `User with ID ${userId} not found`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json({ user });
    }

    // Return all users if no specific query
    const users = await userController.getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error in /api/users route:", error);
    return NextResponse.json(
      { error: String(error), errorMessage: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validatedData = createUserSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          errorMessage: validatedData.error.errors,
        },
        { status: 400 }
      );
    }

    const user = await userController.createUser(validatedData.data);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/users route:", error);
    return NextResponse.json(
      { error: String(error), errorMessage: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        {
          error: "Bad Request",
          errorMessage: "User ID is required",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate request body
    const validatedData = updateUserSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          errorMessage: validatedData.error.errors,
        },
        { status: 400 }
      );
    }

    const user = await userController.updateUser(userId, validatedData.data);
    if (!user) {
      return NextResponse.json(
        {
          error: "Not found",
          errorMessage: `User with ID ${userId} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error in PATCH /api/users route:", error);
    return NextResponse.json(
      { error: String(error), errorMessage: "Internal server error" },
      { status: 500 }
    );
  }
}
