'use client'

import { type PropsWithChildren, useState } from "react";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

export function TanStackQueryProvider({
    children
}: PropsWithChildren<unknown>) {
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false
                }
            }
        })
    )
    
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}