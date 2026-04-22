'use client'

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Loading } from "@/shared/components/ui";
import { useProfile } from "@/shared/hooks";
import { UserButton, UserButtonLoading } from "./UserButton";
import { useForm } from "react-hook-form";
import { SettingsSchema, TypeSettingsSchema } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/Form";
import { Switch } from "@/shared/components/ui/Switch";
import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation";

export function SettingsForm() {
    const {user, isLoading} = useProfile()

    const form = useForm<TypeSettingsSchema>({
        resolver: zodResolver(SettingsSchema),
        values: {
            name: user?.displayName || '',
            email: user?.email || '',
            isTwoFactorEnabled: user?.isTwoFactorEnabled || false 
        }
    })

    const { update, isLoadingUpdate } = useUpdateProfileMutation()

    const onSubmit = (values: TypeSettingsSchema) => {
        update(values)
    }

    if(!user) return null
    
    return <Card className="w-100 ">
        <CardHeader className="flex flex-row items-center justify-center">
            <CardTitle>Settings</CardTitle>
            {isLoading ? <UserButtonLoading /> : <UserButton user={user} />}
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <Loading />
            ) : (
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 space-y-2">
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='John' disabled={isLoadingUpdate} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        /> 
                        <FormField
                            control={form.control}
                            name='email'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder='in@example.com' type="email" disabled={isLoadingUpdate} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='isTwoFactorEnabled'
                            render={({field}) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <FormLabel>Two Factor Authentification</FormLabel>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoadingUpdate}>Save changes</Button>
                    </form>
                </FormProvider>
            )}
        </CardContent>
    </Card>
}