import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.DASHBOARD_PASSWORD || "admin123";

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: "dashboard_session",
        value: "authenticated_admin",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 // 24 hours
      });
      return response;
    }

    return NextResponse.json(
      { error: "Invalid dashboard password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const isAuthenticated = cookieHeader.includes("dashboard_session=authenticated_admin");
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("dashboard_session");
  return response;
}
