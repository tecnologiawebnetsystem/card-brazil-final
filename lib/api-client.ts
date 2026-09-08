export type ApiFieldErrors = Record<string, string[]>

export class ApiClientError extends Error {
  status: number
  code?: string
  fieldErrors?: ApiFieldErrors

  constructor(message: string, options: { status: number; code?: string; fieldErrors?: ApiFieldErrors }) {
    super(message)
    this.name = "ApiClientError"
    this.status = options.status
    this.code = options.code
    this.fieldErrors = options.fieldErrors
  }
}

export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  })

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean
    data?: T
    message?: string
    error?: string
    code?: string
    errors?: ApiFieldErrors
  }

  if (!response.ok || payload.success === false) {
    throw new ApiClientError(payload.message || payload.error || "Não foi possível concluir a operação.", {
      status: response.status,
      code: payload.code,
      fieldErrors: payload.errors,
    })
  }

  return ("data" in payload ? payload.data : payload) as T
}

export async function apiMutation<T>(url: string, method: "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown) {
  return apiFetch<T>(url, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

export class ApiClient {
  static get<T>(endpoint: string) { return apiFetch<T>(endpoint) }
  static post<T>(endpoint: string, data: unknown) { return apiMutation<T>(endpoint, "POST", data) }
  static put<T>(endpoint: string, data: unknown) { return apiMutation<T>(endpoint, "PUT", data) }
  static delete<T>(endpoint: string) { return apiMutation<T>(endpoint, "DELETE") }
}
