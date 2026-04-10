/**
 * apps/web-next/lib/api.ts — server-side API client for banxe-emi-stack
 *
 * Usage in server components (App Router):
 *   import { getServerApi } from "@/lib/api"
 *   const api = await getServerApi()
 *   const accounts = await api.accounts.list()
 *
 * Token is read from the 'banxe_token' cookie (set on login).
 * When token is absent (unauthenticated), getToken() returns null and
 * the client will make unauthenticated requests (which the backend will 401).
 *
 * For testing / when backend is down, callers should catch ApiError and
 * fall back to MSW-served mock data (NODE_ENV === 'test') or show empty state.
 */

import { cookies } from "next/headers"
import { createApiClient, createBanxeApi } from "@banxe/shared/api"

export const BANXE_API_URL =
  process.env.BANXE_API_URL ?? "http://localhost:8000"

/** Cookie name that stores the JWT access token (set on /auth/login) */
export const AUTH_COOKIE = "banxe_token"

/**
 * getServerApi — creates a fully-typed BANXE API instance for server components.
 * Must be called inside a React Server Component or Route Handler.
 */
export async function getServerApi() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value ?? null

  const client = createApiClient({
    baseUrl: BANXE_API_URL,
    getToken: () => token,
    onUnauthorized: () => {
      // In server components, we can't redirect directly — callers should check
      // for ApiError.status === 401 and use redirect() from 'next/navigation'
    },
  })

  return createBanxeApi(client)
}
