// Centralized, typed API client with consistent error handling.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api"

export type UserRole = "patient" | "doctor" | "admin"

export interface AuthUser {
  id: number
  userName: string
  email?: string | null
  role: UserRole
}

export interface AuthResponse {
  message: string
  user: AuthUser
  token: string
}

export interface SubmitResult {
  transactionHash: string
  ipfsHash: string
  contentHash: string
  mlPrediction: string
  mlConfidence: number
}

export interface VerifyResult {
  valid: boolean
  message: string
  meta?: { contentHash: string; timestamp: string }
}

export interface HistoryItem {
  id: number
  patient_address: string
  file_name: string | null
  content_hash: string
  ipfs_cid: string | null
  tx_hash: string | null
  ml_prediction: string | null
  ml_confidence: number | null
  action: "submit" | "verify" | "repudiate"
  status: string
  created_at: string
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function parseError(res: Response, fallback: string): Promise<never> {
  let message = fallback
  try {
    const data = await res.json()
    message = data.message || data.error || fallback
  } catch {
    // non-JSON error body
  }
  throw new ApiError(message, res.status)
}

async function jsonRequest<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiError("Cannot reach the server. Please check your connection.", 0)
  }
  if (!res.ok) await parseError(res, "Request failed")
  return res.json() as Promise<T>
}

async function formRequest<T>(
  path: string,
  form: FormData,
  token: string,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
  } catch {
    throw new ApiError("Cannot reach the server. Please check your connection.", 0)
  }
  if (!res.ok) await parseError(res, "Request failed")
  return res.json() as Promise<T>
}

export const api = {
  signup: (input: {
    userName: string
    email?: string
    password: string
    role: UserRole
  }) => jsonRequest<AuthResponse>("/auth/signup", input),

  login: (input: { userName: string; password: string }) =>
    jsonRequest<AuthResponse>("/auth/login", input),

  submitReport: (
    input: { file: File; patientAddress: string },
    token: string,
  ): Promise<{ data: SubmitResult }> => {
    const form = new FormData()
    form.append("report", input.file)
    form.append("patientAddress", input.patientAddress)
    return formRequest("/reports/submit", form, token)
  },

  verifyReport: (
    input: { file: File; patientAddress: string },
    token: string,
  ): Promise<VerifyResult> => {
    const form = new FormData()
    form.append("report", input.file)
    form.append("patientAddress", input.patientAddress)
    return formRequest("/reports/verify", form, token)
  },

  getHistory: (token: string): Promise<{ data: HistoryItem[] }> =>
    fetch(`${API_URL}/reports/history`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) return parseError(res, "Could not load history")
      return res.json()
    }),

  health: (): Promise<unknown> =>
    fetch(`${API_URL}/health`).then((res) => res.json()),
}
