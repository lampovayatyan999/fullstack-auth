import {Html} from '@react-email/html'
import {Body, Heading, Link, Tailwind, Text} from "@react-email/components"
import * as React from 'react'

interface ConfirmationTemplateProps {
    domain: string
    token: string
}

export function ConfirmationTemplate({domain, token}: ConfirmationTemplateProps) {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`


    return (
        <Tailwind>
            <Html>
                <Body className='text-black'>
                    <Heading>Confirm email address</Heading>
                    <Text>Hello! For confirming your email address, please, enter the next link</Text>
                    <Link href={confirmLink}>COnfirm email</Link>
                    <Text>This link is aviable for 1 hour. If you had not request confirmation, please ignore this message</Text>
                </Body>
            </Html>
        </Tailwind>
    )
}