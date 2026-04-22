import { MailService } from '@/libs/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ResetPasswordDto } from './dto/new-password.dto';
import {v4 as uuidv4} from 'uuid'
import { NewPasswordDto } from './dto/reset-password.dto';
import { TokenType } from '@prisma/client';
import { hash } from 'argon2';


@Injectable()
export class PassowrdRecoveryService {
    public constructor(private readonly prismaService: PrismaService, private readonly userService: UserService, private readonly mailService: MailService) {}

    public async resetPassword(dto: ResetPasswordDto) {
        const existingUser = await this.userService.findByEmail(dto.email)

        if(!existingUser) {
            throw new NotFoundException('User was not found. Please make sure that your entered data is right')
        }
        
        const passwordResetToken = await this.generatePasswordResetToken(existingUser.email)

        await this.mailService.sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token
        )

        return true
    }


    private async generatePasswordResetToken(email: string) {
        const token = uuidv4()
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.PASSWORD_RESET
            }
        })

        if(existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.PASSWORD_RESET
                }
            })
        }

        const passwordResetToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.PASSWORD_RESET
            }
        })

        return passwordResetToken
        
    }

    public async newPassword(dto: NewPasswordDto, token: string) {
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                token,
                type: TokenType.PASSWORD_RESET
            }
        })

        if(!existingToken) {
            throw new NotFoundException('Token was not found. Please, make sure you token is right')
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if(hasExpired) {
            throw new BadRequestException(
                'Token is expired. Please, request new aviable token'
            )
        }


        const existingUser = await this.userService.findByEmail(existingToken.email)

        if(!existingUser) {
            throw new NotFoundException('The user with pointed email was not found')
        }

        await this.prismaService.user.update({
            where: {
                id: existingToken.id
            },
            data: {
                password: await hash(dto.password)
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        })

        return true
    }
}
