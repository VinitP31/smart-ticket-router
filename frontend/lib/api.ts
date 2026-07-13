import type { RouteResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiUnreachableError extends Error {}

export async function routeTicket(ticket: string): Promise<RouteResponse> {
  if (!API_URL) {
    throw new ApiUnreachableError("NEXT_PUBLIC_API_URL is not set");
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket }),
    });
  } catch {
    throw new ApiUnreachableError("Could not reach the routing service");
  }

  if (!response.ok) {
    throw new ApiUnreachableError(`Routing service returned ${response.status}`);
  }

  return response.json();
}
