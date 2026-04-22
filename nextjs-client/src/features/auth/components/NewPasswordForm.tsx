import { useTheme } from "next-themes"
import { useForm } from "react-hook-form"
import { useLoginMutation } from "../hooks"
import { toast } from "sonner"
import { AuthWrapper } from "./AuthWrapper"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/Form"
import { Button, Input } from "@/shared/components/ui"
import Link from "next/link"
import ReCAPTCHA from "react-google-recaptcha"
import { NewPasswordSchema, TypeNewPasswordSchema } from "../schemes/new-password.schema"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNewPasswordMutation } from "../hooks/useNewPasswordMutation"

export function NewPasswordForm() {
    const { theme } = useTheme()
    const [recaptchaValue, setRecapthchaValue] = useState<string | null>(null)

    
    const form = useForm<TypeNewPasswordSchema>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        }
    })

    const {newPassword, isLoadingNewPassword} = useNewPasswordMutation()

    const onSubmit = (values: TypeNewPasswordSchema) => {
        if(recaptchaValue) {
            newPassword({values, recaptcha: recaptchaValue})
        } else {
            toast.error('Please, done ReCaptcha')
        }
    }


    return <AuthWrapper
        heading="New password"
        description="Write a new password for your account"
        backButtonLabel="Sign in account"
        backButtonHref="/auth/login"
        isShowSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 space-y-2" > 
                <FormField
                    control={form.control}
                    name='password'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder='********' type="password" disabled={isLoadingNewPassword} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center">
                    <ReCAPTCHA sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string} onChange={setRecapthchaValue} theme={theme === 'light' ? 'light' : 'dark'} />
                </div>
                <Button type='submit' disabled={isLoadingNewPassword}>
                    Continue
                </Button>
            </form>
        </Form>
    </AuthWrapper>
}