import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    const result = await login(email, password);
    if (!result) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
      permissions: result.permissions,
    });

    // Set auth cookie (simple userId for mock)
    response.cookies.set("sf_auth_user", result.user.id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
