"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {applicationSchema, applicationSchemaType} from "@/lib/zodSchema";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function JobApplicationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<applicationSchemaType>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            gender: undefined,
        },
    })

    async function onSubmit(data: applicationSchemaType) {
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("fullName", data.fullName)
            formData.append("email", data.email)
            formData.append("phone", data.phone)
            formData.append("gender", data.gender)

            console.log(formData)
            console.log(data.resume)

            formData.append("resume", data.resume)

            const response = await fetch("http://192.168.72.28:8000/application/resume_upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to submit application")
            }

            toast({
                title: "Application Submitted",
                description: "Your job application has been successfully submitted.",
            })


            form.reset()
        } catch (error) {
            console.error("Error submitting form:", error)
            toast({
                title: "Submission Failed",
                description: "There was an error submitting your application. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
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
                                            <Input placeholder="(+91)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Gender</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="Select your gender"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
                                            <SelectItem value="OTHERS">Prefer not to say</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

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

