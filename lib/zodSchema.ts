import { z } from 'zod';


export const applicationSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(10, { message: "Please enter a valid phone number." }),
    gender: z.enum(["Male", "Female", "Prefer not to say"], { errorMap: () => ({ message: "Gender is required" }) }),
    resume: z
        .instanceof(File)
        .refine((file) => file.size <= 5000000, { message: "File size must be less than 5MB." })
        .refine((file) => file.type === "application/pdf", { message: "File must be a PDF." }),
})

export const signupSchema = z
    .object({
        name: z.string().min(2, {message: "Name must be at least 2 characters.",}),
        email: z.string().email({message: "Please enter a valid email address.",}),
        password: z.string().min(8, {message: "Password must be at least 8 characters.",}),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export const loginSchema = z.object({
    username: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
})


export type signupSchemaType = z.infer<typeof signupSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type applicationSchemaType = z.infer< typeof applicationSchema >
