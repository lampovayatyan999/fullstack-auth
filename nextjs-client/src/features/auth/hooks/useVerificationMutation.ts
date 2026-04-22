import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { verificationService } from "../services";
import { toast } from "sonner";

export function useVerificationMutation () {
    const router = useRouter()

    const {mutate: verification} = useMutation({
        mutationKey: ['new Verification email'],
        mutationFn: (token: string | null) => verificationService.newVerification(token),
        
        onSuccess() {
            toast.success('Email successfully confirmed')
            router.push('/dashboard/settings')
        },
        onError() {
            router.push('/auth/login')
        }
    })

    return { verification }
} 