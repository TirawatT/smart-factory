import { NextRequest, NextResponse } from "next/server";
import { getUserById, getUserPermissions } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("sf_auth_user")?.value;
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 },
    );
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 401 },
    );
  }

  const permissions = await getUserPermissions(user.roleId);
  return NextResponse.json({ success: true, user, permissions });
}
