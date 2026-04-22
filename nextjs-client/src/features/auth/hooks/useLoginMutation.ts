import { useMutation } from "@tanstack/react-query";
import { authService } from "../services";
import { TypeLoginSchema } from "../schemes";
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export function useLoginMutation(setIsShowTwoFactor: Dispatch<SetStateAction<boolean>>) {
    const router = useRouter()

    const {mutate: login, isPending: isLoadingLogin } = useMutation({
        mutationKey: ['login user'],
        mutationFn: ({ values, recaptcha }: {
            values: TypeLoginSchema
            recaptcha: string
        }) => authService.login(values, recaptcha),
        onSuccess(data: any) {
            if(data.message) {
                toastMessageHandler(data)
                setIsShowTwoFactor(true)
            } else {
                toast.success('Successfull authorization')
                router.push('/dashboard/settings')
            }
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {login, isLoadingLogin}
}