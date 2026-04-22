import { api } from "@/shared/api";
import { TypeLoginSchema, TypeRegisterSchema } from "../schemes";
import { IUser } from "../types/user.types";
import { TypeResetPasswordSchema } from "../schemes/reset-password.schema";
import { TypeNewPasswordSchema } from "../schemes/new-password.schema";

class PasswordRecoveryService {
    public async reset(body: TypeResetPasswordSchema, recaptcha?: string) {
        const headers = recaptcha ? {recaptcha} : undefined

        const response = await api.post<IUser>('auth/password-reoovery/reset', body, {
            headers
        })

        return response
    }

    public async new(body: TypeNewPasswordSchema, token: string | null, recaptcha?: string) {
        const headers = recaptcha ? {recaptcha} : undefined

        const response = await api.post<IUser>('auth/password-reoovery/new/${token}', body, {
            headers
        })

        return response
    }
}

export const passwordRecoveryService = new PasswordRecoveryService()