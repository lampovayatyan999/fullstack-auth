import { useMutation } from "@tanstack/react-query"
import { TypeResetPasswordSchema } from "../schemes/reset-password.schema"
import { passwordRecoveryService } from "../services/password-recovery.service"
import { toastMessageHandler } from "@/shared/utils"
import { toast } from "sonner"
import { useRouter } from "next/router"
import { TypeNewPasswordSchema } from "../schemes/new-password.schema"
import { useSearchParams } from "next/navigation"

export function useNewPasswordMutation() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const token = searchParams.get('token')

    const {mutate: newPassword, isPending: isLoadingNewPassword } = useMutation({
        mutationKey: ['new Password'],
        mutationFn: ({ values, recaptcha }: {
            values: TypeNewPasswordSchema
            recaptcha: string
        }) => passwordRecoveryService.new(values, token, recaptcha),
        onSuccess() {
            toast.success('Password was successfullly changed', {
                description: 'Now you can sign in your account'
            })
            router.push('/dashboard/settings')
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {newPassword, isLoadingNewPassword}
}