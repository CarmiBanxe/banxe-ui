/**
 * packages/shared/src/api/client.ts — BANXE API client
 * Used by web-next, web-vite (import override), and mobile (via fetch)
 *
 * Auth: Bearer token from storage
 * I-05: all amounts remain as Decimal strings — never parsed as float
 */

import type { ApiError as ApiErrorType } from "../types/index.js"

export class ApiError extends Error {
  readonly status: number
  readonly body: ApiErrorType | null

  constructor(status: number, message: string, body: ApiErrorType | null = null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

export interface ApiClientConfig {
  baseUrl: string
  getToken: () => string | null
  onUnauthorized?: () => void
}

export function createApiClient(config: ApiClientConfig) {
  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = config.getToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> ?? {}),
    }

    const response = await fetch(`${config.baseUrl}${path}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      config.onUnauthorized?.()
      throw new ApiError(401, "Unauthorized — please sign in again")
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as ApiErrorType | null
      throw new ApiError(
        response.status,
        body?.detail ?? `API error: ${response.status}`,
        body
      )
    }

    return response.json() as Promise<T>
  }

  return {
    get:    <T>(path: string) => request<T>(path),
    post:   <T>(path: string, body: unknown) =>
      request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    patch:  <T>(path: string, body: unknown) =>
      request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  }
}

export type BanxeApiClient = ReturnType<typeof createApiClient>
