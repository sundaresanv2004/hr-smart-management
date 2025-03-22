"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getToken, isAuthenticated, getCurrentUser } from "@/auth"
import { useRouter, usePathname } from "next/navigation"

type User = {
    id?: string
    name?: string
    email: string
} | null

type AuthContextType = {
    user: User
    isLoading: boolean
    isAuthenticated: boolean
    checkAuth: () => boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    checkAuth: () => false,
})

export function SessionProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // Function to check authentication status
    const checkAuth = (): boolean => {
        const authenticated = isAuthenticated()
        const userData = getCurrentUser()

        setUser(authenticated ? userData : null)
        return authenticated
    }

    useEffect(() => {
        // Check authentication on initial load
        const authenticated = checkAuth()
        setIsLoading(false)

        // Redirect to login if accessing protected route without authentication
        const protectedRoutes = ['/candidate/apply']
        if (!authenticated && protectedRoutes.some(route => pathname?.startsWith(route))) {
            router.push('/candidate/login')
        }
    }, [pathname, router])

    return (
        <AuthContext.Provider
            value={{
        user,
            isLoading,
            isAuthenticated: !!user,
            checkAuth,
    }}
>
    {children}
    </AuthContext.Provider>
)
}

export const useSession = () => useContext(AuthContext)
