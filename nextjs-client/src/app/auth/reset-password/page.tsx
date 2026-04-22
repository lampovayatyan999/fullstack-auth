import { ResetPasswordForm } from "@/features/auth/components";
import { Metadata } from "next";



export const metadata: Metadata = {
    title: 'Password recovery'
}

export default function ResetPasswordPage() {
    return <ResetPasswordForm />
}