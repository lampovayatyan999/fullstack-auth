'use client'

import { AuthWrapper } from "./AuthWrapper";
import { useForm } from 'react-hook-form' 
import { LoginSchema, type TypeLoginSchema, } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/Form";
import { Button, Input } from "@/shared/components/ui";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { useLoginMutation } from "../hooks";
import Link from "next/link";

export function LoginForm() {
    const { theme } = useTheme()
    const [recaptchaValue, setRecapthchaValue] = useState<string | null>(null)

    const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
    
    const form = useForm<TypeLoginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const {login, isLoadingLogin} = useLoginMutation(setIsShowTwoFactor)

    const onSubmit = (values: TypeLoginSchema) => {
        if(recaptchaValue) {
            login({values, recaptcha: recaptchaValue})
        } else {
            toast.error('Please, done ReCaptcha')
        }
    }


    return <AuthWrapper
        heading="Login"
        description="To sign up the site please enter your email and password "
        backButtonLabel="Do not have an account? Sign up"
        backButtonHref="/auth/register"
        isShowSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 space-y-2" > 
                {isShowTwoFactor && (
                    <FormField
                        control={form.control}
                        name='code'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input placeholder='123456' disabled={isLoadingLogin} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {!isShowTwoFactor && (
                    <>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='in@example.com' type="email" disabled={isLoadingLogin} {...field} />
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
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Link
                                            href='/auth/reset-password'
                                            className='ml-auto inline-block text-sm underline'
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input placeholder='********' type="password" disabled={isLoadingLogin} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>                
                )}
                <div className="flex justify-center">
                    <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecapthchaValue} theme={theme === 'light' ? 'light' : 'dark'} />
                </div>
                <Button type='submit' disabled={isLoadingLogin}>
                    Sign in account
                </Button>
            </form>
        </Form>
    </AuthWrapper>
}