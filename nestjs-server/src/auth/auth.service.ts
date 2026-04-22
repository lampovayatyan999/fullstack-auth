import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod, User } from '@prisma/client';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
    public constructor(private readonly userService: UserService, 
        private readonly prismaService: PrismaService, 
        private readonly configService: ConfigService, 
        private readonly providerService: ProviderService, 
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly twoFactorAuthService: TwoFactorAuthService
    ) {}

    public async register( dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email)

        if(isExists) {
            throw new ConflictException('The registration is not succesfull. The user with this email is already exists. Please, use other email or log in into service')
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            '',
            AuthMethod.CREDENTIALS,
            false
        )

        await this.emailConfirmationService.sendVerificationToken(newUser.email)

        return {
            message: 'Your registretation is successfull. Please, confirm your email. The message is send to your email address'
        }
    }

    public async login(req: Request, dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email)

        if(!user || !user.password) {
            throw new NotFoundException('User was not found. Please check the writed data')
        }

        const isValidPassword = await verify(user.password, dto.password)

        if(!isValidPassword) {
            throw new UnauthorizedException('Wrong Password. please, try again or retard the password if you forgot it')
        }

        if(!user.isVerified) {
            await this.emailConfirmationService.sendVerificationToken(user.email)
            throw new UnauthorizedException(
                'Your email was not confirmed. Please check your mail and confirm address'
            )
        }

        if(user.isTwoFactorEnabled) {
            if(!dto.code) {
                await this.twoFactorAuthService.sendTwoFactorToken(user.email)

                return {
                    message: 'Check your email.'
                }
            }

            await this.twoFactorAuthService.validateTwoFactorToken(user.email, dto.code)
        }

        return this.saveSession(req, user)
    }

    public async extractProfileFromCode(req: Request, provider: string, code: string) {
        const providerInstance = this.providerService.findByService(provider)
        const profile = await providerInstance?.findUserByCode(code)

        const account = await this.prismaService.account.findFirst({
            where: {
                id: profile?.id,
                provider: profile?.provider
            }
        })

        let user = account?.userId ? await this.userService.findById(account.userId) : null

        if(user) {
            return this.saveSession(req, user)
        }
        if (!profile) {
            throw new BadRequestException(`Не удалось получить профиль от ${provider}`);
        }

        user = await this.userService.create(
            profile.email,
            '',
            profile.name,
            profile.picture,
            AuthMethod[profile.provider.toUpperCase()],
            true
        )

        if(!account) {
            await this.prismaService.account.create({
                data: {
                    userId: user.id,
                    type: 'oauth',
                    provider: profile.provider,
                    accessToken: profile.access_token,
                    refreshToken: profile.refresh_token,
                    expiresAt: profile.expires_at ?? 0
                }
            })
        }

        return this.saveSession(req, user)
    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if(err) {
                    return reject(
                        new InternalServerErrorException('Could not done the session. Perhaps, the problem with server or session was already resolved')
                    )
                }

                res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))

                resolve()
            })
        })
    }

    public async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id

            req.session.save(err => {
                if(err) {
                    return reject(
                        new InternalServerErrorException(
                            'Could not save session. Please, check the parametres of session'
                        )
                    )
                }

                resolve({
                    user
                })
            })
        })
    }
}
