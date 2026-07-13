import {
  NextRequest,
  NextResponse,
} from "next/server";

const COOKIE_NAME = "playlist_agent_access";

export function proxy(
  request: NextRequest,
) {
  const pathname =
    request.nextUrl.pathname;

  if (
    pathname === "/access" ||
    pathname.startsWith("/api/access")
  ) {
    return NextResponse.next();
  }

  const expectedSessionToken =
    process.env.DEMO_SESSION_TOKEN;

  const sessionToken =
    request.cookies.get(
      COOKIE_NAME,
    )?.value;

  if (
    !expectedSessionToken ||
    sessionToken !== expectedSessionToken
  ) {
    return NextResponse.redirect(
      new URL(
        "/access",
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};