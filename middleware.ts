import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    // Use getToken instead of auth() for compatibility with older Next.js versions
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    })

    const isAuthenticated = !!token
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If the user is logged in and trying to access auth pages, redirect to dashboard
    const isAuthRoute = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup"

    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

// Match all routes that should be protected
export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
}

