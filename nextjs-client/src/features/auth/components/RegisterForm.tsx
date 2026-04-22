'use client'

import { AuthWrapper } from "./AuthWrapper";
import { useForm } from 'react-hook-form' 
import { RegisterSchema, TypeRegisterSchema } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/Form";
import { Button, Input } from "@/shared/components/ui";
import { useTheme } from "next-themes";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { useRegisterMutation } from "../hooks";

export function RegisterForm() {
    const { theme } = useTheme()
    const [recaptchaValue, setRecapthchaValue] = useState<string | null>(null)

    const form = useForm<TypeRegisterSchema>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordRepeat: ''
        }
    })

    const {register, isLoadingRegister} = useRegisterMutation()

    const onSubmit = (values: TypeRegisterSchema) => {
        if(recaptchaValue) {
            register({values, recaptcha: recaptchaValue})
        } else {
            toast.error('Please, done ReCaptcha')
        }
    }

    return <AuthWrapper
        heading="Register"
        description="To sign up the site please enter your email and password "
        backButtonLabel="Already have an account? sign in"
        backButtonHref="/auth/login"
        isShowSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 space-y-2" >
                <FormField
                    control={form.control}
                    name='name'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='John' disabled={isLoadingRegister} {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                /> 
                <FormField
                    control={form.control}
                    name='email'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='in@example.com' disabled={isLoadingRegister} type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder='********' disabled={isLoadingRegister} type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='passwordRepeat'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Repeat the password</FormLabel>
                            <FormControl>
                                <Input placeholder='********' disabled={isLoadingRegister} type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center">
                    <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecapthchaValue} theme={theme === 'light' ? 'light' : 'dark'} />
                </div>
                <Button type='submit' disabled={isLoadingRegister}>
                    Create an account
                </Button>
            </form>
        </Form>
    </AuthWrapper>
}