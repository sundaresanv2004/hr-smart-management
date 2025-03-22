"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast} from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {applicationSchema, applicationSchemaType} from "@/lib/zodSchema";
// import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";


export default function JobApplicationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    // const { data: session } = useSession()
    const router = useRouter()

    // Initialize the form
    const form = useForm<applicationSchemaType>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            gender: undefined,
        },
    })

    // Handle form submission
    async function onSubmit(data: applicationSchemaType) {
        // Check if user is authenticated
        // if (!session) {
        //     toast({
        //         title: "Authentication Required",
        //         description: "Please log in to submit your application.",
        //         variant: "destructive",
        //     })
        //     router.push("/login")
        //     return
        // }

        setIsSubmitting(true)

        try {
            // Create a FormData object to send the file
            const formData = new FormData()
            formData.append("fullName", data.fullName)
            formData.append("email", data.email)
            formData.append("phone", data.phone)
            formData.append("gender", data.gender)

            formData.append("resume", data.resume)

            // Send the data to our API route
            const response = await fetch("/api/job-applications", {
                method: "POST",
                body: formData,
                // headers: {
                //     // Include the auth token from the session
                //     Authorization: `Bearer ${session?.accessToken}`,
                // },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to submit application")
            }

            // Show success message
            toast({
                title: "Application Submitted",
                description: "Your job application has been successfully submitted.",
            })

            // Reset the form
            form.reset()
        } catch (error) {
            console.error("Error submitting form:", error)
            toast({
                title: "Submission Failed",
                description:
                    error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email *</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="(123) 456-7890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="resume"
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Resume (PDF) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    onChange(file)
                                                }
                                            }}
                                            {...fieldProps}
                                        />
                                    </FormControl>
                                    <FormDescription>Upload your resume in PDF format (max 5MB).</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="flex justify-center text-sm text-muted-foreground">
                By submitting this application, you agree to our privacy policy and terms of service.
            </div>
        </div>
    )
}


