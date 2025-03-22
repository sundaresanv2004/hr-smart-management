"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginSchema, type loginSchemaType } from "@/lib/zodSchema"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(
        searchParams.get("error") === "OAuthAccountNotLinked"
            ? "Email already in use with different provider"
            : null
    )

    const form = useForm<loginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: loginSchemaType) => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid email or password")
                setIsLoading(false)
                return
            }

            router.push("/dashboard")
        } catch (error) {
            console.error(error)
            setError("An error occurred during sign in")
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        setError(null)
        await signIn("google", {
            callbackUrl: "/dashboard",
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Login to Agent Builder</h1>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-6">{error}</div>}

                <Button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 p-2.5 rounded-md hover:bg-gray-50 transition-colors mb-4"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Login with Google
                </Button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-xs text-gray-500 uppercase">OR LOGIN WITH EMAIL</span>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            type="email"
                                            className="bg-white text-gray-900 border-gray-300"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-600" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-gray-700">Password</FormLabel>
                                        <Link href="/forgot-password" className="text-xs text-violet-600 hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input type="password" className="bg-white text-gray-900 border-gray-300" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-600" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full p-2.5 rounded-md transition-colors flex flex-row items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader className="animate-spin" />}
                            {isLoading ? "Signing in..." : "Login with Email"}
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-6 text-sm text-gray-600">
                    Don&#39;t have an account?{" "}
                    <Link href="/signup" className="text-violet-600 hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
