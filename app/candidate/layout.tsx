"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { requireAuth } from "@/auth"

export default function ProtectedLayout({children,}: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        requireAuth(router)
    }, [router])

    return <div className="min-h-screen bg-gray-50">{children}</div>
}

