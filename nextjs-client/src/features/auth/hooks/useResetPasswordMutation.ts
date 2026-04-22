import { useMutation } from "@tanstack/react-query"
import { TypeResetPasswordSchema } from "../schemes/reset-password.schema"
import { passwordRecoveryService } from "../services/password-recovery.service"
import { toastMessageHandler } from "@/shared/utils"
import { toast } from "sonner"
import { useRouter } from "next/router"

export function useResetPasswordMutation() {
    const router = useRouter()

    const {mutate: resetPassword, isPending: isLoadingResetPassword } = useMutation({
        mutationKey: ['reset Password'],
        mutationFn: ({ values, recaptcha }: {
            values: TypeResetPasswordSchema,
            recaptcha: string
        }) => passwordRecoveryService.reset(values, recaptcha),
        onSuccess() {
            toast.success('Check your email', {
                description: 'On your email was send the link for confirmation '
            })
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {resetPassword, isLoadingResetPassword}
}