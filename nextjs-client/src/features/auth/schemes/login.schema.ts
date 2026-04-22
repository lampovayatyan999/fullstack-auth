import {z} from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'incorrect email'
    }),
    password: z.string().min(6, {
        message: 'Password must contain at least 6 symbols'
    }),
    code: z.optional(z.string())
})

export type TypeLoginSchema = z.infer<typeof LoginSchema>
