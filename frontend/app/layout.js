import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Selfupdate',
	description: 'Online Learning Platform',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
