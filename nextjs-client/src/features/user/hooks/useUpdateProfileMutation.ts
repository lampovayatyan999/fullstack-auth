import { useMutation } from "@tanstack/react-query";
import { userService } from "../services";
import { TypeSettingsSchema } from "../schemes";
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils";

export function useUpdateProfileMutation() {
    const {mutate: update, isPending: isLoadingUpdate} = useMutation({
        mutationKey: ['update profile'],
        mutationFn: (data: TypeSettingsSchema) => userService.updateProfile(data),
        onSuccess() {
            toast.success('Profile successfully updated')
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {update, isLoadingUpdate}
}