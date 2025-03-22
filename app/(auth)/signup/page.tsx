"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {signupImage} from "@/public/images";
import { signIn } from "next-auth/react"
import { signupSchema, type signupSchemaType } from "@/lib/zodSchema"

export default function SignupPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const form = useForm<signupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: signupSchemaType) => {
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Failed to register")
                setIsLoading(false)
                return
            }

            setSuccess("Account created successfully! Redirecting to login...")

            toast({
                title: "Account created successfully!",
                description: "You can now log in with your credentials.",
                variant: "default",
            })

            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (error) {
            console.error(error)
            setError(`An error occurred during registration`)
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await signIn("google", { callbackUrl: "/dashboard" })
        } catch (error) {
            console.error("Google sign-in error:", error)
            setError("Failed to sign in with Google")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Column - Image and Text */}
            <div className="w-full md:w-1/2 bg-gray-50 p-8 flex-col justify-center hidden md:flex">
                <div className="max-w-md mx-auto">
                    <div className="mb-8 flex justify-center md:justify-start">
                        <Image src={signupImage} alt="Agent Builder" width={420} height={240} />
                    </div>

                    <h1 className="text-3xl font-bold mb-4 text-gray-900">From 0 to AI bot in minutes</h1>
                    <p className="text-gray-600 mb-6">
                        Use a pre-built template or build your own with an intuitive drag & drop interface.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Deploy wherever you work</h2>
                    <p className="text-gray-600 mb-6">
                        Your bot works on your website, socials, messaging services and much more.
                    </p>
                </div>
            </div>

            {/* Right Column - Sign Up Form */}
            <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-white">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Get Started</h2>
                        <p className="text-gray-600 mt-2">Create your account to build AI agents</p>
                    </div>

                    {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">{error}</div>}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">{success}</div>
                    )}

                    <Button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 p-2.5 rounded-md hover:bg-gray-50 transition-colors"
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
                        Sign up with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-2 text-xs text-gray-500 uppercase">OR SIGN UP WITH EMAIL</span>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Your full name"
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
                                        <FormLabel className="text-gray-700">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" className="bg-white text-gray-900 border-gray-300" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" className="bg-white text-gray-900 border-gray-300" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full p-2.5 flex flex-row items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader className="animate-spin"/>
                                )}
                                {isLoading ? "Creating account..." : "Create account"}
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-violet-600 hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

