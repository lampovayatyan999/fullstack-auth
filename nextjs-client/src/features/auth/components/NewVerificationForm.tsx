'use client'

import { useSearchParams } from "next/navigation"
import { useVerificationMutation } from "../hooks"
import { useEffect } from "react"
import { AuthWrapper } from "./AuthWrapper"
import { Loading } from "@/shared/components/ui/Loading"

export function NewVerificationForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const {verification} = useVerificationMutation()
    
    useEffect(() => {
        verification(token)
    }, [token])

    return <AuthWrapper heading="Email confirm">
        <div>
            <Loading />
        </div>
    </AuthWrapper>
}