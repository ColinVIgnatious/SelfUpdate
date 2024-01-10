'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from 'react-query'
import ReduxProvider from '@/redux/Provider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { useState } from 'react'

function Providers({ children }) {
	const [queryClient] = useState(() => new QueryClient())
	return (
		<NextUIProvider>
			<NextThemeProvider attribute="class" defaultTheme="light" themes={['light', 'dark']}>
				<QueryClientProvider client={queryClient}>
					<ReduxProvider>
						<main className="light text-foreground bg-background h-[100vh]">
							{children}
							<ToastProvider />
						</main>
					</ReduxProvider>
				</QueryClientProvider>
			</NextThemeProvider>
		</NextUIProvider>
	)
}

module.exports = { Providers }
