import {z} from 'zod'

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: 'Enter your name'
    }),
    email: z.string().email({
        message: 'incorrect email'
    }),
    password: z.string().min(6, {
        message: 'Password must contain at least 6 symbols'
    }),
    passwordRepeat: z.string().min(6, {
        message: 'Password must contain at least 6 symbols'
    })
}).refine(data => data.password === data.passwordRepeat, {
    message: 'Passwords not match',
    path: ['passwordRepeat']
})

export type TypeRegisterSchema = z.infer<typeof RegisterSchema>
