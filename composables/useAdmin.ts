export function useAdmin() {
  const isAdmin = useState("peratto-admin", () => false)
  const ready = useState("peratto-admin-ready", () => false)
  const csrfToken = useState<string | null>("peratto-admin-csrf", () => null)

  async function checkSession() {
    try {
      const result = await $fetch<{ ok: boolean; csrf?: string | null }>("/api/admin/session")
      isAdmin.value = Boolean(result.ok)
      csrfToken.value = result.ok ? result.csrf ?? null : null
    } catch {
      isAdmin.value = false
      csrfToken.value = null
    } finally {
      ready.value = true
    }
  }

  async function adminFetch<T>(url: string, options: { method?: "GET" | "POST"; body?: unknown } = {}) {
    const headers: Record<string, string> = {}
    if (options.method === "POST" && csrfToken.value) {
      headers["X-CSRF-Token"] = csrfToken.value
    }
    return $fetch<T>(url, {
      method: options.method ?? "GET",
      body: options.body,
      headers,
    })
  }

  async function login(user: string, password: string) {
    const result = await $fetch<{ ok: boolean; error?: string; csrf?: string }>("/api/admin/login", {
      method: "POST",
      body: { user, password },
    })
    isAdmin.value = Boolean(result.ok)
    csrfToken.value = result.ok ? result.csrf ?? null : null
    return result
  }

  async function logout() {
    await adminFetch("/api/admin/logout", { method: "POST" })
    isAdmin.value = false
    csrfToken.value = null
  }

  if (import.meta.client) {
    onMounted(checkSession)
  }

  return { isAdmin, ready, csrfToken, checkSession, adminFetch, login, logout }
}
