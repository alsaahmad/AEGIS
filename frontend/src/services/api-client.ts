import { CONFIG } from "@/config/constants";
import { parseErrorMessage } from "@/lib/ws-utils";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => undefined);
      const message =
        body && typeof body === "object" && "message" in body
          ? String((body as { message: unknown }).message)
          : `Request failed (${response.status})`;
      throw new ApiError(message, response.status, body);
    }

    if (response.status === 204) return undefined as T;
    const text = await response.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out", 408);
    }
    throw new ApiError(parseErrorMessage(error), 0);
  } finally {
    clearTimeout(timeout);
  }
}
