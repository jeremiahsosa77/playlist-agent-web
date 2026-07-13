import {
  NextRequest,
  NextResponse,
} from "next/server";

const COOKIE_NAME = "playlist_agent_access";

type AccessRequest = {
  accessCode?: string;
};

export async function POST(
  request: NextRequest,
) {
  const configuredCode =
    process.env.DEMO_ACCESS_CODE?.trim();

  const sessionToken =
    process.env.DEMO_SESSION_TOKEN?.trim();

  if (!configuredCode || !sessionToken) {
    return NextResponse.json(
      {
        error: {
          code: "ACCESS_NOT_CONFIGURED",
          message:
            "Private alpha access is not configured.",
        },
      },
      {
        status: 503,
      },
    );
  }

  let body: AccessRequest;

  try {
    body = (await request.json()) as AccessRequest;
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid request body.",
        },
      },
      {
        status: 400,
      },
    );
  }

  if (body.accessCode !== configuredCode) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_ACCESS_CODE",
          message: "Invalid access code.",
        },
      },
      {
        status: 401,
      },
    );
  }

  const response = NextResponse.json({
    authenticated: true,
  });

  response.cookies.set(
    COOKIE_NAME,
    sessionToken,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    },
  );

  return response;
}