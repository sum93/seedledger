import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/transactions/[trpcFunc]">,
) {
  const { trpcFunc } = await ctx.params;

  const proxyURL = new URL(`trpc/${trpcFunc}`, "http://localhost:3003");
  const proxyRequest = new Request(proxyURL, request);

  try {
    return fetch(proxyRequest);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected exception";
    return new Response(message, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/transactions/[trpcFunc]">,
) {
  const { trpcFunc } = await ctx.params;

  const proxyURL = new URL(`trpc/${trpcFunc}`, "http://localhost:3003");
  const proxyRequest = new Request(proxyURL, request);

  try {
    return fetch(proxyRequest);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected exception";
    return new Response(message, { status: 500 });
  }
}
