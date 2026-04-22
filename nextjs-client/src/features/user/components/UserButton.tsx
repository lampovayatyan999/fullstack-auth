import { useProfile } from "@/shared/hooks"
import { useLogoutMutation } from "../hooks"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/Avatar"
import { LogOut } from "lucide-react"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { IUser } from "@/features/auth/types"

interface UserButtonProps {
    user: IUser
}

export function UserButton({user}: UserButtonProps) {
    const {logout, isLoadingLogout} = useLogoutMutation()
    
    if(!user) return null
    
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user.picture} />
                    <AvatarFallback>{user.displayName.slice(0, 1)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuItem disabled={isLoadingLogout} onClick={() => logout()}>
                    <LogOut className="mr-2 size-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function UserButtonLoading() {
    return <Skeleton className='h-10 w-10 rounded-full' />
}