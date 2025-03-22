// auth.ts

export const setToken = (token: string) => {
  localStorage.setItem("token", token) // Store in localStorage
  document.cookie = `token=${token}; path=/;` // Store in cookies if needed
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null

  // First, check localStorage
  const token = localStorage.getItem("token")
  if (token) return token

  // Check cookies (optional)
  const cookies = document.cookie.split("; ")
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=")
    if (name === "token") return value
  }

  return null // No token found
}

export const logout = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem("token") // Remove from localStorage
  localStorage.removeItem("user") // Remove user data
  sessionStorage.removeItem("token") // Remove from sessionStorage (if used)
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // Remove from cookies

  // Optional: Call backend logout endpoint
  try {
    fetch("http://192.168.120.28:8000/application/logout", {
      method: "POST",
      credentials: "include",
    }).catch(console.error)
  } catch (error) {
    console.error("Logout error:", error)
  }
}

export const isAuthenticated = (): boolean => {
  return getToken() !== null // Check if token exists
}

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

// Function to check if user is authenticated and redirect if not
export const requireAuth = (router: any) => {
  if (typeof window !== "undefined" && !isAuthenticated()) {
    router.push("/candidate/login")
    return false
  }
  return true
}

