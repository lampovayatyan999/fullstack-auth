import { NewPasswordForm } from "@/features/auth/components/NewPasswordForm";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'New password'
}

export default function NewPasswordPage() {
    return <NewPasswordForm />
}