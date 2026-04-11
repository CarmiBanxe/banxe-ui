"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { BANXE_API_URL, AUTH_COOKIE } from "@/lib/api"

interface LoginResponse {
  token: string
  token_type?: string
  expires_in?: number
}

/**
 * loginAction — Server Action for POST /v1/auth/login
 *
 * Called from the Client Component login form.
 * On success: sets httpOnly banxe_token cookie → redirects to /dashboard.
 * On failure: returns an error string (never throws — the client renders it).
 */
export async function loginAction(
  email: string,
  pin: string
): Promise<string> {
  let res: Response
  try {
    res = await fetch(`${BANXE_API_URL}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pin }),
      // No cache — auth must always hit the server
      cache: "no-store",
    })
  } catch {
    return "Cannot reach the server. Please try again later."
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null) as { detail?: string } | null
    if (res.status === 401 || res.status === 403) {
      return "Invalid email or PIN. Please try again."
    }
    if (res.status === 422) {
      return "Please enter a valid email and 6-digit PIN."
    }
    return body?.detail ?? `Login failed (${res.status}). Please try again.`
  }

  const { token } = (await res.json()) as LoginResponse

  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 h
  })

  redirect("/dashboard")
}
