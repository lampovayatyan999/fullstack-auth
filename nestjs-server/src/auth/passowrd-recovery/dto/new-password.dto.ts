import { IsEmail, IsNotEmpty } from "class-validator";


export class ResetPasswordDto {
    @IsEmail({}, {message: 'Enter correct email address'})
    @IsNotEmpty({message: 'Email field can not be empty'})
    email!: string
}