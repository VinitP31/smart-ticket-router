import type { RouteResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const REQUEST_TIMEOUT_MS = 45_000;

export class ApiUnreachableError extends Error {}

export async function routeTicket(ticket: string): Promise<RouteResponse> {
  if (!API_URL) {
    throw new ApiUnreachableError("NEXT_PUBLIC_API_URL is not set");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket }),
      signal: controller.signal,
    });
  } catch {
    throw new ApiUnreachableError("Could not reach the routing service");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ApiUnreachableError(`Routing service returned ${response.status}`);
  }

  return response.json();
}
