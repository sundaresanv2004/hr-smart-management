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

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Login</h1>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-6">{error}</div>}

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
                    <Link href="/candidate/register" className="text-violet-600 hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
