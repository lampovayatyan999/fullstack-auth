'use client'

import { AuthWrapper } from "./AuthWrapper";
import { useForm } from 'react-hook-form' 
import { LoginSchema, ResetPasswordSchema, TypeResetPasswordSchema, type TypeLoginSchema, } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/Form";
import { Button, Input } from "@/shared/components/ui";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { useLoginMutation, useResetPasswordMutation } from "../hooks";

export function ResetPasswordForm() {
    const { theme } = useTheme()
    const [recaptchaValue, setRecapthchaValue] = useState<string | null>(null)

    
    const form = useForm<TypeResetPasswordSchema>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: ''
        }
    })

    const { resetPassword, isLoadingResetPassword } = useResetPasswordMutation()

    const onSubmit = (values: TypeResetPasswordSchema) => {
        if(recaptchaValue) {
            resetPassword({values, recaptcha: recaptchaValue})
        } else {
            toast.error('Please, done ReCaptcha')
        }
    }


    return <AuthWrapper
        heading="Password Recovery"
        description="For password recovery enter your email "
        backButtonLabel="Sign in account"
        backButtonHref="/auth/login"
        isShowSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 space-y-2" > 
                <FormField
                    control={form.control}
                    name='email'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='in@example.com' type="email" disabled={isLoadingResetPassword} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center">
                    <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecapthchaValue} theme={theme === 'light' ? 'light' : 'dark'} />
                </div>
                <Button type='submit' disabled={isLoadingResetPassword}>
                    Recovery password
                </Button>
            </form>
        </Form>
    </AuthWrapper>
}