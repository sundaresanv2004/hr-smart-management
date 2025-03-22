"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout } from "@/auth"

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        logout() // Call logout to remove the token
        router.push("/candidate/login") // Redirect to login page after logout
    }

    return (
        <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            <span>Logout</span>
        </Button>
    )
}

