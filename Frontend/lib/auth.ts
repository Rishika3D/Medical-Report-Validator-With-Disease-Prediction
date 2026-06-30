// Persist the auth session in localStorage so a refresh keeps the user signed in.
import type { AuthUser } from "./api"

const TOKEN_KEY = "medichain.token"
const USER_KEY = "medichain.user"

export interface Session {
  token: string
  user: AuthUser
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(TOKEN_KEY)
  const userRaw = localStorage.getItem(USER_KEY)
  if (!token || !userRaw) return null
  try {
    return { token, user: JSON.parse(userRaw) as AuthUser }
  } catch {
    return null
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/** Decode a JWT exp claim and return true if expired (best-effort, no verification). */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now()
  } catch {
    return false
  }
}
