import { cookies } from "next/headers";
import {
  NextRequest,
  NextResponse,
} from "next/server";

const COOKIE_NAME = "playlist_agent_access";

async function proxyRequest(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const backendUrl =
    process.env.BACKEND_API_URL
      ?.trim()
      .replace(/\/$/, "");

  const backendKey =
    process.env.BACKEND_API_KEY?.trim();

  const expectedSessionToken =
    process.env.DEMO_SESSION_TOKEN?.trim();

  if (
    !backendUrl ||
    !backendKey ||
    !expectedSessionToken
  ) {
    return NextResponse.json(
      {
        error: {
          code: "PROXY_NOT_CONFIGURED",
          message:
            "The private backend proxy is not configured.",
        },
      },
      {
        status: 503,
      },
    );
  }

  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    COOKIE_NAME,
  )?.value;

  if (sessionToken !== expectedSessionToken) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message:
            "Private alpha access is required.",
        },
      },
      {
        status: 401,
      },
    );
  }

  const { path } = await context.params;

  const targetUrl = new URL(
    `${backendUrl}/${path.join("/")}`,
  );

  request.nextUrl.searchParams.forEach(
    (value, key) => {
      targetUrl.searchParams.append(
        key,
        value,
      );
    },
  );

  const hasBody = ![
    "GET",
    "HEAD",
  ].includes(request.method);

  const backendResponse = await fetch(
    targetUrl,
    {
      method: request.method,
      headers: {
        "Content-Type":
          request.headers.get(
            "content-type",
          ) ?? "application/json",
        "X-Playlist-Agent-Key":
          backendKey,
      },
      body: hasBody
        ? await request.text()
        : undefined,
      cache: "no-store",
    },
  );

  const responseBody =
    await backendResponse.text();

  return new NextResponse(
    responseBody || null,
    {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get(
            "content-type",
          ) ?? "application/json",
      },
    },
  );
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;