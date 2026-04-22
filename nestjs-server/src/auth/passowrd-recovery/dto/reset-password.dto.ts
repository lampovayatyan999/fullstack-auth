import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class NewPasswordDto {
    @IsString({message: 'Password must be int'})
    @MinLength(6, {message: 'Password must contain at least 6 symbols'})
    @IsNotEmpty({message: 'New Password field can not be empty'})
    password!: string
}